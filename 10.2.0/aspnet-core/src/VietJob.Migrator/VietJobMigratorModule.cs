using Abp.Events.Bus;
using Abp.Modules;
using Abp.Reflection.Extensions;
using VietJob.Configuration;
using VietJob.EntityFrameworkCore;
using VietJob.Migrator.DependencyInjection;
using Castle.MicroKernel.Registration;
using Microsoft.Extensions.Configuration;
using VietJob.Entities;

namespace VietJob.Migrator;

[DependsOn(typeof(VietJobEntityFrameworkModule))]
public class VietJobMigratorModule : AbpModule
{
    private readonly IConfigurationRoot _appConfiguration;

    public VietJobMigratorModule(VietJobEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbSeed = true;

        _appConfiguration = AppConfigurations.Get(
            typeof(VietJobMigratorModule).GetAssembly().GetDirectoryPathOrNull()
        );
    }

    public override void PreInitialize()
    {
        Configuration.DefaultNameOrConnectionString = _appConfiguration.GetConnectionString(
            VietJobConsts.ConnectionStringName
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
        IocManager.RegisterAssemblyByConvention(typeof(VietJobMigratorModule).GetAssembly());
        ServiceCollectionRegistrar.Register(IocManager);
    }
}
