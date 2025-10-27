using GestionaleCN.Models;

public partial class Parish
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Address { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public ICollection<Community> Communities { get; set; } = new List<Community>();
}