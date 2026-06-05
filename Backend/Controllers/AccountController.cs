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
        [HttpGet("business/{businessId}")]
        public async Task<IActionResult> GetAccounts(int businessId)
        {
            // Search the vault for any account linked to this BusinessId
            var accounts = await _context.Accounts
                .Where(a => a.BusinessId == businessId)
                .ToListAsync();

            return Ok(accounts); // Hand the list back to React
        }

        // --- 2. POST: Create a brand new bucket ---
        // The URL will be: POST api/account
        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] AccountDto dto)
        {
            // Create the official Database object from the DTO
            var newAccount = new Account
            {
                Name = dto.Name,
                AccountType = dto.AccountType,
                BusinessId = dto.BusinessId
            };

            // Put it in the vault and save
            _context.Accounts.Add(newAccount);
            await _context.SaveChangesAsync();

            // Return a success message and the new ID!
            return Ok(new { 
                message = $"Account '{newAccount.Name}' created successfully!", 
                accountId = newAccount.Id 
            });
        }
    }
}