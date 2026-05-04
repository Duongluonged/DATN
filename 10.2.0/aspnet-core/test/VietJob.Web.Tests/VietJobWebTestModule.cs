using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using VietJob.EntityFrameworkCore;
using VietJob.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace VietJob.Web.Tests;

[DependsOn(
    typeof(VietJobWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class VietJobWebTestModule : AbpModule
{
    public VietJobWebTestModule(VietJobEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(VietJobWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(VietJobWebMvcModule).Assembly);
    }
}