using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// THE CRITICAL PART: Tell the app about our SQL Server
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddOpenApi();
// 1. Tell the manager to create a guest list called "AllowAll"
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()  // Allow any website to talk to us
              .AllowAnyMethod()  // Allow GET, POST, PUT, DELETE
              .AllowAnyHeader(); // Allow any data format
    });
});

var app = builder.Build();

// 2. Give the guest list to the bouncer
app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
