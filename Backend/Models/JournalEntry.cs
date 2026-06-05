using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class JournalEntry
    {
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public string Description { get; set; } = string.Empty; // e.g., "Bought office laptops"

        // The envelope belongs to a business
        public int BusinessId { get; set; }
        public Business? Business { get; set; }

        // The envelope holds multiple slips of paper
        public List<JournalEntryLine> Lines { get; set; } = new();
    }
}