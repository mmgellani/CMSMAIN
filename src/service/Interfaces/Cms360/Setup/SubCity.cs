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
    public interface ISetupSubCityRepository:IEntityRepository<SetupSubCity>{  }
    public class SetupSubCityRepository : EntityRepository<SetupSubCity>, ISetupSubCityRepository
    {
        public SetupSubCityRepository(DbContextBase context) : base(context) { }
    }
    public interface ISetupCitySubCityLinkRepository:IEntityRepository<SetupCitySubCityLink>{  }
    public class SetupCitySubCityLinkRepository : EntityRepository<SetupCitySubCityLink>, ISetupCitySubCityLinkRepository
    {
        public SetupCitySubCityLinkRepository(DbContextBase context) : base(context) { }
    }

 public interface ISetupOwnedCitySubCityRepository:IEntityRepository<VW_OwnedSubCities>{  }
    public class SetupOwnedSubCityRepository : EntityRepository<VW_OwnedSubCities>, ISetupOwnedCitySubCityRepository
    {
        public SetupOwnedSubCityRepository(DbContextBase context) : base(context) { }
    }





}