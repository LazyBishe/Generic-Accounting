using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    // The instructions for a single slip of paper
    public class JournalEntryLineDto
    {
        [Required]
        public int AccountId { get; set; }
        public decimal Debit { get; set; } = 0;
        public decimal Credit { get; set; } = 0;
        public string Description { get; set; } = string.Empty;
    }

    // The instructions for the whole envelope
    public class JournalEntryDto
    {
        [Required]
        public DateTime Date { get; set; }
        
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public int BusinessId { get; set; } 

        [Required]
        // This holds the list of the paper slips!
        public List<JournalEntryLineDto> Lines { get; set; } = new();
    }
}