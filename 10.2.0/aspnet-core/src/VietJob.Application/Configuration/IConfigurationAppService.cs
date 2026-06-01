using VietJob.Configuration.Dto;
using System.Threading.Tasks;

namespace VietJob.Configuration;

public interface IConfigurationAppService
{
    Task ChangeUiTheme(ChangeUiThemeInput input);
}
