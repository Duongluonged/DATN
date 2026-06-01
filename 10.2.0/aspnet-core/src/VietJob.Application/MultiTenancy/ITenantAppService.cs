using Abp.Application.Services;
using VietJob.MultiTenancy.Dto;

namespace VietJob.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

