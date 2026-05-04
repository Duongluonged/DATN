using Abp.Authorization;
using Abp.Runtime.Session;
using VietJob.Configuration.Dto;
using System.Threading.Tasks;

namespace VietJob.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : VietJobAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
