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
    public interface IAssessmentSchemeMasterRepository:IEntityRepository<AssessmentSchemeMaster>{  }
        public interface IAssessmentSchemeMasterRepositoryVM:IEntityRepository<AssessmentSchemeMasterVM>{  }
        public interface IAssessmentSchemeMasterRepositoryEx:IEntityRepository<AssessmentCategory>{  }


    public class AssessmentSchemeMasterRepository : EntityRepository<AssessmentSchemeMaster>, IAssessmentSchemeMasterRepository
    {
        public AssessmentSchemeMasterRepository(DbContextBase context) : base(context) { }
    }
    public class AssessmentSchemeMasterRepositoryVM : EntityRepository<AssessmentSchemeMasterVM>, IAssessmentSchemeMasterRepositoryVM
    {
        public AssessmentSchemeMasterRepositoryVM(DbContextBase context) : base(context) { }
    }
      public class AssessmentSchemeMasterRepositoryEx : EntityRepository<AssessmentCategory>, IAssessmentTypeRepositoryEx
    {
        public AssessmentSchemeMasterRepositoryEx(DbContextBase context) : base(context) { }
    }
}