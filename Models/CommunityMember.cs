using GestionaleCN.Models.Enums;
using System.Data;

namespace GestionaleCN.Models;

public class CommunityMember
{
    public int CommunityId { get; set; }
    public Community Community { get; set; } = default!;

    public int PersonId { get; set; }
    public Person Person { get; set; } = default!;
    public DateTimeOffset JoinedAtUtc { get; set; } = DateTimeOffset.UtcNow;
    
}
