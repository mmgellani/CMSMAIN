using System.Collections.Generic;
using Cms360.Contract.Model;

namespace Cms360.Contract
{
    public interface ILocalizationResolver
    {
        IEnumerable<IKeyValue> ResolveSupportedCultures();
        object ResolveCulture(string cultureName);
    }
}
