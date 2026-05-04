using Abp.Authorization;
using Abp.Runtime.Session;
using VietJob_DATN.Configuration.Dto;
using System.Threading.Tasks;

namespace VietJob_DATN.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : VietJob_DATNAppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
