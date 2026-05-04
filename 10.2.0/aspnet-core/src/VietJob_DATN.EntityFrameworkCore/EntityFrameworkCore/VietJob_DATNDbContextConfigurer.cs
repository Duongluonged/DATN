using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace VietJob_DATN.EntityFrameworkCore;

public static class VietJob_DATNDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<VietJob_DATNDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<VietJob_DATNDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
