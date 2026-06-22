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
    public interface IFeeConcessionDetailRepository:IEntityRepository<FeeConcessionDetail>{  }
    public class FeeConcessionDetailRepository : EntityRepository<FeeConcessionDetail>, IFeeConcessionDetailRepository
    
   
    {
        public FeeConcessionDetailRepository(DbContextBase context) : base(context) { }
    }
    public interface IFeeConcessionDetailRepositoryVM:IEntityRepository<FeeConcessionDetailVM>{  }
    public class FeeConcessionDetailRepositoryVM : EntityRepository<FeeConcessionDetailVM>, IFeeConcessionDetailRepositoryVM
    {
        public FeeConcessionDetailRepositoryVM(DbContextBase context) : base(context) { }
    }
     public interface IGetStudentsVMRepository:IEntityRepository<GetStudentsVM>{  }

      public class GetStudentsVMRepository : EntityRepository<GetStudentsVM>, IGetStudentsVMRepository
    {
        public GetStudentsVMRepository(DbContextBase context) : base(context) { }
    }
}