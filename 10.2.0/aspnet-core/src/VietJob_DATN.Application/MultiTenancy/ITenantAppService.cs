using Abp.Application.Services;
using VietJob_DATN.MultiTenancy.Dto;

namespace VietJob_DATN.MultiTenancy;

public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
{
}

