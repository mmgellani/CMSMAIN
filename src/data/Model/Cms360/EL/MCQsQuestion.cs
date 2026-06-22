using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("Mcqs", Schema = "EL")]
    public partial class MCQsQuestion
    {
        [Key]

        public Guid McqId { get; set; }
        public Guid ChapterId { get; set; }
        public string Question { get; set; }
         
         // [Column(TypeName = "jsonb")]
       [Column(TypeName = "jsonb")]
        public string Answers { get; set; }
        public int StatusId { get; set; }
    }

    
}