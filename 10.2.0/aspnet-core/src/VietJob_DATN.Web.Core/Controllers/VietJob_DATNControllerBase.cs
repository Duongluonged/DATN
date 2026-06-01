using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace VietJob_DATN.Controllers
{
    public abstract class VietJob_DATNControllerBase : AbpController
    {
        protected VietJob_DATNControllerBase()
        {
            LocalizationSourceName = VietJob_DATNConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
