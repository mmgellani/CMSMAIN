using System.Security.Claims;
using System.Threading.Tasks;

namespace Cms360.Contract.Security
{
    public interface ILocalAuthenticationService
    {
        Task<ClaimsIdentity> ResolveUser(string username, string password);
        Task<ClaimsIdentity> ResolveUserMobile(string username, string password, string useremail, string deviceid, string deviceip, string loginwith);
        Task<ClaimsIdentity> ResolveUserWebsite(string username, string password, string useremail, string deviceid, string deviceip, string loginwith);

        Task<IUser> ResolveUser(string username);
        Task<ClaimsIdentity> ResolveUserEx(string username);


        Task<bool> ValidateUser(string username);
    }
}
