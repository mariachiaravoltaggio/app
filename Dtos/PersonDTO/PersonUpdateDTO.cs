using GestionaleCN.Models.Enums;

namespace GestionaleCN.Dtos.PersonDTO;

public class PersonUpdateDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? PhoneNumber { get; set; }
    public string? AddressLine { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? Country { get; set; }
    public string? PostalCode { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Notes { get; set; }
    public Role Role { get; set; }
}

