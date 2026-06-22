using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("Boards", Schema = "EL")]
    public partial class Boards
    {
        [Key]
        public Guid BoardId { get; set; }   
        public string FullName { get; set; }
        public string Abbreviation { get; set; }
        public int StatusId { get; set; }
    }


      [Table("ArvoDataBoards", Schema = "EL")]
    public partial class ArvoDataBoards
    {
        [Key] 
        public string Abbreviation { get; set; } 
        public string FullName { get; set; }
        public string ClassIds { get; set; }
    }
}