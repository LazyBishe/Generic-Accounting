using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class JournalEntryLine
    {
        public int Id { get; set; }

        // Which envelope does this slip belong to?
        public int JournalEntryId { get; set; }
        public JournalEntry? JournalEntry { get; set; }

        // Which bucket are we putting money into or taking it out of?
        public int AccountId { get; set; }
        public Account? Account { get; set; }

        // The Money! (One will be filled, the other will be 0)
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Debit { get; set; } = 0;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Credit { get; set; } = 0;
        
        public string Description { get; set; } = string.Empty; // Optional specific line note
    }
}