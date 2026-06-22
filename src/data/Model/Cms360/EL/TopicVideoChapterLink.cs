
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("TopicVideoChapterLink", Schema = "ELearning")]
    public partial class TopicVideoChapterLink
    {
        [Key]
        public Guid TopicVideoChapterLinkId { get; set; }  
        public Guid TopicsId { get; set; }   

        public Guid VideosId { get; set; }   
        public Guid ChapterId { get; set; }   
        public string OrderBy { get; set; }   
        public int StatusId { get; set; }
    }
}