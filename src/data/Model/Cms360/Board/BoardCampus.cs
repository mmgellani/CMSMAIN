using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("BoardCampus", Schema = "Board")]
    public class BoardBoardCampus
    {
        [Key]
        public Guid BoardCampusId { get; set; }
        public string Abbrevation { get; set; }
        public string FullName { get; set; }
        public Guid BoardId { get; set; }
        public int StatusId { get; set; }
    }
}