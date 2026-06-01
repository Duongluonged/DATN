using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using VietJob_DATN.Authorization;
using VietJob_DATN.Employers;




namespace VietJob_DATN;

[DependsOn(
    typeof(VietJob_DATNCoreModule),
    typeof(AbpAutoMapperModule))]
public class VietJob_DATNApplicationModule : AbpModule
{
    public override void PreInitialize()
    {
        Configuration.Authorization.Providers.Add<VietJob_DATNAuthorizationProvider>();
    }

    public override void Initialize()
    {
        var thisAssembly = typeof(VietJob_DATNApplicationModule).GetAssembly();

        IocManager.RegisterAssemblyByConvention(thisAssembly);

        Configuration.Modules.AbpAutoMapper().Configurators.Add(config =>
        {
            // Tự động scan các Profile mapper khác
            config.AddMaps(thisAssembly);

            
        });
        // Thêm dòng này vào cấu hình AutoMapper của bạn
        Configuration.Modules.AbpAutoMapper().Configurators.Add(config =>
        {
            config.CreateMap<EmployerDto, Employer>();
            config.CreateMap<Employer, EmployerDto>();
        });
    }
}