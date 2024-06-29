using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using ReactApp.Server.Database;
using ReactApp.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = $"Server=localhost;Port=5432;Database=reactappDB;User Id=reactapp;Password=Pass123$;";

builder.Services.AddDbContext<AppDbContext>(
    options => options.UseNpgsql(connectionString));

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(options =>
    {   
        options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    });

builder.Services.AddIdentity<AppUser, AppRole>(options => 
    {
        options.User.RequireUniqueEmail = true; 
    })
    .AddEntityFrameworkStores<AppDbContext>();
    

//builder.Services.AddIdentityApiEndpoints<Contact>()
//    .AddEntityFrameworkStores<AppDbContext>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
//app.MapIdentityApi<Contact>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
