using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using VietJob_DATN.EntityFrameworkCore;
using VietJob_DATN.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace VietJob_DATN.Web.Tests;

[DependsOn(
    typeof(VietJob_DATNWebMvcModule),
    typeof(AbpAspNetCoreTestBaseModule)
)]
public class VietJob_DATNWebTestModule : AbpModule
{
    public VietJob_DATNWebTestModule(VietJob_DATNEntityFrameworkModule abpProjectNameEntityFrameworkModule)
    {
        abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
    }

    public override void PreInitialize()
    {
        Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
    }

    public override void Initialize()
    {
        IocManager.RegisterAssemblyByConvention(typeof(VietJob_DATNWebTestModule).GetAssembly());
    }

    public override void PostInitialize()
    {
        IocManager.Resolve<ApplicationPartManager>()
            .AddApplicationPartsIfNotAddedBefore(typeof(VietJob_DATNWebMvcModule).Assembly);
    }
}