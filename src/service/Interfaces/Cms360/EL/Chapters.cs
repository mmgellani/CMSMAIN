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
    public interface IELChaptersRepository:IEntityRepository<ELChapters>{  }
    public class ELChaptersRepository : EntityRepository<ELChapters>, IELChaptersRepository
    {
        public ELChaptersRepository(DbContextBase context) : base(context) { }
    }


    public interface IUserMcqResponseRepository : IEntityRepository<UserMcqResponse> { }
    public class UserMcqResponseRepository : EntityRepository<UserMcqResponse>, IUserMcqResponseRepository
    {
        public UserMcqResponseRepository(DbContextBase context) : base(context) { }
    }


    public interface IMcqAttemptedRepository : IEntityRepository<McqAttempted> { }
    public class McqAttemptedRepository : EntityRepository<McqAttempted>, IMcqAttemptedRepository
    {
        public McqAttemptedRepository(DbContextBase context) : base(context) { }
    }
}