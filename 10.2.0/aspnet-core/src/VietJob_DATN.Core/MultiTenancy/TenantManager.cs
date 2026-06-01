using Abp.Application.Features;
using Abp.Domain.Repositories;
using Abp.MultiTenancy;
using VietJob_DATN.Authorization.Users;
using VietJob_DATN.Editions;

namespace VietJob_DATN.MultiTenancy;

public class TenantManager : AbpTenantManager<Tenant, User>
{
    public TenantManager(
        IRepository<Tenant> tenantRepository,
        IRepository<TenantFeatureSetting, long> tenantFeatureRepository,
        EditionManager editionManager,
        IAbpZeroFeatureValueStore featureValueStore)
        : base(
            tenantRepository,
            tenantFeatureRepository,
            editionManager,
            featureValueStore)
    {
    }
}
