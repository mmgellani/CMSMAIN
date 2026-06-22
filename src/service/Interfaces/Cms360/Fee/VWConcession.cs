using System;
using System.Collections.Generic;
using System.Text;
using Cms360.Contract;
using Cms360.Data;
using Cms360.Data.Model;
using Cms360.Service.Implementation;

namespace Cms360.Service {
    public interface IVWConcessionRepository : IEntityRepository<VWConcession> { }
    public class VWConcessionRepository : EntityRepository<VWConcession>, IVWConcessionRepository {
        public VWConcessionRepository (DbContextBase context) : base (context) { }
    }
}