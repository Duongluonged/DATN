using VietJob_DATN.Configuration.Dto;
using System.Threading.Tasks;

namespace VietJob_DATN.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
