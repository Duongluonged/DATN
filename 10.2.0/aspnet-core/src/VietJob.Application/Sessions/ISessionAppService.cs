using Abp.Application.Services;
using VietJob.Sessions.Dto;
using System.Threading.Tasks;

namespace VietJob.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
