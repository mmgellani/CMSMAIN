using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("ChapterLinks", Schema = "EL")]
    public partial class ChapterLinks
    {
        [Key]
        public Guid ChapterLinkId { get; set; }
        public Guid BoardProgramClassCourseLinkId { get; set; }
        public Guid ChapterId { get; set; }
        public int OrderNo { get; set; }
        public int StatusId { get; set; }
    }


    [Table("VWChapterLinks", Schema = "EL")]

    public class ChapterLinksVM
    {

        [Key]
        public Guid ChapterLinkId { get; set; }
        public Guid BoardProgramClassCourseLinkId { get; set; }
        public Guid ChapterId { get; set; }
        public string Board { get; set; }
        public string Program { get; set; }
        public string Class { get; set; }
        public string Course { get; set; }
        public string Alias { get; set; }
        public string Chapter { get; set; }
        public int OrderNo { get; set; }
        public int StatusId { get; set; }
    }
}