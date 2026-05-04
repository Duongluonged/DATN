using Abp.Application.Services;
using VietJob_DATN.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace VietJob_DATN.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
