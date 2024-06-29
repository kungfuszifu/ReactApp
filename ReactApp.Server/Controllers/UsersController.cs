using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp.Server.Contracts;
using ReactApp.Server.Models;

namespace ReactApp.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController
{
    public UsersController(
        UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }
    
    private readonly UserManager<AppUser> _userManager;

    [HttpGet("")]
    public async Task<IActionResult> GetUsers()
    {
        var userList = await _userManager.Users.ToListAsync();

        if (userList.Count == 0)
        {
            return BadRequestObjectResult();
        }

        return OkObjectResult(userList);
    }

    [HttpPost("")]
    [Authorize]
    public async Task<ActionResult> AddUser(UserRegisterRequest request)
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
            return Ok();
        }

        return BadRequest("Invalid user creation request");
    }

    [HttpPut("{email}")]
    [Authorize]
    public async Task<IActionResult> UpdateUser(string email, AppUser user)
    {
        if (email != user.Email)
        {
            return 
        }

        await _userManager.UpdateAsync(user);
        return Ok(user);
    }
}