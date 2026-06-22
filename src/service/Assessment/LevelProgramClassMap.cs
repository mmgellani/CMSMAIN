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
    public interface ILevelProgramClassMapRepository:IEntityRepository<LevelProgramClassMap>{  }
    public class LevelProgramClassMapRepository : EntityRepository<LevelProgramClassMap>, ILevelProgramClassMapRepository
    {
        public LevelProgramClassMapRepository(DbContextBase context) : base(context) { }
    }


    public interface IVWLevelProgramClassMapRepository:IEntityRepository<VWLevelProgramClassMap>{  }
    public class VWLevelProgramClassMapRepository : EntityRepository<VWLevelProgramClassMap>, IVWLevelProgramClassMapRepository
    {
        public VWLevelProgramClassMapRepository(DbContextBase context) : base(context) { }
    }
}