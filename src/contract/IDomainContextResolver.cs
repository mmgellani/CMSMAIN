using System;
using System.Globalization;

namespace Cms360.Contract
{
    public interface IDomainContextResolver
    {
        IDomainContext Resolve(bool cache = true);
    }
}