
using System;
using System.Globalization;
using System.Linq;
using Cms360.Contract;

namespace Cms360.Server.Model
{
    public class HttpServiceContext : IDomainContext
    {
        internal HttpServiceContext(IUser user, CultureInfo culture, TimeZoneInfo sourceTimeZone)
        {
            this.User = user;
            this.Culture = culture;
            this.SourceTimeZone = sourceTimeZone;
        }

        public CultureInfo Culture { get; set; }
        public TimeZoneInfo SourceTimeZone { get; set; }
        public IUser User { get; set; }
    }
}