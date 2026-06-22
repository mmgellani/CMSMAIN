using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("AppException", Schema = "public")]
    public class AppException
    {
        [Key]
        public int ID { get; set; }

        public string Message { get; set; }
        
        public DateTime Time { get; set; }
        
        public string Data { get; set; }
    }
}