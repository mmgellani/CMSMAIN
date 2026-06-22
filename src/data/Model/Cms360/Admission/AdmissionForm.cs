/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model
{
    [Table("AdmissionForm", Schema = "Admission")]
    public partial class AdmissionAdmissionForm
    {
        [Key]
        [Required]
        public Guid AdmissionFormId { get; set; }

        [Required]
        public Guid CampusProgramId { get; set; }

        [Required]
        public Guid StudentId { get; set; }

        [Required]
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string RefferenceNo { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public Guid LoggerId { get; set; }

        public string StudentType { get; set; }

        public string FormNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }

    }
    [Table("GetAllProvinces", Schema = "StepAssesment")]
    public partial class GetAllProvincesVM
    {
        [Key]
        public Guid? StepProvinceId { get; set; }
        public string FullName { get; set; }
        public Boolean? Flag { get; set; }
        public int StatusId { get; set; }
    }
    [Table("GetPrograms", Schema = "StepAssesment")]
    public partial class GetAllProgramsVM
    {
        [Key]
        public Guid? ProgramDetailId { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public Guid? ProgramId { get; set; }

    }

    public partial class GetAllCitiesprovine
    {
        [Key]
        public Guid? StepCityId { get; set; }
        public Guid? StepProvinceId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public int StatusId { get; set; }
    }
    public partial class responseoninsert
    {
        [Key]
        public string RefferenceNo { get; set; }


        public string FullName { get; set; }

        public string Email { get; set; }
    }

    [Table("VWAdmissionForm", Schema = "Admission")]
    public partial class AdmissionAdmissionFormVM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid StudentLoggerId { get; set; }
        public string StudentType { get; set; }
        public string FormNo { get; set; }

    }

    [Table("VWAdmissionFormCpl2", Schema = "Admission")]
    public partial class AdmissionFormCplVM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }

        public string AdmissionStatus { get; set; }
        public string StudentType { get; set; }

    }

    [Table("VWAdmissionFormCpl4", Schema = "Admission")]
    public partial class AdmissionFormCpl4VM
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }

        public string AdmissionStatus { get; set; }
        public string Description { get; set; }

        public string StudentType { get; set; }

        public string FormNo { get; set; }

        public string Operation { get; set; }

        public Boolean? IsApproval { get; set; }

        public int? AnnualPackage { get; set; }

        public string Relationship { get; set; }
        public string CmsRollNo { get; set; }
        public string CmsSection { get; set; }

    }

    public partial class AdmissionFormPromtedFrom
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }

        public string AdmissionStatus { get; set; }
        public string Description { get; set; }

        public string StudentType { get; set; }

        public string FormNo { get; set; }

        public string Operation { get; set; }

        public Boolean? IsApproval { get; set; }

        public int? AnnualPackage { get; set; }
        public Guid? PromotedFrom { get; set; }

        public int? Flag { get; set; }


    }

    [Table("studentModel")]
    public partial class studentModel
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }
        public string ReferrenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        public double Percentage { get; set; }
        public Guid ZoneId { get; set; }
    }


    public partial class studentModelEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }
        public string ReferrenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }


        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        public double Percentage { get; set; }
        public Guid ZoneId { get; set; }
        public int ObtainedMarks { get; set; }
        public int TotalMarks { get; set; }
        public string Gender { get; set; }
    }

    public partial class ScholarshipStudentModel
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }
        public string ReferrenceNo { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        public double Percentage { get; set; }
        public Guid ZoneId { get; set; }
        public Guid ScholarshipId { get; set; }
        public string ScholarshipName { get; set; }
    }

    public class AdmissionCollect
    {
        public AdmissionAdmissionForm AdmissionForm { get; set; }
        public AdmissionStudents Student { get; set; }
        public String FeeHead { get; set; }
    }

    [Table("TotalMarks", Schema = "Setup")]
    public class MarksData
    {
        [Key]
        public Int64 Marks { get; set; }
    }

    public class AdmissionFormData
    {
        public List<SetupAdmissionType> AdmissionType { get; set; }
        public List<SetupGender> Gender { get; set; }
        public List<SetupReligion> Religion { get; set; }
        public List<SetupDegree> Degree { get; set; }
        public List<SetupGroup> Group { get; set; }
        public List<MarksData> TotalMarks { get; set; }
        public List<SetupBoard> Board { get; set; }
        public List<SetupPassStatus> PassStatus { get; set; }
        public List<SetupBloodGroup> BloodGroup { get; set; }

    }

    public class AdmissionWidgetData
    {
        public List<AdmissionAdmissionForm> AdmissionForm { get; set; }
        public List<FeeStudentChallan> StudentChallan { get; set; }
        public List<RegistrationEnrollments> Enrollments { get; set; }

    }

    public class AdmissionWidgetDataA
    {
        public List<AdmissionsCount> AdmissionForm { get; set; }
        public List<FeeStudentChallanCount> StudentChallan { get; set; }
        public List<EnrollmentsCount> Enrollments { get; set; }

    }
    public class AdmissionsCount
    {
        [Key]
        public int AdmissionCount { get; set; }
    }

    public class Survey
    {
        [Key]
        public int? TotalSurvey { get; set; }
        public int? TotalSubmitted { get; set; }
        public float? Average { get; set; }
        public float? GroupAverage { get; set; }
    }

    public class SurveyList
    {
        [Key]
        public Guid? NewID { get; set; }
        public int? TotalSurvey { get; set; }
        public int? TotalSubmitted { get; set; }
        public Guid? CityId { get; set; }
        public string CityName { get; set; }
        public float? Average { get; set; }
        public float? GroupAverage { get; set; }
        public float? MonthAverage { get; set; }
        public float? PrevAverage { get; set; }
    }

    public class SurveySubCityList
    {
        [Key]
        public Guid NewID { get; set; }
        public int TotalSurvey { get; set; }
        public int TotalSubmitted { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }
        public float Average { get; set; }
        public float GroupAverage { get; set; }
        public float MonthAverage { get; set; }
        public float PrevAverage { get; set; }
    }


    public class TopTeachers
    {
        [Key]
        public Guid? NewID { get; set; }
        public string TeacherId { get; set; }
        public string TeacherName { get; set; }
        public string CourseName { get; set; }
        public string SubCiy { get; set; }
        public float? Average { get; set; }
    }

    public class AcademicMarks
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid StudentId { get; set; }
        public string CourseName { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainedMarks { get; set; }
        public string Degree { get; set; }
    }

    public class SurveyCampusList
    {
        [Key]
        public Guid NewID { get; set; }
        public int TotalSurvey { get; set; }
        public int TotalSubmitted { get; set; }
        public Guid CampusId { get; set; }
        public string CampusName { get; set; }
        public float Average { get; set; }
        public float GroupAverage { get; set; }
        public float MonthAverage { get; set; }
        public float PrevAverage { get; set; }
    }
    public class SurveyCourseList
    {
        [Key]
        public Guid NewID { get; set; }
        public Guid CourseId { get; set; }
        public long TotalSurvey { get; set; }
        public long TotalSubmitted { get; set; }
        public string CourseName { get; set; }
        public double Average { get; set; }
        public double GroupAverage { get; set; }
        public double MonthAverage { get; set; }
        public double PrevAverage { get; set; }
    }

    public class SurveySubjectList
    {
        [Key]
        public Guid NewID { get; set; }
        public string TeacherId { get; set; }
        public string TeacherName { get; set; }
        public int TotalSurvey { get; set; }
        public int TotalSubmitted { get; set; }
        public float Average { get; set; }
        public float GroupAverage { get; set; }
        public float MonthAverage { get; set; }
        public float PrevAverage { get; set; }
    }


    public class TeacherRatingList
    {
        [Key]
        public Guid NewID { get; set; }
        public string CampusId { get; set; }
        public string CampusName { get; set; }
        public string CityName { get; set; }
        public string TeacherName { get; set; }
        public string TeacherId { get; set; }
        public float Average { get; set; }
    }

    public class SubjectRatingList
    {
        [Key]
        public Guid NewID { get; set; }
        public string CampusId { get; set; }
        public string CampusName { get; set; }
        public string CityName { get; set; }
        public string CourseName { get; set; }
        public float Average { get; set; }
    }

    public class FeeStudentChallanCount
    {
        [Key]
        public int PaidChallanCount { get; set; }
    }

    public class AdmissiontrendClass
    {
        [Key]
        public DateTime PaidDate { get; set; }
        public int Count { get; set; }

    }

    public class EnrollmentsCount
    {
        [Key]
        public int EnrollmentCount { get; set; }
    }

    [Table("VWAdmissionFormCpl3", Schema = "Admission")]
    public class VWAdmissionFormCpl3
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }

    }

    [Table("VWStudentsProfile", Schema = "Admission")]
    public class VWStudentsProfile
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string CityName { get; set; }

        public bool ShouldAbsent { get; set; }
        public string Image { get; set; }


        public string SessionName { get; set; }
    }

    public class VWStudentsProfileEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string CityName { get; set; }

        public bool ShouldAbsent { get; set; }

        [Column(TypeName = "jsonb")]
        public string GuardianName { get; set; }
        public string Image { get; set; }
    }

    [Table("VWStudentFeeProfile", Schema = "Admission")]
    public class VWStudentFeeProfile
    {

        [Key]
        public Guid FeeChallanId { get; set; }

        public Guid FeeHeadId { get; set; }

        public Guid StudentFeeStructureId { get; set; }

        public Guid AdmissionFormId { get; set; }

        public Guid StudentChallanId { get; set; }

        public Guid? ConcessionDetailId { get; set; }

        public Guid CampusId { get; set; }

        public Guid ProgramDetailId { get; set; }

        public int InstallmentNo { get; set; }

        public string ChallanNo { get; set; }

        public string FeeHead { get; set; }

        public string FullName { get; set; }

        public string RefferenceNo { get; set; }

        public string FatherName { get; set; }

        public string ConcessionName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public int FeeAmount { get; set; }

        public int ChallanAmount { get; set; }

        public int PayableAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public int StatusId { get; set; }

        public Guid LoggerId { get; set; }
        public string TotalMarks { get; set; }
        public string ObtainMarks { get; set; }
        public string SectionName { get; set; }
        public string Remarks { get; set; }

    }

    public class VWStudentSectionProfile
    {

        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public Guid GenderId { get; set; }
        [Key]
        public Guid ClassId { get; set; }

        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string CityName { get; set; }
    }

    public class VWStudentSectionProfile2
    {

        public Guid AdmissionFormId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        public Guid SectionCourseLinkId { get; set; }

        public Guid GenderId { get; set; }
        [Key]
        public Guid ClassId { get; set; }

        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }
        public string Description { get; set; }
        public string CampusName { get; set; }
        public string CityName { get; set; }
        public string ClassName { get; set; }
    }


    public class StudentsProfileCon
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid ChallanTypeId { get; set; }
        public string RefferenceNo { get; set; }

        public string RollNo { get; set; }

        public string FullName { get; set; }

    }
    public class ExamUpdList
    {
        [Key]
        public Guid ExamDetailId { get; set; }
        public Guid ExamMasterId { get; set; }
        public Guid ExamTypeId { get; set; }
        public Guid ProgramCourseLinkId { get; set; }
        public int Total { get; set; }
        public int Obtained { get; set; }
        public string ExamType { get; set; }
        public string FullName { get; set; }
        public bool Checked { get; set; }
        public Guid AdmissionFormId { get; set; }
        public string Month { get; set; }

        public string MonthDate { get; set; }
        public string ExamTypeName { get; set; }
        public Guid AttendanceStatusId { get; set; }
        public string Attendance { get; set; }



    }

    public class DuplicateAdmission
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string ContactNo { get; set; }
        public string BoardRollNo { get; set; }

        public bool IsChecked { get; set; }

    }

    public class GenderWiseCount
    {
        [Key]
        public Guid NewId { get; set; }
        public string SessionName { get; set; }

        public string Description { get; set; }
        public string Campus { get; set; }
        public string ClassName { get; set; }
        public int Male { get; set; }

        public int Female { get; set; }

    }

    public class GenderWiseCountEx
    {
        [Key]
        public Guid NewId { get; set; }
        public string SessionName { get; set; }

        public string Description { get; set; }
        public string Campus { get; set; }
        public string ClassName { get; set; }
        public int Male { get; set; }

        public int Female { get; set; }

        public int InstallmentNo { get; set; }

    }

    public class ElMigrationVM
    {
        [Key]
        public Guid StudentId { get; set; }
        public string RollNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }

        public bool IsChecked { get; set; }

    }

    public class KinshipStudent
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public Guid CampusProgramId { get; set; }
        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }

        public bool IsChecked { get; set; }

        public string RollTeachId { get; set; }
        public string RelName { get; set; }
        public string RelFatherName { get; set; }
        public string Type { get; set; }
        public string City { get; set; }
        public string Session { get; set; }
        public string Program { get; set; }
        public string Section { get; set; }

    }

    public class AcceptanceResponse
    {
        [Key]
        public string RefferenceNo { get; set; }


        public string FullName { get; set; }

        public string Email { get; set; }

    }
    public class AcceptanceResponseSSAT
    {
        [Key]
        public string RefferenceNo { get; set; }


        public string FullName { get; set; }

        public string Email { get; set; }

        public string TestCity { get; set; }

        public string programdetail { get; set; }

    }


    public class GetReferenceNumberVM
    {
        [Key]
        public Guid? StepStudentId { get; set; }

        public string RefferenceNo { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }
        public string TestCity { get; set; }

    }

    public class OnlineApprovalStudent
    {

        public Guid AdmissionFormId { get; set; }

        public Guid CampusProgramId { get; set; }
        [Key]
        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }

        public bool IsApproval { get; set; }
        public DateTime? AdmissionDate { get; set; }
        public string ApllicationStatus { get; set; }


    }

    public class OnlineProcessFee
    {

        [Key]
        public string ChallanNo { get; set; }

        public int FeeAmount { get; set; }

        public DateTime? PaidDate { get; set; }


    }

    public class OnlineProgramInfo
    {

        [Key]
        public string Name { get; set; }

        public string Description { get; set; }

    }
    public class GetResult
    {
        [Key]
        public string Response { get; set; }


    }
    public class StudentResultModel
    {
        [Key]
        public string RefrenceNo { get; set; }
        public string ProgramName { get; set; }
        public string StudentName { get; set; }
        public string StudentCNIC { get; set; }


    }
    public class Teacherexistmodel
    {
        [Key]
        public string FullName { get; set; }
        public string Email { get; set; }


    }
    public class EnrolledStudentResultModel
    {
        [Key]
        public string RefrenceNo { get; set; }
        public string ProgramName { get; set; }
        public string StudentName { get; set; }
        public string RollNo { get; set; }
        public string StudentCNIC { get; set; }
        public string ClassName { get; set; }
        public string CampusName { get; set; }

    }
    public class ConcessKinBulk
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public double Percentage { get; set; }

        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }

        public bool IsChecked { get; set; }

        public string FormNo { get; set; }
    }

    public class ConcessKinBulkEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public double Percentage { get; set; }

        public string RefferenceNo { get; set; }

        public string FullName { get; set; }
        public string FatherName { get; set; }

        public bool IsChecked { get; set; }

        public string FormNo { get; set; }
        public double ObtainMarks { get; set; }
        public double TotalMarks { get; set; }
    }


    public class KinshipConcession
    {
        [Key]
        public Guid ScholarshipCriteriaId { get; set; }
        public string ConcessionName { get; set; }
    }

    public class ProgramMult
    {
        [Key]
        public Guid ProgramDetailId { get; set; }
        public string Description { get; set; }
        public int FormCollection { get; set; }
        public int FeePaid { get; set; }
    }

    public class CityMult
    {
        [Key]
        public Guid ProgramDetailId { get; set; }
        public string CityName { get; set; }
        public int FormCollection { get; set; }
        public int FeePaid { get; set; }
    }

    public class CityMultDrill
    {
        [Key]
        public Guid Id { get; set; }
        public string CityName { get; set; }
        public int? Enrolled { get; set; }
        public int? FeePaid { get; set; }

        public string ClassName { get; set; }
    }

    public class PreDashoboard
    {

        public int Total { get; set; }
        public int Online { get; set; }

        public int Office { get; set; }
        public int Enrolled { get; set; }

        [Key]
        public string CityName { get; set; }

    }

    public class AdmissionWithdrawl
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public string FullName { get; set; }
        public string StudentCNIC { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string RollNo { get; set; }
        public string FatherName { get; set; }
        public string ParentCNIC { get; set; }
        public string Religion { get; set; }
        public string Program { get; set; }
        public string Description { get; set; }
        public string ClassName { get; set; }
        public string Address { get; set; }
        public string ParentNo { get; set; }
        public string Code { get; set; }
        public DateTime PaidDate { get; set; }
        public string CollegeCode { get; set; }
        public string ClassFromWithDraw { get; set; }
        public string ReasonOfWithDraw { get; set; }
        public string ArrearDues { get; set; }
        public string Remarks { get; set; }

    }
    public class AdmissionAgingData
    {

        public Guid AdmissionFormId { get; set; }
        [Key]
        public string studentRno { get; set; }
        public string studentName { get; set; }
        public string fatherName { get; set; }
        public string formNo { get; set; }
        public string email { get; set; }
        public string phoneNo { get; set; }
        public string regdate { get; set; }
        public string fatherCnicCheck { get; set; }
        public string studentCnic { get; set; }
        public string studentPic { get; set; }
        public string resultCard { get; set; }
        public string AdmissionStatus { get; set; }
        public int Aging { get; set; }

    }

    public class TransferList
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public string RefferenceNo { get; set; }

        public string FullName { get; set; }

        public string FatherName { get; set; }

        public Guid ClassId { get; set; }





    }


    public class GetStatus
    {
        [Key]
        public string Narration { get; set; }

        public Guid ScholarshipCriteriaId { get; set; }

        public int Status { get; set; }




    }

    public class GetstudentMigrationtrsnfer
    {
        [Key]

        public Guid NewID { get; set; }

        public string Type { get; set; }

        public DateTime DateTime { get; set; }
        public string FromCampus { get; set; }
        public string ToCampus { get; set; }



    }


    public class TeacherSearchApiCoursesEx
    {
        [Key] public Guid NewID { get; set; }
        public Guid StaffId { get; set; }
        public string StaffName { get; set; }
        public Guid CourseId { get; set; }
        public string CourseName { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; }
        public Guid SubCityId { get; set; }
        public string SubCityName { get; set; }
        public string Section { get; set; }
        public Guid SectionCourseLinkId { get; set; }
        public int TotalLectrTeacher { get; set; }
        public int TotalLectrTeacherMarked { get; set; }
        public bool Flag { get; set; }

    }

    public class transferModel
    {
        public Guid admissionformid { get; set; }

        public Guid classid { get; set; }
    }
    [Table("GetAllLocations", Schema = "StepAcademy")]
    public partial class GetAllLocationsSSATVM
    {
        [Key]
        public Guid? LocationId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public Boolean? Flag { get; set; }
        public int StatusId { get; set; }
    }
    public class GetAllLocationsStepSSAT
    {
        [Key]
        public Guid? LocationId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public Boolean? Flag { get; set; }
        public int StatusId { get; set; }
    }
    [Table("GetAllCities", Schema = "StepAcademy")]
    public partial class GetAllCitiesSSATVM
    {
        [Key]
        public Guid? CityId { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public Boolean? Flag { get; set; }
        public int StatusId { get; set; }
    }
    [Table("GetAllTest", Schema = "StepAcademy")]
    public partial class GetAllTestSSATVM
    {
        public Guid? LocationId { get; set; }
        [Key]
        public Guid? TestId { get; set; }
        public string FullName { get; set; }
        public string Type { get; set; }
        public Boolean? Flag { get; set; }
        public int? StatusId { get; set; }


    }
    public partial class GetAllTestSSAT
    {
        public Guid? LocationId { get; set; }
        [Key]
        public Guid? TestId { get; set; }
        public string FullName { get; set; }
        public string Type { get; set; }
        public Boolean? Flag { get; set; }
        public int? StatusId { get; set; }
        public string TestDate { get; set; }

    }

    public partial class GetAllSloTimeSSAT
    {


        public Guid? LocationId { get; set; }
        public Guid? TestId { get; set; }
        [Key]
        public Guid? SlotTimeId { get; set; }
        public string FullName { get; set; }
        public string Description { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int? StatusId { get; set; }


    }
    public partial class GetTestDate
    {
        [Key]
        public string TestDate { get; set; }
    }

    public class AcceptanceResponseSTEPAcademy
    {
        [Key]
        public string StudentIds { get; set; }
        public string FullName { get; set; }
        public string RefferenceNo { get; set; }
        public string Test { get; set; }
        public string TestSyllabus { get; set; }
        public string TestDate { get; set; }
        public string ReportingTime { get; set; }
        public string TestTime { get; set; }
        public string Location { get; set; }
        public string Email { get; set; }
    }

    [Table("AdmissionFormCpl4VMWithProgramId", Schema = "Admission")]
    public partial class AdmissionFormCpl4VMWithProgramId
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid ProgramId { get; set; }
        public Guid CampusProgramId { get; set; }
        public Guid StudentId { get; set; }
        public Guid AdmissionTypeId { get; set; }
        public string RollNo { get; set; }
        public string RefferenceNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string AcademicInfo { get; set; }
        public int StatusId { get; set; }
        public Guid LoggerId { get; set; }
        public string FullName { get; set; }
        public string FatherName { get; set; }
        public string StudentCNIC { get; set; }
        public string ParentCNIC { get; set; }

        [Column(TypeName = "jsonb")]
        public string StudentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string ParentContactNo { get; set; }

        [Column(TypeName = "jsonb")]
        public string Guardians { get; set; }
        public Guid GenderId { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string Address { get; set; }
        public Guid BloodGroupId { get; set; }
        public Guid ReligionId { get; set; }
        public Guid CampusId { get; set; }
        public Guid SessionId { get; set; }
        public Guid ProgramDetailId { get; set; }
        public Guid ShiftId { get; set; }

        public string AdmissionStatus { get; set; }
        public string Description { get; set; }

        public string StudentType { get; set; }

        public string FormNo { get; set; }

        public string Operation { get; set; }

        public Boolean? IsApproval { get; set; }

        public int? AnnualPackage { get; set; }

        public string Relationship { get; set; }
        public string CmsRollNo { get; set; }
        public string CmsSection { get; set; }

    }
}