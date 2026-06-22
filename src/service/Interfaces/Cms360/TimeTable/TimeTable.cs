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
    public interface ITimeTableTimeTableRepository:IEntityRepository<TimeTableTimeTable>{  }
         public class TimeTableTimeTableRepository : EntityRepository<TimeTableTimeTable>, ITimeTableTimeTableRepository
    {
        public TimeTableTimeTableRepository(DbContextBase context) : base(context) { }
    }
    public interface ITimeTableTimeTableRepositoryVM:IEntityRepository<TimeTableTimeTableVM>{  }
    public class TimeTableTimeTableRepositoryVM : EntityRepository<TimeTableTimeTableVM>, ITimeTableTimeTableRepositoryVM
    {
        public TimeTableTimeTableRepositoryVM(DbContextBase context) : base(context) { }
    }
    public interface ITimeTableTimeTableTeacherRepository:IEntityRepository<TimeTableTimeTableTeacher>{  }
    public class TimeTableTimeTableTeacherRepository : EntityRepository<TimeTableTimeTableTeacher>, ITimeTableTimeTableTeacherRepository
    {
        public TimeTableTimeTableTeacherRepository(DbContextBase context) : base(context) { }
    }
    public interface ITeacherTimeTableReportRepository:IEntityRepository<VWTeacherTimeTableReport>{  }
    public class TeacherTimeTableReportRepository : EntityRepository<VWTeacherTimeTableReport>, ITeacherTimeTableReportRepository
    {
        public TeacherTimeTableReportRepository(DbContextBase context) : base(context) { }
    }
}