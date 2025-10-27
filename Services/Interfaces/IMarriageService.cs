using GestionaleCN.Models;

namespace GestionaleCN.Services.Interfaces;

public interface IMarriageService
{
    Task<Marriage?> GetCurrentMarriageAsync(int personId, CancellationToken ct = default);
    Task<Person?> GetCurrentSpouseAsync(int personId, CancellationToken ct = default);
    Task<Marriage> CreateMarriageAsync(int personAId, int personBId, CancellationToken ct = default);
    Task<Marriage> DissolveMarriageAsync(int marriageId, string? note = null, CancellationToken ct = default);
}
