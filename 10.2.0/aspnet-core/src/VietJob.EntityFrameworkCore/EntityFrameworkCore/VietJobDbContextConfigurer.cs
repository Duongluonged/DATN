using Microsoft.EntityFrameworkCore;
using System.Data.Common;

namespace VietJob.EntityFrameworkCore;

public static class VietJobDbContextConfigurer
{
    public static void Configure(DbContextOptionsBuilder<VietJobDbContext> builder, string connectionString)
    {
        builder.UseSqlServer(connectionString);
    }

    public static void Configure(DbContextOptionsBuilder<VietJobDbContext> builder, DbConnection connection)
    {
        builder.UseSqlServer(connection);
    }
}
