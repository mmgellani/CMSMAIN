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
    public interface IExaminationGradingCriteriaVMRepository:IEntityRepository<ExaminationGradingCriteriaVM>{  }
    public class ExaminationGradingCriteriaVMRepository : EntityRepository<ExaminationGradingCriteriaVM>, IExaminationGradingCriteriaVMRepository
    {
        public ExaminationGradingCriteriaVMRepository(DbContextBase context) : base(context) { }
    }



    public interface IExaminationGradingDetailRepository:IEntityRepository<ExaminationGradingDetail>{  }
    public class ExaminationGradingDetailRepository : EntityRepository<ExaminationGradingDetail>, IExaminationGradingDetailRepository
    {
        public ExaminationGradingDetailRepository(DbContextBase context) : base(context) { }
    }



    public interface IExaminationGradingMasterRepository:IEntityRepository<ExaminationGradingMaster>{  }
    public class ExaminationGradingMasterRepository : EntityRepository<ExaminationGradingMaster>, IExaminationGradingMasterRepository
    {
        public ExaminationGradingMasterRepository(DbContextBase context) : base(context) { }
    }


}