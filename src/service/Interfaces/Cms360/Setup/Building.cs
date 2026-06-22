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
    public interface ISetupBuildingRepository:IEntityRepository<SetupBuilding>{  }
     public interface ISetupBuildingAddressPossessionVMRepository:IEntityRepository<SetupBuildingAddressPossessionVM>{  }
    public class SetupBuildingRepository : EntityRepository<SetupBuilding>, ISetupBuildingRepository
    {
        public SetupBuildingRepository(DbContextBase context) : base(context) { }
    }
     public class SetupBuildingAddressPossessionVMRepository : EntityRepository<SetupBuildingAddressPossessionVM>, ISetupBuildingAddressPossessionVMRepository
    {
        public SetupBuildingAddressPossessionVMRepository(DbContextBase context) : base(context) { }
    }
}