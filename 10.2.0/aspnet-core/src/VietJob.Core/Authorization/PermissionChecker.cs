using Abp.Authorization;
using VietJob.Authorization.Roles;
using VietJob.Authorization.Users;

namespace VietJob.Authorization;

public class PermissionChecker : PermissionChecker<Role, User>
{
    public PermissionChecker(UserManager userManager)
        : base(userManager)
    {
    }
}
