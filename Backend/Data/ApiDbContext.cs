using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define the Composite Key for the join table
            modelBuilder.Entity<UserBusinessRole>()
                .HasKey(ubr => new { ubr.UserId, ubr.BusinessId });

            // Link User -> UserBusinessRoles
            modelBuilder.Entity<UserBusinessRole>()
                .HasOne(ubr => ubr.User)
                .WithMany(u => u.UserBusinessRoles)
                .HasForeignKey(ubr => ubr.UserId);

            // Link Business -> UserBusinessRoles
            modelBuilder.Entity<UserBusinessRole>()
                .HasOne(ubr => ubr.Business)
                .WithMany(b => b.UserBusinessRoles)
                .HasForeignKey(ubr => ubr.BusinessId);

             modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

            modelBuilder.Entity<JournalEntryLine>()
                .HasOne(jel => jel.Account)
                .WithMany() 
                .HasForeignKey(jel => jel.AccountId)
                .OnDelete(DeleteBehavior.Restrict); 

            base.OnModelCreating(modelBuilder);

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<UserBusinessRole> UserBusinessRoles { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<JournalEntryLine> JournalEntryLines { get; set; }
    }
}