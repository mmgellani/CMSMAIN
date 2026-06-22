/*
*   Author: H.Muhammad Kamran
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
using Cms.Data.Model;

namespace Cms360.Service
{
    public interface ISmsRepository:IEntityRepository<SmsApproval>{  }
    public interface IVWCustomDataRepository:IEntityRepository<VWCustomData>{  }
    public interface ISmsAPIRepository:IEntityRepository<SmsAPI>{  }
    public interface ITemplatesRepository:IEntityRepository<Templates>{  }
    public class SmsRepository : EntityRepository<SmsApproval>, ISmsRepository
    {
        public SmsRepository(DbContextBase context) : base(context) { }
    }
    public class VWCustomDataRepository : EntityRepository<VWCustomData>, IVWCustomDataRepository
    {
        public VWCustomDataRepository(DbContextBase context) : base(context) { }
    }
    public class SmsAPIRepository : EntityRepository<SmsAPI>, ISmsAPIRepository
    {
        public SmsAPIRepository(DbContextBase context) : base(context) { }
    }
    public class TemplatesRepository : EntityRepository<Templates>, ITemplatesRepository
    {
        public TemplatesRepository(DbContextBase context) : base(context) { }
    }
}