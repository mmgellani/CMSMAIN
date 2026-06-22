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
    [Table("Topics", Schema = "EL")]
    public partial class ELTopics
    {
        [Key]

        public Guid TopicId { get; set; }

        public Guid ChapterId { get; set; }

        public string Title { get; set; }
        [Column(TypeName = "jsonb")]

        public string VideoLinks { get; set; }

        public string Description { get; set; }

        public int StatusId { get; set; }
        public Guid? BoardId { get; set; }

    }



    [Table("VW-Topics", Schema = "EL")]
    public partial class ELTopicsVM
    {
        [Key]

        public Guid TopicId { get; set; }

        public Guid ChapterId { get; set; }

        public string Title { get; set; }
        [Column(TypeName = "jsonb")]

        public string VideoLinks { get; set; }

        public string Description { get; set; }

        public int StatusId { get; set; }
        public Guid? BoardId { get; set; }
        public string Board { get; set; }

    }



[Table("TopicLink", Schema = "EL")]
    public partial class ELTopicLink
    {
        [Key]

        public Guid TopicId { get; set; }

        public Guid ChapterId { get; set; }

        public string Title { get; set; }
        [Column(TypeName = "jsonb")]

        public string VideoLinks { get; set; }

        public string Description { get; set; }

        public int StatusId { get; set; }
        public Guid? BoardId { get; set; }

    }
    //  [Table("Topics", Schema = "ELearning")]
    // public partial class ELTopics
    // {
    // 	[Key]

    // 	public Guid TopicsId { get; set; }

    // 	public Guid VideosId { get; set; }


    // 	public string Name { get; set; }

    // 	public string Description { get; set; }

    // 	public int StatusId { get; set; }

    // 	public Guid MCQsQuestionId { get; set; }
    // }
}