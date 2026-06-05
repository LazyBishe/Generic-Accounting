using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using Backend.Models;
using Backend.DTOs;
using Backend.Data;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public AuthController(ApiDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            // 1. Check if the email is already taken
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("A user with this email already exists.");
            }

            // 2. Hash the plain-text password securely
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // 3. Create the User entity
            var newUser = new User
            {
                Email = dto.Email,
                PasswordHash = hashedPassword,
                FullName = dto.FullName,
                Phone = dto.Phone
            };

            // 4. Create the Business entity
            var newBusiness = new Business
            {
                Name = dto.BusinessName,
                BusinessType = dto.BusinessType,
                Accounts = new List<Account>
                {
                    new Account { Name = "Cash on Hand", AccountType = "Asset" },
                    new Account { Name = "Bank Account", AccountType = "Asset" },
                    new Account { Name = "Sales Revenue", AccountType = "Revenue" },
                    new Account { Name = "Rent Expense", AccountType = "Expense" },
                    new Account { Name = "Owner's Equity", AccountType = "Equity" }
                }
            };

            // 5. Create the Bridge entity to link them as an "Accountant"
            var userBusinessRole = new UserBusinessRole
            {
                User = newUser,
                Business = newBusiness,
                Role = "Owner"
            };


            // 6. Tell Entity Framework to track these new entries
            _context.Users.Add(newUser);
            _context.Businesses.Add(newBusiness);
            _context.UserBusinessRoles.Add(userBusinessRole);

            // 7. Push all changes to SQL Server in a single atomic transaction
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful! Business and Accountant onboarded." });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password.");
            }
            var userBusiness = await _context.UserBusinessRoles
                                                 .FirstOrDefaultAsync(ub => ub.UserId == user.Id);

            // 1. Generate the Token (Notice we are passing userBusiness into it now!)
            var token = GenerateJwtToken(user, userBusiness);

            // 2. Return the token to React
            return Ok(new
            {
                token = token,
                message = "Login successful!",
                userEmail = user.Email
            });
        }
        [HttpPost("hire")]
        [Authorize] // 🛡️ Bouncer checks if they have a badge at all
        public async Task<IActionResult> HireEmployee([FromBody] HireEmployeeDto dto)
        {
            // 1. READ THE BADGE: Who is making this request?
            // (We wrote these onto the token in Chunk 1!)
            var callerRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var callerBusinessIdString = User.FindFirst("BusinessId")?.Value;

            // 2. VIP CHECK: Are they an Owner?
            if (callerRole != "Owner" || string.IsNullOrEmpty(callerBusinessIdString))
            {
                return Forbid("Access Denied: Only Business Owners can hire employees.");
            }

            // 3. Convert the BusinessId to a number
            int businessId = int.Parse(callerBusinessIdString);

            // 4. Check if the employee's email already exists
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest("That email is already registered.");
            }

            // 5. CREATE THE NEW USER (The Employee)
            var newEmployee = new User
            {
                Email = dto.Email,
                FullName = dto.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(newEmployee);
            await _context.SaveChangesAsync(); // We must save here to generate their new ID!

            // 6. THE BRIDGE: Link the new employee to the Owner's business!
            var bridgeLink = new UserBusinessRole
            {
                UserId = newEmployee.Id,
                BusinessId = businessId, // 👈 We grabbed this straight off the Owner's badge!
                Role = dto.Role // e.g., "Cashier"
            };

            _context.UserBusinessRoles.Add(bridgeLink);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Successfully hired {dto.FullName} as a {dto.Role}!" });
        }

        [HttpGet("team")]
        [Authorize]
        public async Task<IActionResult> GetTeam()
        {
            // 1. Get the BusinessId from the token
            var businessIdString = User.FindFirst("BusinessId")?.Value;
            if (string.IsNullOrEmpty(businessIdString)) return Unauthorized();

            int businessId = int.Parse(businessIdString);

            // 2. Find all users linked to this BusinessId
            var team = await _context.UserBusinessRoles
                .Include(ub => ub.User) // Get the actual User details (Name/Email)
                .Where(ub => ub.BusinessId == businessId)
                .Select(ub => new
                {
                    ub.User.FullName,
                    ub.User.Email,
                    ub.Role
                })
                .ToListAsync();

            return Ok(team);
        }

        // 🌟 NEW: Added UserBusinessRole to the parameters
        private string GenerateJwtToken(User user, UserBusinessRole? userBusiness)
        {
            // Changed to a List so we can dynamically add things
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim("FullName", user.FullName)
    };

            // 🌟 NEW: If they belong to a business, stamp it on the badge!
            if (userBusiness != null)
            {
                claims.Add(new Claim("BusinessId", userBusiness.BusinessId.ToString()));
                claims.Add(new Claim(ClaimTypes.Role, userBusiness.Role)); // e.g., "Owner" or "Cashier"
            }

            // ... The rest of your token generation code (signing the token, etc.) stays exactly the same!
            // (Make sure to pass claims to your JwtSecurityToken instead of claims.ToArray() if needed)

            // Grab the secret key from appsettings
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("A_Very_Long_And_Super_Secret_Key_1234567890"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create the token object
            var token = new JwtSecurityToken(
                issuer: "MyAccountingApp",
                audience: "MyAccountingAppUsers",
                claims: claims,
                expires: DateTime.Now.AddDays(1), // Badge is valid for 24 hours
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}