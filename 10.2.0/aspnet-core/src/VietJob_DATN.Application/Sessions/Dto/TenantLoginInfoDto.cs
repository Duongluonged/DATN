using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using VietJob_DATN.MultiTenancy;

namespace VietJob_DATN.Sessions.Dto;

[AutoMapFrom(typeof(Tenant))]
public class TenantLoginInfoDto : EntityDto
{
    public string TenancyName { get; set; }

    public string Name { get; set; }
}
