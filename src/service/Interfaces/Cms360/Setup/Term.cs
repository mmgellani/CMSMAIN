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
    public interface ISetupTermRepository:IEntityRepository<SetupTerm>{  }
    public class SetupTermRepository : EntityRepository<SetupTerm>, ISetupTermRepository
    {
        public SetupTermRepository(DbContextBase context) : base(context) { }
    }
     public interface ISetupTermSessionVMRepository:IEntityRepository<SetupTermSessionVM>{  }
    public class SetupTermSessionVMRepository : EntityRepository<SetupTermSessionVM>, ISetupTermSessionVMRepository
    {
        public SetupTermSessionVMRepository(DbContextBase context) : base(context) { }
    }
}