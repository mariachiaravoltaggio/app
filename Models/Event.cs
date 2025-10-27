namespace GestionaleCN.Models;

public class Event
{
    public int Id { get; set; }
    public int CommunityId { get; set; }
    public Community Community { get; set; } = default!;

    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset EndDate { get; set; }
    public string? Title { get; set; }           // es. “Convivenza d’Avvento”
    public string? Notes { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}
