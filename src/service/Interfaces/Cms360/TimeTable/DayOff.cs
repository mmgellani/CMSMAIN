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
    public interface IDayOffRepository : IEntityRepository<DayOff> { }
    public class DayOffRepository : EntityRepository<DayOff>, IDayOffRepository
    {
        public DayOffRepository(DbContextBase context) : base(context) { }
    }
    public interface IDayOffVMRepository : IEntityRepository<DayOffVM> { }
    public class DayOffVMRepository : EntityRepository<DayOffVM>, IDayOffVMRepository
    {
        public DayOffVMRepository(DbContextBase context) : base(context) { }
    }
    //  public interface ITimeTableSlotsRepositoryVM:IEntityRepository<TimeTableSlotsVM>{  }
    // public class TimeTableSlotsRepositoryVM : EntityRepository<TimeTableSlotsVM>, ITimeTableSlotsRepositoryVM
    // {
    //     public TimeTableSlotsRepositoryVM(DbContextBase context) : base(context) { }
    // }
}