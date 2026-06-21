using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers
{
    [Authorize] // 🛡️ The Bouncer: Only logged-in users can touch accounts!
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ApiDbContext _context;

        public AccountController(ApiDbContext context)
        {
            _context = context;
        }

        // --- 1. GET: Fetch all buckets for a specific business ---
        // The URL will look like: GET api/account/business/1
        [HttpGet]
        public async Task<IActionResult> GetAccounts()
        {
            var businessIdString = User.FindFirst("BusinessId")?.Value;

            if (string.IsNullOrEmpty(businessIdString))
                return Unauthorized("Badge missing.");

            int businessId = int.Parse(businessIdString);

            // 2. Fetch only what belongs to this badge
            var accounts = await _context.Accounts
                                         .Where(a => a.BusinessId == businessId)
                                         .ToListAsync();

            return Ok(accounts);
        }

        // --- 2. POST: Create a brand new bucket ---
        // The URL will be: POST api/account
        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] AccountDto dto)
        {
            // Create the official Database object from the DTO
            var newAccount = new Account
            {
                AccountNumber = dto.AccountNumber,
                Name = dto.Name,
                AccountType = dto.AccountType,
                BusinessId = dto.BusinessId
            };

            // Put it in the vault and save
            _context.Accounts.Add(newAccount);
            await _context.SaveChangesAsync();

            // Return a success message and the new ID!
            return Ok(new
            {
                message = $"Account '{newAccount.Name}' created successfully!",
                accountId = newAccount.Id
            });
        }
        [HttpPost("seed")]
        [Authorize]
        public async Task<IActionResult> SeedStandardAccounts()
        {
            // 1. Get the BusinessId from the token
            var businessIdString = User.FindFirst("BusinessId")?.Value;

            if (string.IsNullOrEmpty(businessIdString))
                return Unauthorized("BusinessId claim missing.");

            int businessId = int.Parse(businessIdString);

            // 2. Check if accounts already exist so we don't duplicate them
            if (await _context.Accounts.AnyAsync(a => a.BusinessId == businessId))
            {
                return BadRequest("Accounts have already been seeded for this business.");
            }

            // 3. Define the list
            var standardAccounts = new List<Account>
    {
        new Account { AccountNumber = 1000, Name = "Cash & Bank", AccountType = "Asset", BusinessId = businessId },
        new Account { AccountNumber = 2000, Name = "Accounts Payable", AccountType = "Liability", BusinessId = businessId },
        new Account { AccountNumber = 3000, Name = "Owner's Equity", AccountType = "Equity", BusinessId = businessId },
        new Account { AccountNumber = 4000, Name = "Sales Revenue", AccountType = "Revenue", BusinessId = businessId },
        new Account { AccountNumber = 5000, Name = "Rent Expense", AccountType = "Expense", BusinessId = businessId }
    };

            // 4. Save to DB
            _context.Accounts.AddRange(standardAccounts);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Chart of Accounts successfully seeded!" });
        }
    }
}