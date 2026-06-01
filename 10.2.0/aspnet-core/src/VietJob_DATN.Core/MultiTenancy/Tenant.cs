using Abp.MultiTenancy;
using VietJob_DATN.Authorization.Users;

namespace VietJob_DATN.MultiTenancy;

public class Tenant : AbpTenant<User>
{
    public Tenant()
    {
    }

    public Tenant(string tenancyName, string name)
        : base(tenancyName, name)
    {
    }
}
