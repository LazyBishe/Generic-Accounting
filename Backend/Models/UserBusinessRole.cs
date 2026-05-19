namespace Backend.Models
{
    public class UserBusinessRole
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int BusinessId { get; set; }
        public Business Business { get; set; } = null!;

        public string Role { get; set; } = "Accountant"; // Default role
    }
}