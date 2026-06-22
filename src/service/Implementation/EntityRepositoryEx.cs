using System;
using System.Data;
using System.Linq;
using System.Collections.Generic;

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using Newtonsoft.Json;

using Cms360.Data;
using Cms360.Contract;
using Cms360.Data.Model;

using Dapper;

namespace Cms360.Service.Implementation
{
    public class EntityRepositoryEx<TEntity> : IEntityRepositoryEx<TEntity> where TEntity : class, new()
    {
        private DbContextBase context;
        private HttpContext http;

        internal IDbConnection Connection
        {
            get
            {
                return context.Database.GetDbConnection();
            }
        }

        public EntityRepositoryEx(DbContextBase context, IHttpContextAccessor httpc)
        {
            this.context = context;
            this.http = httpc.HttpContext;
        }

        public virtual IEnumerable<TEntity> All()
        {
            IEnumerable<TEntity> entities = null;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.GetList<TEntity>();

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }
        public virtual IEnumerable<TEntity> FindBy(Object predicate)
        {
            IEnumerable<TEntity> entities = null;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.GetList<TEntity>(predicate);

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }

        public virtual IEnumerable<EEntity> FindBy<EEntity>(String predicate) where EEntity : class, new()
        {
            IEnumerable<EEntity> entities = null;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.GetList<EEntity>(predicate);

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }

        public virtual IEnumerable<EEntity> FromSql<EEntity>(String predicate) where EEntity : class, new()
        {
            IEnumerable<EEntity> entities = null;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.FromSql<EEntity>(predicate);

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }

        public virtual Object Add(TEntity entity)
        {
            int entities = 0;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.Insert<Int32>(entity);
                this.GenerateLog(entity, "Inserted");

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }

        public virtual Object AddAll(IEnumerable<TEntity> entity)
        {
            foreach (var item in entity)
            {
                this.Add(item);
            }

            return null;
        }

        public virtual Object Update(TEntity entity)
        {
            Object entities = null;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.Update(entity);
                this.GenerateLog(entity, "Update");

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }

        public virtual Object Delete(TEntity entity)
        {
            Object entities = null;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.Delete(entity);
                this.GenerateLog(entity, "Delete");

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }

        public virtual Object DeleteWhere(Object predicate)
        {
            Object entities = null;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.Delete(predicate);

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }

        public virtual Object Execute(String query)
        {
            Object entities = null;

            if (this.Connection.State == ConnectionState.Closed)
                this.Connection.Open();

            try
            {
                entities = this.Connection.Query(query);

                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }
            catch
            {
                if (this.Connection.State != ConnectionState.Closed)
                    this.Connection.Close();
            }

            return entities;
        }

        private void GenerateLog(TEntity entity, String operation)
        {
            var userlog = new UserLog()
            {
                AuditId = new Guid(),
                UserId = ApplicationUser().UserId,
                DateTime = new DateTime(),
                LocalIpPort = ClientIp(),
                PublicIpPort = AgentInfo(),
                User = OsUser(),
                ControllerAction = operation,                
                Operation = JsonConvert.SerializeObject(entity)
            };

            this.Connection.Insert(userlog);
        }

        private String OsUser()
        {
            return Environment.GetEnvironmentVariable("USERNAME") ?? Environment.GetEnvironmentVariable("USER");
        }

        private String ClientIp()
        {
            var RemoteIp = http.Request.Headers.ContainsKey("X-Real-IP") ? http.Request.Headers["X-Real-IP"].FirstOrDefault() : "";
            return RemoteIp.Length < 1 ?
                http.Request.Headers.ContainsKey("X-Forwarded-For") ? http.Request.Headers["X-Forwarded-For"].FirstOrDefault() :
                String.Format("{0}:{1}", http.Connection.RemoteIpAddress, http.Connection.RemotePort) : "";
        }

        private IUser ApplicationUser()
        {
            var user = http.Items["CurrentUser"];
            return user == null ? null : (IUser)user;
        }

        public String AgentInfo()
        {
            return http.Request.Headers["User-Agent"].FirstOrDefault();
        }
    }
}