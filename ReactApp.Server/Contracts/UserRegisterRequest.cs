namespace ReactApp.Server.Contracts;

public class UserRegisterRequest
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    
    public string UserName { get; set; }
    // public string Category { get; set; } = String.Empty;
    // public string Email { get; set; } = String.Empty;
    // public string PhoneNumber { get; set; } = String.Empty;
    public string Email { get; set; }
    public string Password { get; set; }
    //public DateTime BirthDate { get; set; }
}