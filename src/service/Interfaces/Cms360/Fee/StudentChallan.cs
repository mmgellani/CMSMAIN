/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using Cms360.Data;
using Cms360.Contract;
using Cms360.Data.Model;
using Cms360.Service.Implementation;

using Microsoft.AspNetCore.Http;

namespace Cms360.Service
{
    public interface IFeeStudentChallanRepository:IEntityRepository<FeeStudentChallan>{  }
     public interface IFeeStudentChallanVMRepository:IEntityRepository<FeeStudentChallanVM>{  }
    public class FeeStudentChallanRepository : EntityRepository<FeeStudentChallan>, IFeeStudentChallanRepository
    {
        public FeeStudentChallanRepository(DbContextBase context) : base(context) { }
    }


     public class FeeStudentChallanVMRepository : EntityRepository<FeeStudentChallanVM>, IFeeStudentChallanVMRepository
    {
        public FeeStudentChallanVMRepository(DbContextBase context) : base(context) { }
    }

    // Extended Version
    public interface IFeeStudentChallanRepositoryEx:IEntityRepositoryEx<FeeStudentChallan>{  }
    public class FeeStudentChallanRepositoryEx : EntityRepositoryEx<FeeStudentChallan>, IFeeStudentChallanRepositoryEx
    {
        public FeeStudentChallanRepositoryEx(DbContextBase context, IHttpContextAccessor https) : base(context, https) { }
    }
}