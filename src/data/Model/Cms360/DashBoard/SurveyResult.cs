using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model{

    [Table("SurveyResult", Schema = "Dashboard")]

    public class SurveyResult
    {


        [Key]

        public Guid SurveyResultId { get; set; }
        public Guid AdmissionFormId { get; set; }
        public Guid SurveyMasterId { get; set; }
        [Column(TypeName="jsonb")]
        public string Options { get; set; }
        public DateTime Dated { get; set; }
        public int StatusId { get; set; }





    }
}