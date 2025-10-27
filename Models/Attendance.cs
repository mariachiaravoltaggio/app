using GestionaleCN.Models.Enums;

namespace GestionaleCN.Models;

public class Attendance
{
    public int EventId { get; set; }
    public Event Event { get; set; } = default!;

    public int PersonId { get; set; }
    public Person Person { get; set; } = default!;
    public AttendanceStatus Status { get; set; } = AttendanceStatus.Yes; // “partecipa: sì/no”
    public string? Notes { get; set; }
}
