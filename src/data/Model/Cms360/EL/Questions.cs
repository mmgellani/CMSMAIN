/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("Questions", Schema = "EL")]
    public partial class ELQuestions
    {
		[Key]
		[Required]
		public Guid QuestionId { get; set; }
		[Required]
		public Guid TopicId { get; set; }
		[Required]
		public string FullQuestion { get; set; }
		[Required]
		public int QuestionType { get; set; }
		[Required]
		public int DifficultyLevel { get; set; }
		[Required]
		[Column(TypeName = "jsonb")]
		public string Answers { get; set; }
		[Required]
		public int OrderNumber { get; set; }
		[Required]
		public int StatusId { get; set; }
		[Required]
		public Guid LoggerId { get; set; }
    }
}