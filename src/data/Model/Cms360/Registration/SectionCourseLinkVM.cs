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
    [Table("VWSectionCourseViaSession", Schema = "Registration")]
    public partial class RegistrationSectionCourseLinkVM
    {
        [Key]
        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]

        public Guid CampusProgramId { get; set; }
        [Required]

        public string ClassName { get; set; }
        [Required]
        public string SectionName { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]

        public Guid ClassId { get; set; }
        [Required]

        public Guid SessionId { get; set; }
        [Required]

        public Guid CampusId { get; set; }
        [Required]

        public Guid ProgramDetailId { get; set; }

        [Required]
        public Guid SectionId { get; set; }
        [Required]
        public int FromSerial { get; set; }
        [Required]
        public int ToSerial { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public int RollNo { get; set; }

    }

    [Table("GetSectionsForAssessment", Schema = "Assessment")]
    public partial class SectionCourseLinkVMForAssessment
    {
        [Key]
        [Required]
        public Guid SectionCourseLinkId { get; set; }

        public Guid CampusProgramId { get; set; }

        public string ClassName { get; set; }
        public string SectionName { get; set; }

        public string FullName { get; set; }

        public string Description { get; set; }


        public Guid ClassId { get; set; }


        public Guid SessionId { get; set; }


        public Guid CampusId { get; set; }


        public Guid ProgramDetailId { get; set; }

        public Guid SectionId { get; set; }

        public int FromSerial { get; set; }
        public int ToSerial { get; set; }

        public int StatusId { get; set; }
    
        public Guid LoggerId { get; set; }
        public Guid LevelId { get; set; }
        public int RollNo { get; set; }

    }

    public partial class RegistrationSectionCourseLinkVMModel
    {
        [Key]
        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]

        public Guid CampusProgramId { get; set; }
        [Required]

        public string ClassName { get; set; }
        [Required]
        public string SectionName { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]

        public Guid ClassId { get; set; }
        [Required]

        public Guid SessionId { get; set; }
        [Required]

        public Guid CampusId { get; set; }
        [Required]

        public Guid ProgramDetailId { get; set; }

        [Required]
        public Guid SectionId { get; set; }
        [Required]
        public int FromSerial { get; set; }
        [Required]
        public int ToSerial { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public int RollNo { get; set; }

    }

    [Table("VWSectionCourseViaSessionEx", Schema = "Registration")]
    public partial class RegistrationSectionCourseLinkVMEx
    {
        [Key]
        [Required]
        public Guid SectionCourseLinkId { get; set; }
        [Required]

        public Guid CampusProgramId { get; set; }
        [Required]

        public string ClassName { get; set; }
        [Required]
        public string SectionName { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]

        public Guid ClassId { get; set; }
        [Required]

        public Guid SessionId { get; set; }
        [Required]

        public Guid CampusId { get; set; }
        [Required]

        public Guid ProgramDetailId { get; set; }

        [Required]
        public Guid SectionId { get; set; }
        [Required]
        public int FromSerial { get; set; }
        [Required]
        public int ToSerial { get; set; }
        [Required]
        public int StatusId { get; set; }
        [Required]
        public Guid LoggerId { get; set; }
        public int RollNo { get; set; }
        // [Required]
        // public Guid RoomBuildingLinkId{ get; set; }
        // [Required]
        // public string buildingRooms { get; set; }



    }


    //[Table("VWSectionCourseViaSession", Schema = "Registration")]
    public partial class SectionCampusVM
    {
        [Key]
        [Required]
        public Guid SectionCourseLinkId { get; set; }
        public Guid CampusProgramId { get; set; }
        public string ClassName { get; set; }
        public string SectionName { get; set; }
        public string Description { get; set; }
        public Guid ClassId { get; set; }
        public Guid SessionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid SectionId { get; set; }
        public bool IsChecked { get; set; }

    }

    [Table("SectionRightLink", Schema = "Role")]
    public partial class SectionRightLink
    {
        [Key]
        public Guid SectionRightLinkId { get; set; }
        [Column(TypeName = "jsonb")]
        public string AllowedSection { get; set; }
        public int UserId { get; set; }
    }
    [Table("MaskRightLink", Schema = "Role")]
    public partial class MaskRightLink
    {
        [Key]
        public Guid MaskRightLinkId { get; set; }
        [Column(TypeName = "jsonb")]
        public string AllowedMask { get; set; }
        public int UserId { get; set; }
    }





}