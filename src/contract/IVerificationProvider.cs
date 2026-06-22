using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cms360.Contract
{
    public interface IVerificationProvider
    {
        string Key { get; }
        bool CanHandle(IUser user, string code);
        Task<string> IssueCode(IUser user);
        Task<bool> RedeemCode(IUser user, string code);
    }
}