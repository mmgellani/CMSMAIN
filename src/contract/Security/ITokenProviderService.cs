using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cms360.Contract.Security
{
    public interface ITokenProviderService<T>
    {
        Task<T> IssueToken(ClaimsIdentity identity, string subject);
    }
}