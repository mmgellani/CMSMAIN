using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model{

    [Table("QueryType", Schema = "Dashboard")]

    public class QueryType
    {

        [Key]
        public Guid QueryTypeId { get; set; }
        public string FullName { get; set; }

    }
}