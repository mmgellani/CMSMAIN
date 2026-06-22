using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("MCQsAnswers", Schema = "ELearning")]
    public partial class MCQsAnswers
    {
        [Key]

        public Guid MCQsAnswersId { get; set; }
        public Guid MCQsQuestionId { get; set; }
        public string OptionId { get; set; }
        public bool IsTrue { get; set; }
        public int StatusId { get; set; }
    }
}