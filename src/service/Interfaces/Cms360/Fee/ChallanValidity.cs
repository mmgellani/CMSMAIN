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
    public interface IFeeChallanValidityRepository:IEntityRepository<FeeChallanValidity>{  }
    public interface IFeeChallanValidityVMRepository:IEntityRepository<CampusChallanValidityVM>{  }
      public class FeeChallanValidityRepository : EntityRepository<FeeChallanValidity>, IFeeChallanValidityRepository
    {
        public FeeChallanValidityRepository(DbContextBase context) : base(context) { }
    }
    public class FeeChallanValidityVMRepository : EntityRepository<CampusChallanValidityVM>, IFeeChallanValidityVMRepository
    {
        public FeeChallanValidityVMRepository(DbContextBase context) : base(context) { }
    }
}