using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string FullName { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        [Required]
        public string BusinessName { get; set; } = string.Empty;

        [Required]
        public string BusinessType { get; set; } = string.Empty;
        
        [Required]
        public string Role { get; set; } = string.Empty;
    }
}