/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Text;
using System.Collections.Generic;

using Cms360.Data;
using Cms360.Contract;
using Cms360.Data.Model;
using Cms360.Service.Implementation;

namespace Cms360.Service
{
    public interface ISessionDurationRepository : IEntityRepository<SessionDuration> { }
    public class SessionDurationRepository : EntityRepository<SessionDuration>, ISessionDurationRepository
    {
        public SessionDurationRepository(DbContextBase context) : base(context) { }
    }

    public interface IVWSessionDurationRepository : IEntityRepository<VWSessionDuration> { }
    public class VWSessionDurationRepository : EntityRepository<VWSessionDuration>, IVWSessionDurationRepository
    {
        public VWSessionDurationRepository(DbContextBase context) : base(context) { }
    }



}