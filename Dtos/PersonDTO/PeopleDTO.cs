using GestionaleCN.Models.Enums;

namespace GestionaleCN.Dtos.PersonDTO;

public class PeopleDTO
{
    public int Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public Role Role { get; set; }
}
