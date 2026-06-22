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
	[Table("StudentUserCreationLog", Schema = "Registration")]
	public partial class StudentUserCreationLog
	{
		[Key]
		[Required]
		public Guid StudentUserCreationLogId { get; set; }
		[Required]
		public Guid AdmissionFormId { get; set; }
		[Required]
		public string UserName { get; set; }
		public int? Batch { get; set; }
		public int? MicrosoftStatus { get; set; }
		public DateTime? MicrosoftInitialTime { get; set; }
		public DateTime? MicrosoftCompletionTime { get; set; }
		public int? ELStatus { get; set; }
		public DateTime? ELInitialTime { get; set; }
		public DateTime? ELCompletionTime { get; set; }
		public int? SmsStatus { get; set; }
		public int? Done { get; set; }
		public string Password { get; set; }

	}
	[Table("UserLoginDevice", Schema = "Registration")]
	public partial class UserLoginDevice
	{
		[Key]
		[Required]
		public Guid LoggerId { get; set; }
		[Required]
		public string UserId { get; set; }
		public string DeviceId { get; set; }
		public string DeviceIP { get; set; }
		public DateTime? CreatedOn { get; set; }
		public int? StatusId { get; set; }
		public string LoginWith { get; set; }

	}
	public class JsonFunctionResult
	{
		[Key]
		public string UserExistForLogin { get; set; }
	}
}