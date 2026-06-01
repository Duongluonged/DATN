using Abp.Modules;
using Abp.Reflection.Extensions;
using VietJob.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace VietJob.Web.Host.Startup
{
    [DependsOn(
       typeof(VietJobWebCoreModule))]
    public class VietJobWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public VietJobWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(VietJobWebHostModule).GetAssembly());
        }
    }
}
