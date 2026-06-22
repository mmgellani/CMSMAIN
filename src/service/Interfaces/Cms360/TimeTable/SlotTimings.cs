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
    public interface ITimeTableSlotTimingsRepository:IEntityRepository<TimeTableSlotTimings>{  }
    public interface ITimeTableVWSlotTimingsRepository:IEntityRepository<TimeTableVWSlotTimings>{  }
     public interface ITimeTableSlotTimingsVMRepository:IEntityRepository<TimeTableSlotTimingsVM>{  }
    public class TimeTableSlotTimingsRepository : EntityRepository<TimeTableSlotTimings>, ITimeTableSlotTimingsRepository
    {
        public TimeTableSlotTimingsRepository(DbContextBase context) : base(context) { }
    }
    public class TimeTableVWSlotTimingsRepository : EntityRepository<TimeTableVWSlotTimings>, ITimeTableVWSlotTimingsRepository
    {
        public TimeTableVWSlotTimingsRepository(DbContextBase context) : base(context) { }
    }
      public class TimeTableSlotTimingsVMRepository : EntityRepository<TimeTableSlotTimingsVM>, ITimeTableSlotTimingsVMRepository
    {
        public TimeTableSlotTimingsVMRepository(DbContextBase context) : base(context) { }
    }
}