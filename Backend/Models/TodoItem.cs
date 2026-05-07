using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class TodoItem
    {
        public int Id { get; set; }
        
        public string Title { get; set; } = string.Empty;
        
        public bool IsCompleted { get; set; }
        public DateTime Date { get; set; }

    }
    public class Expense
{
    public int Id { get; set; }
    public string? Name { get; set; } // e.g., "Coffee"
    
   [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}
}