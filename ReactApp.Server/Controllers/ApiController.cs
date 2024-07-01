using System.Data;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;
using ReactApp.Server.Contracts;
using ReactApp.Server.Database;
using ReactApp.Server.Models;

namespace ReactApp.Server.Controllers;

// Kontroler obsługujący api backendu
[ApiController]
[Route("[controller]")]
public class ApiController : ControllerBase
{
    public ApiController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        AppDbContext dbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dbContext = dbContext;
    }
    
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly AppDbContext _dbContext;

    // Metoda rejstracji - tworzy obiekt użytkownika i próbuje dodać go do bazy danych
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterRequest request)
    {
        var user = new AppUser()
        {
            UserName = request.UserName,
            Email = request.Email,
            BirthDate = request.BirthDate,
            LastName = request.LastName,
            FirstName = request.FirstName,
            Category = request.Category
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return BadRequest("Something went wrong");
        }

        return Ok("Registered succesfuly");
    }
    
    // Metoda logowania - wyszukuje użytkownika po emailu i próbuje go zalogowac 
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            return BadRequest("Invalid email");
        }

        var result = await _signInManager.PasswordSignInAsync(user, request.Password, false, false);

        if (!result.Succeeded)
        {
            return BadRequest("Invalid password");
        }

        return Ok("Succesfuly logged in");
    }
    
    // Metoda wylogowania
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        try
        {
            await _signInManager.SignOutAsync();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }

        return NoContent();
    }

    // Metoda sprawdzenia tożsamosci - cookie nie przechowuje jawnie informacji o tym na jakie konto
    // zalogowany jest użytkownik, wiec ta metoda odsyła email jeżeli użytkownik jest zalogowany
    [HttpGet("pingauth")]
    [Authorize]
    public async Task<IActionResult> CheckCredentials()
    {
        var principal = HttpContext.User;
        var result = _signInManager.IsSignedIn(principal);

        AppUser appUser = new();
        if (result)
        {
            appUser = await _userManager.GetUserAsync(principal);
        }
        else
        {
            return Forbid("Acces Denied");
        }

        return Ok(new { userEmail = appUser.Email });
    }

    // Metoda zwracająca liste użytkowników w bazie - zwracane są tylko podstawowe informacje
    [HttpGet("userlist")]
    public async Task<IActionResult> GetUserList()
    {
        var userList = await _userManager.Users.ToListAsync();

        var briefUserList = new List<UserBrief>();
        foreach (AppUser user in userList)
        {
            var buser = new UserBrief()
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
            briefUserList.Add(buser);
        }

        return Ok(briefUserList);
    }
    
    // Metoda zwracająca szczegółowe dane użytkownika 
    [HttpGet("userDetails/{email}")]
    [Authorize]
    public async Task<IActionResult> GetUserDetails(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            return BadRequest();
        }

        var userDetailed = new UserDetailed()
        {
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Category = user.Category,
            BirthDate = user.BirthDate
        };
        
        return Ok(userDetailed);
    }

    // Metoda aktualizuje dane użytkownika lub tworzy nowego użytkownika gdy taki
    // o podanym emailujeszcze nie istnieje
    [HttpPut("userUpdate")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(UserRegisterRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            var newuser = new AppUser()
            {
                UserName = request.UserName,
                Email = request.Email,
                BirthDate = request.BirthDate,
                LastName = request.LastName,
                FirstName = request.FirstName,
                Category = request.Category
            };
            
            var createresult = await _userManager.CreateAsync(newuser, request.Password);

            if (!createresult.Succeeded)
            {
                return BadRequest();
            }

            return Ok("Inserted user");
        }

        user.UserName = request.UserName;
        user.BirthDate = request.BirthDate;
        user.Category = request.Category;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        var passwordHash = _userManager.PasswordHasher.HashPassword(user, request.Password);
        
        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return NotFound();
        }
        
        return Ok("Updated user");
    }
    
    // Metoda usuwająca użytkownika na podstawie emaila
    [HttpDelete("userDelete/{email}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            return BadRequest();
        }

        var result = await _userManager.DeleteAsync(user);
        
        if (!result.Succeeded)
        {
            return BadRequest();
        }
        
        return Ok("User deleted");
    }

    // Metoda zwracająca dane słownikowe
    [HttpGet("dict")]
    public async Task<IActionResult> GetDictionary()
    {
        var query = "SELECT * FROM dictcategory";
        var entity = _dbContext.Database.SqlQueryRaw<DictData>(query, "");
        var list = await entity.ToListAsync();
        
        return Ok(list);
    }
}