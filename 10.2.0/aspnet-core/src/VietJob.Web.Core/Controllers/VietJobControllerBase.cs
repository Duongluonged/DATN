using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;
using VietJob.Entities;

namespace VietJob.Controllers
{
    public abstract class VietJobControllerBase : AbpController
    {
        protected VietJobControllerBase()
        {
            LocalizationSourceName = VietJobConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
