using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model {
    [Table ("BoardFee", Schema = "Board")]
    public class BoardFee {
        [Key]
        public Guid BoardFeeId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid ProgramCampusId { get; set; }

        public Guid SessionBoardFeeId { get; set; }

        public Guid ExamTypeId { get; set; }

         public int ExamYear { get; set; }

          public DateTime ChallanDueDate { get; set; }
        
        public int StatusId { get; set; }
    }
}