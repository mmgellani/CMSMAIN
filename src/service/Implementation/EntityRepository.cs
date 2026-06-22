/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Expressions;
using System.Collections.Generic;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;

using Cms360.Data;
using Cms360.Contract;

namespace Cms360.Service.Implementation
{
    public class EntityRepository<TEntity> : IEntityRepository<TEntity> where TEntity : class, new()
    {
        private DbContextBase context;

        public EntityRepository(DbContextBase context)
        {
            this.context = context;
        }
        public virtual IEnumerable<TEntity> All()
        {
            return this.context.Set<TEntity>().AsNoTracking().AsEnumerable();
        }
        public virtual async Task<IEnumerable<TEntity>> AllAsync()
        {
            return await this.context.Set<TEntity>().AsNoTracking().ToListAsync();
        }
        public virtual TEntity Single(Expression<Func<TEntity, bool>> predicate)
        {
            return this.context.Set<TEntity>().AsNoTracking().FirstOrDefault(predicate);
        }
        public virtual async Task<TEntity> SingleAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await this.context.Set<TEntity>().AsNoTracking().FirstOrDefaultAsync(predicate);
        }
        public virtual IEnumerable<TEntity> FindBy(Expression<Func<TEntity, bool>> predicate)
        {
            return this.context.Set<TEntity>().AsNoTracking().Where(predicate.Compile()).AsEnumerable();
        }
        public virtual async Task<IEnumerable<TEntity>> FindByAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await Task.Run(() => this.context.Set<TEntity>().AsNoTracking().Where(predicate.Compile()));
        }
        public virtual Object Add(TEntity entity)
        {
            this.context.Set<TEntity>().Add(entity);
            return this.Commit();
        }
        public virtual async Task<Object> AddAsync(TEntity entity)
        {
            await this.context.Set<TEntity>().AddAsync(entity);
            return this.CommitAsync();
        }
        public virtual Object AddAll(IEnumerable<TEntity> entity)
        {
            foreach (var item in entity)
            {
                this.context.Set<TEntity>().Add(item);
            }
            return this.Commit();
        }
        public virtual async Task<Object> AddAllAsync(IEnumerable<TEntity> entity)
        {
            foreach (var item in entity)
            {
                await this.context.Set<TEntity>().AddAsync(item);
            }
            return this.CommitAsync();
        }
        public virtual Object Update(TEntity entity)
        {
            this.context.Entry<TEntity>(entity).State = EntityState.Modified;
            return this.Commit();
        }
        public virtual async Task<Object> UpdateAsync(TEntity entity)
        {
            this.context.Entry<TEntity>(entity).State = EntityState.Modified;
            return await this.CommitAsync();
        }
        public virtual Object Delete(TEntity entity)
        {
            this.context.Entry<TEntity>(entity).State = EntityState.Deleted;
            return this.Commit();
        }
        public virtual async Task<Object> DeleteAsync(TEntity entity)
        {
            this.context.Entry<TEntity>(entity).State = EntityState.Deleted;
            return await this.CommitAsync();
        }
        public virtual Object DeleteWhere(Expression<Func<TEntity, bool>> predicate)
        {
            IEnumerable<TEntity> entities = context.Set<TEntity>().Where(predicate);

            foreach (var entity in entities)
            {
                context.Entry<TEntity>(entity).State = EntityState.Deleted;
            }
            return Commit();
        }
        public virtual async Task<Object> DeleteWhereAsync(Expression<Func<TEntity, bool>> predicate)
        {
            IEnumerable<TEntity> entities = context.Set<TEntity>().Where(predicate);

            foreach (var entity in entities)
            {
                context.Entry<TEntity>(entity).State = EntityState.Deleted;
            }
            return await CommitAsync();
        }
        public virtual Int32 Count() {
            return this.context.Set<TEntity>().AsNoTracking().Count();
        }
        public virtual async Task<Int32> CountAsync() {
            return await this.context.Set<TEntity>().AsNoTracking().CountAsync();
        }
        public virtual Object Commit()
        {
            return this.context.SaveChanges();
        }
        public virtual async Task<Object> CommitAsync()
        {
            return await this.context.SaveChangesAsync();
        }
    }
}