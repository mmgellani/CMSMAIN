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
    public interface IExaminationFailCriteriaRepository : IEntityRepository<ExaminationFailCriteria> { }

    public interface IExaminationFailMasterCriteriaRepository : IEntityRepository<ExaminationFailMasterCriteria> { }

    public interface IExaminationFailDetailCriteriaRepository : IEntityRepository<ExaminationFailDetailCriteria> { }

    public class ExaminationFailCriteriaRepository : EntityRepository<ExaminationFailCriteria>, IExaminationFailCriteriaRepository
    {
        public ExaminationFailCriteriaRepository(DbContextBase context) : base(context) { }
    }
    public class ExaminationFailMasterCriteriaRepository : EntityRepository<ExaminationFailMasterCriteria>, IExaminationFailMasterCriteriaRepository
    {
        public ExaminationFailMasterCriteriaRepository(DbContextBase context) : base(context) { }
    }
    public class ExaminationFailDetailCriteriaRepository : EntityRepository<ExaminationFailDetailCriteria>, IExaminationFailDetailCriteriaRepository
    {
        public ExaminationFailDetailCriteriaRepository(DbContextBase context) : base(context) { }
    }
    
     
}