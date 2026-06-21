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
            var newBusiness = new Business { Name = dto.BusinessName, BusinessType = dto.BusinessType };
            _context.Businesses.Add(newBusiness);
            await _context.SaveChangesAsync();

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // 3. Create the User entity
            var newUser = new User
            {
                Email = dto.Email,
                PasswordHash = hashedPassword,
                FullName = dto.FullName,
                Phone = dto.Phone,
                BusinessId = newBusiness.Id
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password.");
            }

            // 1. Generate the Token (Notice we are passing userBusiness into it now!)
            var token = GenerateJwtToken(user);
            return Ok(new 
            { 
                token=token, 
                message = "Login successful!", 
                userEmail = user.Email 
            });
        }
        private string GenerateJwtToken(User user)
        {
            // Changed to a List so we can dynamically add things
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim("FullName", user.FullName),
        new Claim("BusinessId", user.BusinessId.ToString())
    };

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