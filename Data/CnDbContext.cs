using GestionaleCN.Models;
using Microsoft.EntityFrameworkCore;

namespace GestionaleCN.Data;

public partial class CnDbContext(DbContextOptions<CnDbContext> options) : DbContext(options)
{
    public DbSet<Parish> Parishes => Set<Parish>();
    public DbSet<Community> Communities => Set<Community>();
    public DbSet<Person> People => Set<Person>();
    public DbSet<CommunityMember> CommunityMembers => Set<CommunityMember>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Attendance> Attendances => Set<Attendance>();
    public DbSet<Marriage> Marriages => Set<Marriage>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Parish>().HasIndex(x => x.Name);

        b.Entity<Community>()
            .HasIndex(x => new { x.ParishId, x.Number })
            .IsUnique();
                        
        b.Entity<Person>()
            .HasIndex(x => new { x.LastName, x.FirstName, x.BirthDate });
        b.Entity<Person>()
        .Property(x => x.Email).HasMaxLength(50);
        b.Entity<Person>()
            .Property(x => x.PhoneNumber).HasMaxLength(32);
        b.Entity<Person>()
            .Property(x => x.AddressLine).HasMaxLength(256);
        b.Entity<Person>()
            .Property(x => x.City).HasMaxLength(128);
        b.Entity<Person>()
            .Property(x => x.Region).HasMaxLength(128);
        b.Entity<Person>()
            .Property(x => x.Country).HasMaxLength(128);
        b.Entity<Person>()
            .Property(x => x.PostalCode).HasMaxLength(16);

        b.Entity<CommunityMember>()
            .HasKey(x => new { x.CommunityId, x.PersonId });

        b.Entity<CommunityMember>()
            .HasOne(x => x.Community).WithMany(c => c.Members).HasForeignKey(x => x.CommunityId);
        b.Entity<CommunityMember>()
            .HasOne(x => x.Person).WithMany(p => p.Memberships).HasForeignKey(x => x.PersonId);

        b.Entity<Attendance>()
            .HasKey(x => new { x.EventId, x.PersonId });

        b.Entity<Attendance>()
            .HasOne(x => x.Event).WithMany(c => c.Attendances).HasForeignKey(x => x.EventId);
        b.Entity<Attendance>()
            .HasOne(x => x.Person).WithMany().HasForeignKey(x => x.PersonId);

        var marriage = b.Entity<Marriage>();

        marriage.HasOne(x => x.PersonA)
                .WithMany(p => p.MarriagesAsA)
                .HasForeignKey(x => x.PersonAId)
                .OnDelete(DeleteBehavior.Restrict);

        marriage.HasOne(x => x.PersonB)
                .WithMany(p => p.MarriagesAsB)
                .HasForeignKey(x => x.PersonBId)
                .OnDelete(DeleteBehavior.Restrict);

        // persone diverse
        marriage.ToTable(t => t.HasCheckConstraint("CK_Marriage_Persons_Distinct", "[PersonAId] <> [PersonBId]");
        // evita duplicati A/B invertiti (opzionale ma utile)
        marriage.HasIndex(x => new { x.PersonAId, x.PersonBId }).IsUnique();

        // *** vincolo chiave: una sola unione ATTIVA per persona ***
        // attivo == IsDissolved = 0
        marriage.HasIndex(x => x.PersonAId)
                .HasFilter("[IsDissolved] = 0")
                .IsUnique();

        marriage.HasIndex(x => x.PersonBId)
                .HasFilter("[IsDissolved] = 0")
                .IsUnique();
    }
}

