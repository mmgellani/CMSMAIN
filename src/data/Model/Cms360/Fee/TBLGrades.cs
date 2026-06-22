using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{

    [Table("TBLGrades", Schema = "Fee")]
    public partial class FeeTBLGrades
    {
        [Key]
        [Required]
        public Guid ScholarshipTypeId { get; set; }
        [Required]
        public string Grades { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }


    }

}