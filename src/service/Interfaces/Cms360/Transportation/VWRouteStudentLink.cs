using System;
using System.Text;
using System.Collections.Generic;

using Cms360.Data;
using Cms360.Contract;
using Cms360.Data.Model;
using Cms360.Service.Implementation;

namespace Cms360.Service
{
    public interface IroutestudentlinkVMRepository:IEntityRepository<routestudentlinkVM>{  }
    public class routestudentlinkVMRepository : EntityRepository<routestudentlinkVM>, IroutestudentlinkVMRepository
    {
        public routestudentlinkVMRepository(DbContextBase context) : base(context) { }
    }
}