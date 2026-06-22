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
    public interface IExaminationExamDetailRepository : IEntityRepository<ExaminationExamDetail> { }

    public interface IExaminationExamDetailVMRepository : IEntityRepository<ExaminationExamDetailVM> { }

    public interface IExamDataVMRepository : IEntityRepository<ExamDataVM> { }

    public class ExaminationExamDetailRepository : EntityRepository<ExaminationExamDetail>, IExaminationExamDetailRepository
    {
        public ExaminationExamDetailRepository(DbContextBase context) : base(context) { }
    }
    public class ExaminationExamDetailVMRepository : EntityRepository<ExaminationExamDetailVM>, IExaminationExamDetailVMRepository
    {
        public ExaminationExamDetailVMRepository(DbContextBase context) : base(context) { }
    }
    public class ExamDataVMRepository : EntityRepository<ExamDataVM>, IExamDataVMRepository
    {
        public ExamDataVMRepository(DbContextBase context) : base(context) { }
    }
}