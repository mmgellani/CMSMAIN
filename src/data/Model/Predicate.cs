using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Cms360.Data.Model
{
    public class Predicate
    {
        [Key]
        public string ProvidedString { get; set; }

    }
    public class PredicateVlau
    {
        public string Board { get; set; }
        public string ClassId { get; set; }
        public string Organization { get; set; }
        public string ContentType { get; set; }
        public bool IsPastPaper { get; set; }
        public Guid UserId { get; set; }
        public string SubjectName { get; set; }

    }

    public class PredicateVlauEXX
    {
        public string Board { get; set; }
        public string ClassId { get; set; }
        public string Organization { get; set; }
        public string ContentType { get; set; }
        public bool IsPastPaper { get; set; }
        public Guid UserId { get; set; }
        public string SubjectName { get; set; }
        public string Module { get; set; }
        public string UserEmail { get; set; }
        public string OrganizationCode { get; set; }

        public string Device { get; set; }



    }

    public class PredicateVlauVideo
    {
        public string Board { get; set; }
        public string ClassId { get; set; }
        public string Organization { get; set; }
        public string ContentType { get; set; }
        public bool IsPastPaper { get; set; }
        public Guid UserId { get; set; }
        public string IsArvo { get; set; }
        public string ChapterId { get; set; }
        public string TopicId { get; set; }


    }
    public class PredicateVlauVideoEXX
    {
        public string Board { get; set; }
        public string ClassId { get; set; }
        public string Organization { get; set; }
        public string ContentType { get; set; }
        public bool IsPastPaper { get; set; }
        public Guid UserId { get; set; }
        public string IsArvo { get; set; }
        public string ChapterId { get; set; }
        public string TopicId { get; set; }
        public string UserEmail { get; set; }
        public string Module { get; set; }
        public string OrganizationCode { get; set; }
        public string Device { get; set; }




    }
    public class PredicateVal
    {
        [Key]
        public string Val { get; set; }

    }
    public class PredicateValEXX
    {
        [Key]
        public string Val { get; set; }
        public string userEmail { get; set; }
        public string module { get; set; }
        public string organizationCode { get; set; }

        public string device { get; set; }


    }

    public class ChapterAndTopicsReq
    {
        public string programCamboKey { get; set; }

        public string subjectName { get; set; }

    }
    public class SurveyParam
    {
        [Key]
        public Guid AdmissionFormId { get; set; }
        public Guid SurveyMasterId { get; set; }
        public string List { get; set; }
    }

    public class StrObj
    {
        public string text { get; set; }
    }

    public class BulkData
    {
        public string[] param { get; set; }


    }



    public class IntModel
    {
        [Key]
        public int val { get; set; }
    }

    public class StudentFeeExist
    {
        [Key]
        public Guid CheckFeeStructure { get; set; }
    }
    public class GetUserId
    {
        [Key]
        public Int64 UserId { get; set; }
    }

    public class FeeBulkModel
    {
        public List<FeeSubinstallmentVM> FeeSubinstallmentVM { get; set; }
        public List<FeeStudentChallan> FeeStudentChallan { get; set; }

        public FeeBulkModel()
        {
            FeeSubinstallmentVM = new List<FeeSubinstallmentVM>();
            FeeStudentChallan = new List<FeeStudentChallan>();
        }
    }
    public class FeeBulkModels
    {
        public List<FeeSubinstallmentVM> FeeSubinstallmentVM { get; set; }
        public List<FeeStudentChallans> FeeStudentChallans { get; set; }

        public FeeBulkModels()
        {
            FeeSubinstallmentVM = new List<FeeSubinstallmentVM>();
            FeeStudentChallans = new List<FeeStudentChallans>();
        }
    }
    public class FeeBulkModelss
    {
        public List<FeeSubinstallmentVMs> FeeSubinstallmentVMs { get; set; }
        public List<FeeStudentChallans> FeeStudentChallans { get; set; }

        public FeeBulkModelss()
        {
            FeeSubinstallmentVMs = new List<FeeSubinstallmentVMs>();
            FeeStudentChallans = new List<FeeStudentChallans>();
        }
    }
    public class chakinstallment
    {



        [Key]

        public Guid AdmissionFormId { get; set; }

        public Guid ClassId { get; set; }

        public string OperationType { get; set; }

    }

    public class ModelConfigModel
    {
        public string Organization { get; set; }
        public string UserEmail { get; set; }
        public string Module { get; set; }
        public string Device { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public bool IsPortrait { get; set; }
        public bool IsRotation { get; set; }
        public bool IsSpeedControl { get; set; }
        public bool IsZoom { get; set; }
        public string SkyboxUrl { get; set; }
        public string Url { get; set; }
    }

    public class EDModel
    {
        public string Organization { get; set; }
        public string UserEmail { get; set; }
        public string Module { get; set; }
        public string Device { get; set; }
        public string ModelId { get; set; }
    }

}
