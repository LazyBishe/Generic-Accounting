namespace Backend.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string BusinessType { get; set; } = string.Empty; // e.g. "Salon", "Retail"
        public string Address { get; set; } = string.Empty;

        // Relationship: A business can have many users (Accountant, Owner, etc.)
        public List<UserBusinessRole> UserBusinessRoles { get; set; } = new();
    }
}