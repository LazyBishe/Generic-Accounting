using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class AccountDto
    {
        [Required]
        public int AccountNumber { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty; // e.g., "Cash", "Internet Bill"

        [Required]
        public string AccountType { get; set; } = string.Empty; // e.g., "Asset", "Expense"

        [Required]
        public int BusinessId { get; set; } // Which business owns this bucket?
    }
}