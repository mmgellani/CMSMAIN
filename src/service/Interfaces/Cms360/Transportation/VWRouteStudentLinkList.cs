using System;
using System.Text;
using System.Collections.Generic;

using Cms360.Data;
using Cms360.Contract;
using Cms360.Data.Model;
using Cms360.Service.Implementation;

namespace Cms360.Service
{
    public interface IroutestudentlinklistVMRepository:IEntityRepository<routestudentlinklistVM>{  }
    public class routestudentlinklistVMRepository : EntityRepository<routestudentlinklistVM>, IroutestudentlinklistVMRepository
    {
        public routestudentlinklistVMRepository(DbContextBase context) : base(context) { }
    }
}