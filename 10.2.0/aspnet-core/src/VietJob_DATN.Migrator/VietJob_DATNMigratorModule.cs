using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using VietJob_DATN.Configuration;
using VietJob_DATN.EntityFrameworkCore;
using VietJob_DATN.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;

namespace VietJob_DATN.Migrator;

[DependsOn(typeof(VietJob_DATNEntityFrameworkModule))]
public class VietJob_DATNMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public VietJob_DATNMigratorModule(VietJob_DATNEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(VietJob_DATNMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            VietJob_DATNConsts.ConnectionStringName
        );

        Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        Configuration.ReplaceService(
            typeof(IEventBus),
            () => IocManager.IocContainer.Register(
                Component.For<IEventBus>().Instance(NullEventBus.Instance)
            )
        );
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(VietJob_DATNMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
