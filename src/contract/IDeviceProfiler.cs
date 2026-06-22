using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cms360.Contract
{
    public interface IDeviceProfiler
    {
        string DeriveFingerprint(IUser user);
        string DeriveFingerprintWebSite(string user);
        string DeriveFingerprintMobile(string user);
    }
}