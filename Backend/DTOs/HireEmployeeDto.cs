namespace Backend.DTOs // Make sure this matches your actual namespace!
{
    public class HireEmployeeDto
    {
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; } // "Cashier" or "Accountant"
    }
}