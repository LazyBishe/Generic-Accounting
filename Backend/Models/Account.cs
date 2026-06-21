using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Account
    {
        public int Id { get; set; }
       
        [Required]
        public int AccountNumber { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty; // e.g., "Cash", "Rent Expense", "Sales"

        [Required]
        public string AccountType { get; set; } = string.Empty; // "Asset", "Liability", "Equity", "Revenue", "Expense"

        // Every account belongs to a specific business
        public int BusinessId { get; set; }
        public Business? Business { get; set; }
    }
}