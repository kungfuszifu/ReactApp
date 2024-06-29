using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactApp.Server.Contracts;
using ReactApp.Server.Database;
using ReactApp.Server.Models;

namespace ReactApp.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    public UsersController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        AppDbContext appDbContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _appDbContext = appDbContext;
    }
    
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly AppDbContext _appDbContext;

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterRequest request)
    {
        var user = new AppUser()
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserName = request.UserName,
            Email = request.Email,
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (result.Succeeded)
        {
            return Ok(request);
        }

        return BadRequest("Invalid register request");
    }
    
    [HttpPost("login")]

    public async Task<IActionResult> Login(UserLoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            return BadRequest("Invalid email");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (result.Succeeded)
        {
            return Ok("Succesfuly logged in");
        }

        return BadRequest("Invalid password");
    }
}