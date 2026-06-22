using System;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Cms360.Contract;

namespace Cms360.Server
{
    public interface IHttpServiceContextResolver : IDomainContextResolver
    {
        IUser Resolve(HttpContext context, bool cache = true);
    }
}