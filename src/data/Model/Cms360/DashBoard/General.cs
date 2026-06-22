using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("General")]
    public class General
    {
        [Key]
        public string FullName { get; set; }
    }

    [Table("ComparisonData")]
    public class ComparisonData
    {
        [Key]
        public Guid Id { get; set; }
        public int Session { get; set; }
        public string Shift { get; set; }
        public int Total { get; set; }
    }
}