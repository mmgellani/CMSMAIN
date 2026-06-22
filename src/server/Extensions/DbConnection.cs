using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;

using Dapper;

namespace Cms360.Server
{
    public class SQLConnection
    {
        private SqlConnection connection;
        private  IDbConnection conn;

        public SQLConnection(string ConnectionString)
        {
            this.connection = new SqlConnection(ConnectionString);
            this.conn = this.connection;
        }

        public IEnumerable<object> GetData(string query)
        {
            IEnumerable<object> result;

            result = conn.Query(query);

            return result;
        }

        public void Execute(string query)
        {
            conn.Execute(query);
        }

        public void openConnection() 
        {
            IDbConnection conn = this.connection;
            if (conn.State == ConnectionState.Closed)
                conn.Open();
        }

        public void closeConnection() 
        {
            IDbConnection conn = this.connection;
            if (conn.State == ConnectionState.Open)
                conn.Close();
        }
    }
}