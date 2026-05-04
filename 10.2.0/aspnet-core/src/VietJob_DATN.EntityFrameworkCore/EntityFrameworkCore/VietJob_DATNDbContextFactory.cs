using VietJob_DATN.Configuration;
using VietJob_DATN.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace VietJob_DATN.EntityFrameworkCore;

/* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
public class VietJob_DATNDbContextFactory : IDesignTimeDbContextFactory<VietJob_DATNDbContext>
{
    public VietJob_DATNDbContext CreateDbContext(string[] args)
    {
        var builder = new DbContextOptionsBuilder<VietJob_DATNDbContext>();

        /*
         You can provide an environmentName parameter to the AppConfigurations.Get method. 
         In this case, AppConfigurations will try to read appsettings.{environmentName}.json.
         Use Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") method or from string[] args to get environment if necessary.
         https://docs.microsoft.com/en-us/ef/core/cli/dbcontext-creation?tabs=dotnet-core-cli#args
         */
        var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

        VietJob_DATNDbContextConfigurer.Configure(builder, configuration.GetConnectionString(VietJob_DATNConsts.ConnectionStringName));

        return new VietJob_DATNDbContext(builder.Options);
    }
}
