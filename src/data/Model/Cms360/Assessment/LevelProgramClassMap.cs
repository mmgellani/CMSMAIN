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
    [Table("LevelProgramClassMap", Schema = "Assessment")]
    public partial class LevelProgramClassMap
    {
		[Key]
		[Required]
        public Guid LevelProgramClassId { get; set; }

		public Guid LevelId { get; set; }

		public Guid ProgramId { get; set; }

		public Guid ClassId { get; set; }

		public int StatusId { get; set; }

    }

	[Table("VWLevelProgramClassMap", Schema = "Assessment")]
    public partial class VWLevelProgramClassMap
    {
		[Key]
		[Required]
        public Guid LevelProgramClassId { get; set; }
		public Guid LevelId { get; set; }
		public string LevelName { get; set; }
		public Guid ProgramId { get; set; }
		public string ProgramName { get; set; }
		public Guid ClassId { get; set; }
		public string ClassName { get; set; }
		public int StatusId { get; set; }

    }

}