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
    public interface IAttendanceAttendanceDetailRepository:IEntityRepository<AttendanceAttendanceDetail>{  }

      public interface IAttendanceAttendanceDetailVMRepository:IEntityRepository<AttendanceAttendanceDetailVM>{  }
    public class AttendanceAttendanceDetailRepository : EntityRepository<AttendanceAttendanceDetail>, IAttendanceAttendanceDetailRepository
    {
        public AttendanceAttendanceDetailRepository(DbContextBase context) : base(context) { }
    }


     public class AttendanceAttendanceDetailVMRepository : EntityRepository<AttendanceAttendanceDetailVM>, IAttendanceAttendanceDetailVMRepository
    {
        public AttendanceAttendanceDetailVMRepository(DbContextBase context) : base(context) { }
    }
    
    //      public class AttendanceAttendanceReportRepository : EntityRepository<AttendanceAttendanceReport>, IAttendanceAttendanceReportRepository
    // {
    //     public AttendanceAttendanceReportRepository(DbContextBase context) : base(context) { }
    // }
}