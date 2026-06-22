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
    public interface IRegistrationProgramCourseLinkRepository : IEntityRepository<RegistrationProgramCourseLink> { }

    public interface IRegistrationProgramCourseLinkVMRepository : IEntityRepository<RegistrationProgramCourseLinkVM> { }
    public class RegistrationProgramCourseLinkRepository : EntityRepository<RegistrationProgramCourseLink>, IRegistrationProgramCourseLinkRepository
    {
        public RegistrationProgramCourseLinkRepository(DbContextBase context) : base(context) { }
    }

    public class RegistrationProgramCourseLinkVMRepository : EntityRepository<RegistrationProgramCourseLinkVM>, IRegistrationProgramCourseLinkVMRepository
    {
        public RegistrationProgramCourseLinkVMRepository(DbContextBase context) : base(context) { }
    }
}