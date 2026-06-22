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
    public interface IFeeCampusBankLinkRepository:IEntityRepository<FeeCampusBankLink>{  }
    public class FeeCampusBankLinkRepository : EntityRepository<FeeCampusBankLink>, IFeeCampusBankLinkRepository
    {
        public FeeCampusBankLinkRepository(DbContextBase context) : base(context) { }
    }
     public interface IFeeCampusBankLinkVMRepository:IEntityRepository<FeeCampusBankAccountVM>{  }
    public class FeeCampusBankLinkVMRepository : EntityRepository<FeeCampusBankAccountVM>, IFeeCampusBankLinkVMRepository
    {
        public FeeCampusBankLinkVMRepository(DbContextBase context) : base(context) { }
    }
}