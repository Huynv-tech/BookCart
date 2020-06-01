using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace BookCart.Models
{
    public static class Policies
    {
        public static AuthorizationPolicy AdminPolicy()
        {
            return new AuthorizationPolicyBuilder().RequireAuthenticatedUser()
                                                   .RequireRole(UserRoles.Admin)
                                                   .Build();
        }
        public static AuthorizationPolicy ContributorPolicy()
        {
            return new AuthorizationPolicyBuilder().RequireAuthenticatedUser()
                                                   .RequireRole(UserRoles.Contributor)
                                                   .Build();
        }

        public static AuthorizationPolicy ManagerPolicy()
        {
            return new AuthorizationPolicyBuilder().RequireAuthenticatedUser()
                                                   .RequireRole(new List<string> { UserRoles.Admin, UserRoles.Contributor }.ToArray())
                                                   .Build();
        }
        public static AuthorizationPolicy UserPolicy()
        {
            return new AuthorizationPolicyBuilder().RequireAuthenticatedUser()
                                                   .RequireRole(UserRoles.User)
                                                   .Build();
        }
    }
}
