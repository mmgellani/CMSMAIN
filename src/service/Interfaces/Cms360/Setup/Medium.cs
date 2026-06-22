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
    public interface ISetupMediumRepository:IEntityRepository<SetupMedium>{  }
     public interface ISetupMonthRepository:IEntityRepository<SetupMonth>{  }
    public class SetupMediumRepository : EntityRepository<SetupMedium>, ISetupMediumRepository
    {
        public SetupMediumRepository(DbContextBase context) : base(context) { }
    }
    public class SetupMonthRepository : EntityRepository<SetupMonth>, ISetupMonthRepository
    {
        public SetupMonthRepository(DbContextBase context) : base(context) { }
    }
}