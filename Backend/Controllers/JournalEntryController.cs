using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{
    [Authorize] // 🛡️ THE BOUNCER: You MUST have a valid JWT token to even talk to this controller!
    [ApiController]
    [Route("api/[controller]")]
    public class JournalEntryController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public JournalEntryController(ApiDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEntry([FromBody] JournalEntryDto dto)
        {

            var businessIdClaim = User.FindFirst("BusinessId")?.Value;
            if (string.IsNullOrEmpty(businessIdClaim))
            {
                return Unauthorized("Your token does not contain a Business ID.");
            }
            int businessId = int.Parse(businessIdClaim);
            // --- RULE 1: The Golden Rule of Accounting ---
            // Calculate the total of all Debits, and the total of all Credits
            decimal totalDebits = dto.Lines.Sum(l => l.Debit);
            decimal totalCredits = dto.Lines.Sum(l => l.Credit);

            // If they don't match, reject the envelope immediately!
            if (totalDebits != totalCredits)
            {
                return BadRequest(new { message = $"Accounting Error: Debits ({totalDebits}) do not equal Credits ({totalCredits})." });
            }

            // --- RULE 2: No Empty Envelopes ---
            if (dto.Lines.Count < 2)
            {
                return BadRequest(new { message = "A journal entry must have at least two lines." });
            }

            // --- ALL CHECKS PASSED: Build the actual Database Objects ---
            var entry = new JournalEntry
            {
                Date = dto.Date,
                Description = dto.Description,
                BusinessId = businessId,
                // Loop through the DTO lines and turn them into actual Database Lines
                Lines = dto.Lines.Select(l => new JournalEntryLine
                {
                    AccountId = l.AccountId,
                    Debit = l.Debit,
                    Credit = l.Credit,
                    Description = l.Description
                }).ToList()
            };

            // Save to SQL Server
            _context.JournalEntries.Add(entry);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Journal Entry balanced and saved securely!" });
        }
        // GET: api/journalentry/business/1?startDate=...&endDate=...
        [HttpGet("business/{businessId}")]
        [Authorize]
        public async Task<IActionResult> GetEntries(int businessId, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            // 1. Start building the vault query
            var query = _context.JournalEntries
                .Include(je => je.Lines)
                .ThenInclude(line => line.Account)
                .Where(je => je.BusinessId == businessId)
                .AsQueryable();

            // 2. Apply Date Filters if the frontend sent them!
            if (startDate.HasValue)
            {
                query = query.Where(je => je.Date >= startDate.Value);
            }
            if (endDate.HasValue)
            {
                query = query.Where(je => je.Date <= endDate.Value);
            }

            // 3. Execute the search and sort newest first
            var entries = await query
                .OrderByDescending(je => je.Date)
                .ThenByDescending(je => je.Id)
                .ToListAsync();

            return Ok(entries);
        }
    }
}