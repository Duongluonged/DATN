using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using VietJob.Authorization;
using VietJob.Entities;

namespace VietJob;

[DependsOn(
    typeof(VietJobCoreModule),
    typeof(AbpAutoMapperModule))]
public class VietJobApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<VietJobAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(VietJobApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(
            // Scan the assembly for classes which inherit from AutoMapper.Profile
            cfg => cfg.AddMaps(thisAssembly)
        );
    }
}
