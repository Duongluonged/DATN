using Abp.Application.Services;
using VietJob_DATN.Sessions.Dto;
using System.Threading.Tasks;

namespace VietJob_DATN.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
