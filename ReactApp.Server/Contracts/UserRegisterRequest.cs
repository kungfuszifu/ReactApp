namespace ReactApp.Server.Contracts;

public class UserRegisterRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string UserName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Category { get; set; }
     public DateTime BirthDate { get; set; }
}