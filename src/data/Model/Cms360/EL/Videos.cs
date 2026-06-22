using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("Videos", Schema = "ELearning")]
    public partial class Videos
    {
        [Key]
        public Guid VideosId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Tags { get; set; }
        public string Links { get; set; }
        public string Server { get; set; }
        public int StatusId { get; set; }
    }
}