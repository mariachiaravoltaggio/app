using Microsoft.EntityFrameworkCore;

namespace GestionaleCN.Data;

public partial class NcDbContext : DbContext
{
    public NcDbContext()
    {
    }

    public NcDbContext(DbContextOptions<NcDbContext> options)
        : base(options)
    {
    }
}
