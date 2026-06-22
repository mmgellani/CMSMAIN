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
    public interface ISetupSectionRepository:IEntityRepository<SetupSection>{  }
    public class SetupSectionRepository : EntityRepository<SetupSection>, ISetupSectionRepository
    {
        public SetupSectionRepository(DbContextBase context) : base(context) { }
    }
}