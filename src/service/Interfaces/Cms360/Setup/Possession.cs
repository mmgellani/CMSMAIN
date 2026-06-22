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
    public interface ISetupPossessionRepository:IEntityRepository<SetupPossession>{  }
    public class SetupPossessionRepository : EntityRepository<SetupPossession>, ISetupPossessionRepository
    {
        public SetupPossessionRepository(DbContextBase context) : base(context) { }
    }
     public interface ISetupPossessionVMRepository:IEntityRepository<SetupPossessionVM>{  }
    public class SetupPossessionVMRepository : EntityRepository<SetupPossessionVM>, ISetupPossessionVMRepository
    {
        public SetupPossessionVMRepository(DbContextBase context) : base(context) { }
    }
}
