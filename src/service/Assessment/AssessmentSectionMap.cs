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
    public interface IAssessmentSectionMapRepository:IEntityRepository<AssessmentSectionMap>{  }
    public class AssessmentSectionMapRepository : EntityRepository<AssessmentSectionMap>, IAssessmentSectionMapRepository
    {
        public AssessmentSectionMapRepository(DbContextBase context) : base(context) { }
    }


    public interface IVWAssessmentSectionMapRepository:IEntityRepository<VWAssessmentSectionMap>{  }
    public class VWAssessmentSectionMapRepository : EntityRepository<VWAssessmentSectionMap>, IVWAssessmentSectionMapRepository
    {
        public VWAssessmentSectionMapRepository(DbContextBase context) : base(context) { }
    }
}