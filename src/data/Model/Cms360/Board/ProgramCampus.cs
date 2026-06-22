using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("ProgramCampus", Schema = "Board")]
    public class BoardProgramCampus
    {
        [Key]
        public Guid ProgramCampusId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid ProgramId { get; set; }
        public int StatusId { get; set; }
    }

    [Table("VWProgramCampus", Schema = "Board")]
    public class VWProgramCampus
    {
        [Key]
        public Guid ProgramCampusId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid ProgramId { get; set; }
        public string ProgramName { get; set; }
        public int StatusId { get; set; }
        
    }
}