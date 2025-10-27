namespace GestionaleCN.Models;

public class Community
{
    public int Id { get; set; }
    public int ParishId { get; set; }
    public Parish Parish { get; set; } = default!;

    public int Number { get; set; }              // es. "prima comunità" => 1
    public string Name { get; set; } = default!; // es. "Martiri Canadesi"
    public DateTimeOffset CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CommunityMember> Members { get; set; } = new List<CommunityMember>();
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
