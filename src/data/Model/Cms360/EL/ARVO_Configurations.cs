using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("ARVO_Configurations", Schema = "EL")]
  
    public class ARVO_Configurations
    {
        [Key]
        [Required]
        [Column("SrNo")]
        public int srNo { get; set; }

        [Column("ARVOAccessToken")]
        public string ARVOAccessToken { get; set; }

        [Column("ProgramComboAndSubListURL")]
        public string ProgramComboAndSubListURL { get; set; }

        [Column("ChapterAndTopicsListURL")]
        public string ChapterAndTopicsListURL { get; set; }

        [Column("ARVOLoginEmail")]
        public string ARVOLoginEmail { get; set; }

        [Column("ARVOLoginPassword")]
        public string ARVOLoginPassword { get; set; }

        [Column("LoginURL")]
        public string LoginURL { get; set; }

        [Column("DownLoadPaperURL")]
        public string DownLoadPaperURL { get; set; }
        [Column("QuizMcqs")]
        public string QuizMcqs { get; set; }
        [Column("QuizQuestionBank")]
        public string QuizQuestionBank { get; set; }

    }

    [Table("ARVOConfiguration", Schema = "EL")]

    public class ARVOConfiguration
    {
        [Key]
        [Required] 
        [Column("ARVOConfigurationId")] 
        public Guid ARVOConfigurationId { get; set; }
        [Column("SrNo")]
        public int srNo { get; set; }
        [Column("ARVOAccessToken")]
        public string ARVOAccessToken { get; set; }
        [Column("LoginURL")]
        public string LoginURL { get; set; }
        [Column("ARVOLoginEmail")]
        public string ARVOLoginEmail { get; set; }
        [Column("ARVOLoginPassword")]
        public string ARVOLoginPassword { get; set; }
        [Column("FullName")]
        public string FullName { get; set; }
        [Column("BaseURL")]
        public string BaseURL { get; set; }
        [Column("APIURL")]
        public string APIURL { get; set; }
        [Column("StatusId")]
        public int StatusId { get; set; }
    }

}