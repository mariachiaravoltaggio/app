using GestionaleCN.Data;
using GestionaleCN.Models;
using GestionaleCN.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;

namespace GestionaleCN.Services;
public sealed class MarriageService(CnDbContext db) : IMarriageService
{
    public async Task<Marriage?> GetCurrentMarriageAsync(int personId, CancellationToken ct = default)
    {
        return await db.Marriages
            .AsNoTracking()
            .Where(m => !m.IsDissolved && (m.PersonAId == personId || m.PersonBId == personId))
            .SingleOrDefaultAsync(ct);
    }

    public async Task<Person?> GetCurrentSpouseAsync(int personId, CancellationToken ct = default)
    {
        var m = await db.Marriages
            .AsNoTracking()
            .Where(x => !x.IsDissolved && (x.PersonAId == personId || x.PersonBId == personId))
            .Select(x => new { x.PersonAId, x.PersonBId })
            .SingleOrDefaultAsync(ct);

        if (m is null) return null;

        var spouseId = m.PersonAId == personId ? m.PersonBId : m.PersonAId;
        return await db.People.AsNoTracking().SingleOrDefaultAsync(p => p.Id == spouseId, ct);
    }

    public async Task<Marriage> CreateMarriageAsync(int personAId, int personBId, CancellationToken ct = default)
    {
        if (personAId == personBId)
            throw new InvalidOperationException("Le due persone devono essere diverse.");

        // esistono le persone?
        var people = await db.People
            .Where(p => p.Id == personAId || p.Id == personBId)
            .Select(p => p.Id)
            .ToListAsync(ct);

        if (people.Count != 2)
            throw new InvalidOperationException("Una o entrambe le persone non esistono.");

        // vincolo: nessun matrimonio ATTIVO per ciascuno
        var hasActiveA = await db.Marriages.AnyAsync(m => !m.IsDissolved && (m.PersonAId == personAId || m.PersonBId == personAId), ct);
        var hasActiveB = await db.Marriages.AnyAsync(m => !m.IsDissolved && (m.PersonAId == personBId || m.PersonBId == personBId), ct);
        if (hasActiveA || hasActiveB)
            throw new InvalidOperationException("Una delle due persone ha già un matrimonio attivo.");

        // normalizza ordinamento A/B per evitare duplicati invertiti
        var (a, b) = personAId.CompareTo(personBId) <= 0 ? (personAId, personBId) : (personBId, personAId);

        // esiste già un record storico tra i due? (non necessario ma utile per evitare doppioni)
        var already = await db.Marriages.AnyAsync(m => m.PersonAId == a && m.PersonBId == b && !m.IsDissolved, ct);
        if (already)
            throw new InvalidOperationException("Esiste già un matrimonio attivo tra queste due persone.");

        var entity = new Marriage
        {
            Id = int.Newint(),
            PersonAId = a,
            PersonBId = b,
            IsDissolved = false
        };

        db.Marriages.Add(entity);
        await db.SaveChangesAsync(ct);
        return entity;
    }

    public async Task<Marriage> DissolveMarriageAsync(int marriageId, string? note = null, CancellationToken ct = default)
    {
        var m = await db.Marriages.SingleOrDefaultAsync(x => x.Id == marriageId, ct)
                ?? throw new KeyNotFoundException("Matrimonio non trovato.");

        if (m.IsDissolved)
            return m; // idempotente

        m.IsDissolved = true;

        await db.SaveChangesAsync(ct);
        return m;
    }
}

