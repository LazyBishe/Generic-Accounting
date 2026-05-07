using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
// Make sure to add your project's namespace here if needed!
namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public ExpensesController(ApiDbContext context)
        {
            _context = context;
        }

        // GET: api/expenses
        // Fetches all expenses from the database
        // GET: api/expenses?date=2024-05-02
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses([FromQuery] DateTime? date)
        {
            
            // 1. If React didn't send a date, just return everything like normal
            if (date == null)
            {
                return await _context.Expenses.ToListAsync();
            }

            // 2. If React DID send a date, filter the database!
            // We use .Date to ignore the hours/minutes and just match the day
            var filteredExpenses = await _context.Expenses
                .Where(e => e.Date.Date == date.Value.Date)
                .ToListAsync();
            Console.WriteLine(filteredExpenses); // Debugging line
            return filteredExpenses;
        }

        // POST: api/expenses
        // Adds a new expense to the database
        [HttpPost]
        public async Task<ActionResult<Expense>> PostExpense(Expense expense)
        {
            Console.WriteLine("Received expense from React: " + expense.Name + ", " + expense.Amount + ", " + expense.Date); // Debugging line
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
            Console.WriteLine("Expense added to database: " + expense.Name + ", " + expense.Amount + ", " + expense.Date); // Debugging line
            return CreatedAtAction(nameof(GetExpenses), new { id = expense.Id }, expense);
        }
        
        // DELETE: api/expenses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound();
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // PUT: api/expenses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, Expense updatedExpense)
        {
            // 1. Safety Check: Does the URL ID match the JSON ID?
            if (id != updatedExpense.Id)
            {
                return BadRequest(); // Returns a 400 error
            }

            // 2. Find the existing item in the database
            var existingExpense = await _context.Expenses.FindAsync(id);
            if (existingExpense == null)
            {
                return NotFound(); // Returns a 404 error
            }

            // 3. Update the item's properties with the new values
            existingExpense.Name = updatedExpense.Name;
            existingExpense.Amount = updatedExpense.Amount;

            // 4. Save the changes to the database
            await _context.SaveChangesAsync();

            // 5. Send a success receipt back to React
            return NoContent(); // Returns a 204
        }


    }

}