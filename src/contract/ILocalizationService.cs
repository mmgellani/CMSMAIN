using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Globalization;
using Cms360.Contract.Model;

namespace Cms360.Contract
{
    public interface ILocalizationService
    {
        Task<IEnumerable<IKeyValue>> GetSupportedCultures();
        Task<IEnumerable<IKeyValue>> GetSupportedTimeZones();
        bool IsSupportedCulture(string cultureName);
        bool IsSupportedTimeZone(string timeZoneId);
        Task<object> ResolveCulture(string cultureName);
        ILocalizationResolver Resolver { get; }
        ILocalizationDictionary CreateDictionary(IDomainContext context);
        ILocalizationDictionary CreateDictionary(string cultureName, string timeZoneId);
    }
}
