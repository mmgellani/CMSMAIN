using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("AssessmentCategory", Schema = "Assessment")]
    public partial class AssessmentCategory
    {
        [Key]
        [Required]
        public Guid AssessmentCategoryId { get; set; }

        public string FullName { get; set; } 
         public string Code { get; set; }
    
        public int StatusId { get; set; }

        

    }
}