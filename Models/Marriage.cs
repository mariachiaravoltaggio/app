namespace GestionaleCN.Models;

public class Marriage
{
    public int Id { get; set; }

    // Coppia non orientata: PersonA e PersonB devono essere diversi
    public int PersonAId { get; set; }
    public Person PersonA { get; set; } = default!;

    public int PersonBId { get; set; }
    public Person PersonB { get; set; } = default!;

    /// <summary>
    /// false = ancora sposati (attivo); true = non più sposati.
    /// </summary>
    public bool IsDissolved { get; set; } = false;
}
