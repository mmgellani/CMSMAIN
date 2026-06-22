/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

namespace Cms360.Contract
{
    public interface IEntityRepository<TEntity> where TEntity : class, new()
    {
        IEnumerable<TEntity> All();
        Task<IEnumerable<TEntity>> AllAsync();
        TEntity Single(Expression<Func<TEntity, bool>> predicate);
        Task<TEntity> SingleAsync(Expression<Func<TEntity, bool>> predicate);
        IEnumerable<TEntity> FindBy(Expression<Func<TEntity, bool>> predicate);
        Task<IEnumerable<TEntity>> FindByAsync(Expression<Func<TEntity, bool>> predicate);
        Object Add(TEntity entity);
        Task<Object> AddAsync(TEntity entity);
        Object AddAll(IEnumerable<TEntity> entity);
        Task<Object> AddAllAsync(IEnumerable<TEntity> entity);
        Object Update(TEntity entity);
       
        Task<Object> UpdateAsync(TEntity entity);
        Object Delete(TEntity entity);
        Task<Object> DeleteAsync(TEntity entity);
        Object DeleteWhere(Expression<Func<TEntity, bool>> predicate);                        
        Task<Object> DeleteWhereAsync(Expression<Func<TEntity, bool>> predicate);
        Int32 Count();
        Task<Int32> CountAsync();
        Object Commit();
        Task<Object> CommitAsync();
    }

    public interface IEntityRepositoryEx<TEntity> where TEntity : class, new()
    {
        IEnumerable<TEntity> All();
        IEnumerable<TEntity> FindBy(Object predicate);
        IEnumerable<EEntity> FindBy<EEntity>(String query) where EEntity : class, new();
        IEnumerable<EEntity> FromSql<EEntity>(String query) where EEntity : class, new();
        Object Add(TEntity entity);
        Object AddAll(IEnumerable<TEntity> entity);
        Object Update(TEntity entity);
        Object Delete(TEntity entity);
        Object DeleteWhere(Object predicate);
        Object Execute(String query);
    }
}