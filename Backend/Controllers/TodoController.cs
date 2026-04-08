using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")] // This makes the URL: http://localhost:xxxx/api/todo
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public TodoController(ApiDbContext context)
        {
            _context = context;
        }

        // GET: api/todo (Fetch all tasks)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
        {
            return await _context.TodoItems.ToListAsync();
        }

        // POST: api/todo (Create a new task)
        [HttpPost]
        public async Task<ActionResult<TodoItem>> CreateTodoItem(TodoItem item)
        {
            _context.TodoItems.Add(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, TodoItem updatedTask)
        {
            // 1. Security Check: Does the URL ID match the Data ID?
            if (id != updatedTask.Id)
            {
                return BadRequest("The ID in the URL must match the ID in your data.");
            }

            // 2. The Search: Look for the task in the database
            var existingTask = await _context.TodoItems.FindAsync(id);
            if (existingTask == null)
            {
                return NotFound("Task not found.");
            }

            // 3. The Swap: Update the old values with the new values
            existingTask.Title = updatedTask.Title;
            existingTask.IsCompleted = updatedTask.IsCompleted;

            // 4. The Save: Push changes to SQL Server
            await _context.SaveChangesAsync();

            // 5. The Confirmation: Return the newly updated task
            return Ok(existingTask);
        }
        // DELETE: api/Todo/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            // 1. Find the task in the database
            var taskToDelete = await _context.TodoItems.FindAsync(id);
            if (taskToDelete == null)
            {
                return NotFound("Task not found.");
            }

            // 2. Remove it from the tracking context
            _context.TodoItems.Remove(taskToDelete);

            // 3. Save the changes to SQL Server
            await _context.SaveChangesAsync();

            // 4. Return the standard success code for deletion
            return NoContent();
        }
    }
}