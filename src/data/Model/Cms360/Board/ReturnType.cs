using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("ReturnType", Schema = "Board")]
    public class ReturnType {
        [Key]
      

        public Guid ReturnTypeId { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public int StatusId { get; set; }
    }

}