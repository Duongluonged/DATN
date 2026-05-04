using Abp.Authorization;
using VietJob_DATN.Authorization.Roles;
using VietJob_DATN.Authorization.Users;

namespace VietJob_DATN.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
