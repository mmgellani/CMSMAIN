using System;
using System.Text;
using System.Collections.Generic;

using Cms360.Data;
using Cms360.Contract;
using Cms360.Data.Model;
using Cms360.Service.Implementation;

namespace Cms360.Service
{
    public interface IAdmissionReportsEnrolledRepository:IEntityRepository<AdmissionReportsEnrolled>{  }
    public class AdmissionReportsEnrolledRepository : EntityRepository<AdmissionReportsEnrolled>, IAdmissionReportsEnrolledRepository
    {
        public AdmissionReportsEnrolledRepository(DbContextBase context) : base(context) { }
    }
}