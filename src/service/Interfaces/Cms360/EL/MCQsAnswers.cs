


using System;
using System.Text;
using System.Collections.Generic;

using Cms360.Data;
using Cms360.Contract;
using Cms360.Data.Model;
using Cms360.Service.Implementation;

namespace Cms360.Service
{
    public interface IMCQsAnswersRepository:IEntityRepository<MCQsAnswers>{  }
    public class MCQsAnswersRepository : EntityRepository<MCQsAnswers>, IMCQsAnswersRepository
    {
        public MCQsAnswersRepository(DbContextBase context) : base(context) { }
    }
}