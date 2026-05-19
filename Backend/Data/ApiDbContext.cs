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
        }

        public DbSet<TodoItem> TodoItems { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<UserBusinessRole> UserBusinessRoles { get; set; }
    }
}