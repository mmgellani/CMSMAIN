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
    public interface ISetupRoomRepository:IEntityRepository<SetupRoom>{  }
     public interface ISetupRoomVMRepository:IEntityRepository<SetupRoomTypeBuildingVM>{  }
    public class SetupRoomRepository : EntityRepository<SetupRoom>, ISetupRoomRepository
    {
        public SetupRoomRepository(DbContextBase context) : base(context) { }
    }
      public class SetupRoomVMRepository : EntityRepository<SetupRoomTypeBuildingVM>, ISetupRoomVMRepository
    {
        public SetupRoomVMRepository(DbContextBase context) : base(context) { }
    }
}