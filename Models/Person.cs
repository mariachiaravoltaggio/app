using GestionaleCN.Models.Enums;

namespace GestionaleCN.Models;

public class Person
{
    public int Id { get; set; }
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public string Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? AddressLine { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; } 
    public string? Country { get; set; }  
    public string? PostalCode { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Notes { get; set; }
    public Role Role { get; set; } = Role.None;  // DEFAULT

    // Navigazioni
    public ICollection<CommunityMember> Memberships { get; set; } = new List<CommunityMember>();

    // Matrimoni (self-reference via tabella ponte)
    public ICollection<Marriage> MarriagesAsA { get; set; } = new List<Marriage>();
    public ICollection<Marriage> MarriagesAsB { get; set; } = new List<Marriage>();
}
