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
    public interface IAssessmentTypeRepository:IEntityRepository<AssessmentType>{  }
        public interface IAssessmentTypeRepositoryVM:IEntityRepository<AssessmentTypeVM>{  }
        public interface IAssessmentTypeRepositoryEx:IEntityRepository<AssessmentCategory>{  }


    public class AssessmentTypeRepository : EntityRepository<AssessmentType>, IAssessmentTypeRepository
    {
        public AssessmentTypeRepository(DbContextBase context) : base(context) { }
    }
    public class AssessmentTypeRepositoryVM : EntityRepository<AssessmentTypeVM>, IAssessmentTypeRepositoryVM
    {
        public AssessmentTypeRepositoryVM(DbContextBase context) : base(context) { }
    }
      public class AssessmentTypeRepositoryEx : EntityRepository<AssessmentCategory>, IAssessmentTypeRepositoryEx
    {
        public AssessmentTypeRepositoryEx(DbContextBase context) : base(context) { }
    }
}