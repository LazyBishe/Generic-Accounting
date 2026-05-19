using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
                BusinessType = dto.BusinessType
            };

            // 5. Create the Bridge entity to link them as an "Accountant"
            var userBusinessRole = new UserBusinessRole
            {
                User = newUser,
                Business = newBusiness,
                Role = dto.Role // Using the role provided in the DTO
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

            // 1. Generate the Token
            var token = GenerateJwtToken(user);

            // 2. Return the token to React
            return Ok(new
            {
                token = token,
                message = "Login successful!",
                userEmail = user.Email
            });
        }

        private string GenerateJwtToken(User user)
        {
            // The "Claims" are the pieces of info we want to bake into the badge
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim("FullName", user.FullName)
    };

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