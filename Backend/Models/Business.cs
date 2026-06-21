namespace Backend.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string BusinessType { get; set; } = string.Empty; // e.g. "Salon", "Retail"
        public string Address { get; set; } = string.Empty;

        // A business owns its own unique chart of accounts
        public List<Account> Accounts { get; set; } = new();

        // A business owns all its journal envelopes
        public List<JournalEntry> JournalEntries { get; set; } = new();
    }
}