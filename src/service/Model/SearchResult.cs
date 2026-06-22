using System;
using System.Collections.Generic;
using System.Linq;
using Cms360.Contract;

namespace Cms360.Service.Model
{
    public class SearchResult<TOut> : ISearchResult<TOut>
    {
        private readonly Func<object, TOut> mapper;
        private readonly IQueryable<object> query;
        private IEnumerable<TOut> results = null;
        public SearchResult(IQueryable<object> query, Func<object, TOut> mapper, int page, int pageSize)
        {
            this.mapper = mapper;
            this.Page = page;
            this.PageSize = pageSize;
            this.query = query;
        }

        public IEnumerable<TOut> Items
        {
            get
            {
                if (results == null)
                {
                    var q = this.query;
                    results = q.ToList().Select(o => mapper(o));
                }

                return results;
            }
        }
        public int Page { get; private set; }
        public int PageSize { get; private set; }
        public long Total
        {
            get
            {
                return this.query.Count();
            }
        }
    }
}
