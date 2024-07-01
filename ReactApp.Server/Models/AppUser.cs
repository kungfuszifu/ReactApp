using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ReactApp.Server.Models;

// Model użytkownika 
public class AppUser : IdentityUser
{
    [MaxLength(15)]
    public string? FirstName { get; set; }
    [MaxLength(25)]
    public string? LastName { get; set; }
    [MaxLength(15)]
    public string? Category { get; set; }
    public DateTime BirthDate { get; set; }
    
}