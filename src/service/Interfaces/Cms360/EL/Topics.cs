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
    public interface IELTopicsRepository:IEntityRepository<ELTopics>{  }
    public interface ITopicWatchRepository : IEntityRepository<TopicsWatched> { }
    public interface IELTopicLinkRepository:IEntityRepository<ELTopicLink>{  }
    public class ELTopicsRepository : EntityRepository<ELTopics>, IELTopicsRepository
    {
        public ELTopicsRepository(DbContextBase context) : base(context) { }
    }
    
    //topic-Link-Repository-Interface
        public class ELTopicLinkRepository : EntityRepository<ELTopicLink>, IELTopicLinkRepository
    {
        public ELTopicLinkRepository(DbContextBase context) : base(context) { }
    }



     public interface IELTopicsRepositoryVM:IEntityRepository<ELTopicsVM>{  }
    public class ELTopicsRepositoryVM : EntityRepository<ELTopicsVM>, IELTopicsRepositoryVM
    {
        public ELTopicsRepositoryVM(DbContextBase context) : base(context) { }
    }
    public class TopicWatchRepository : EntityRepository<TopicsWatched>, ITopicWatchRepository
    {
        public TopicWatchRepository(DbContextBase context) : base(context) { }
    }
}