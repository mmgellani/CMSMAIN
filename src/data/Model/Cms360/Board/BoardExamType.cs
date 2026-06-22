using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("BoardExamType", Schema = "Board")]
    public class BoardExamType {
        [Key]
        public Guid ExamTypeId { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }

        public int StatusId { get; set; }

    }

}