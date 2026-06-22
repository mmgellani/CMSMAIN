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
    public interface IFeeBankRepository:IEntityRepository<FeeBank>{  }
    public class FeeBankRepository : EntityRepository<FeeBank>, IFeeBankRepository
    {
        public FeeBankRepository(DbContextBase context) : base(context) { }
    }

    public interface IFeeBankRepositoryVM:IEntityRepository<FeeBankVM>{  }
    public class FeeBankRepositoryVM : EntityRepository<FeeBankVM>, IFeeBankRepositoryVM
    {
        public FeeBankRepositoryVM(DbContextBase context) : base(context) { }
    }
}