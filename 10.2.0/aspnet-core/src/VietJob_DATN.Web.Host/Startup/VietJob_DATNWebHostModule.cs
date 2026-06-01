using Abp.Modules;
using Abp.Reflection.Extensions;
using VietJob_DATN.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace VietJob_DATN.Web.Host.Startup
{
    [DependsOn(
       typeof(VietJob_DATNWebCoreModule))]
    public class VietJob_DATNWebHostModule : AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public VietJob_DATNWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(VietJob_DATNWebHostModule).GetAssembly());
        }
    }
}
