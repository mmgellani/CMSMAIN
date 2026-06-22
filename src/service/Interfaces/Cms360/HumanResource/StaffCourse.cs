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
    public interface IStaffCourseRepository:IEntityRepository<StaffCourse>{  }
    //  public interface IStaffCourseRepositoryVM:IEntityRepository<ProfileStaff>{  }
         public class StaffCourseRepository : EntityRepository<StaffCourse>, IStaffCourseRepository
    {
        public StaffCourseRepository(DbContextBase context) : base(context) { }
    }

    //  public class StaffCourseRepositoryVM : EntityRepository<ProfileStaff>, IStaffCourseRepositoryVM
    // {
    //     public StaffCourseRepositoryVM(DbContextBase context) : base(context) { }
    // }


    
}
