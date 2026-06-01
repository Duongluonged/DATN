using Abp.Application.Services;
using VietJob.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace VietJob.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(Register input);
    Task<string> LoginCustom(LoginDto input);
}
