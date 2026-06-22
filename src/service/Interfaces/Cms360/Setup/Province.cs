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
    public interface ISetupProvinceRepository:IEntityRepository<SetupProvince>{  }
    public class SetupProvinceRepository : EntityRepository<SetupProvince>, ISetupProvinceRepository
    {
        public SetupProvinceRepository(DbContextBase context) : base(context) { }
    }

     public interface ISetupProvinceVMRepository:IEntityRepository<SetupProvinceVM>{  }
    public class SetupProvinceVMRepository : EntityRepository<SetupProvinceVM>, ISetupProvinceVMRepository
    {
        public SetupProvinceVMRepository(DbContextBase context) : base(context) { }
    }
}