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
    public class AttendenceDashboard
    {
        [Key]
        public Guid PId { get; set; }
        public Guid Id { get; set; }
        public string DisplayName { get; set; }
        public string ClassName { get; set; }
        public int Scheduled { get; set; }
        public int Held { get; set; }
        public int Approved { get; set; }
        public int UnApproved { get; set; }
        public string NextModel { get; set; }
        public decimal Percentage { get; set; }

    }

    public class AttendenceDashboard2
    {
        [Key]
        public Guid PId { get; set; }
        
        public int Scheduled { get; set; }
        public int Held { get; set; }
        public int Approved { get; set; }
        public int UnApproved { get; set; }
        public decimal Percentage { get; set; }

    }

    public class AttendanceDashboard2LastMonths
    {
        [Key]
        public Guid PId { get; set; }
        public int Held { get; set; }
        public int Approved { get; set; }
        public int UnApproved { get; set; }
        public string Dated { get; set; }

    }

     public class AttendanceDashboard2LastMonthsEx
    {
        [Key]
        public Guid PId { get; set; }
        public int Total { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
          public int Leave { get; set; }
                    public double Percentage { get; set; }

        public string Dated { get; set; }

    }

      public class AttendanceDashboard2CityWise
    {
        [Key]
        public Guid PId { get; set; }
       public double Percentage { get; set; }

        public string CityName { get; set; }

    }

    public class ConcessionDashboard
    {
        [Key]
        public Guid PId { get; set; }
        public Guid Id { get; set; }
        public string DisplayName { get; set; }
        public string ClassName { get; set; }
        public int Students { get; set; }
        public int Challan { get; set; }
        public int ActualAmount { get; set; }
        public int PaidAmount { get; set; }
        public int DiscountAmount { get; set; }
        public string NextModel { get; set; }

    }

    public class ConcessionDashboardEx
    {
        [Key]
        public Guid PId { get; set; }
        public Guid Id { get; set; }
        public string DisplayName { get; set; }
        public string ClassName { get; set; }
        public int Students { get; set; }
        public int Challan { get; set; }
        public int ActualAmount { get; set; }
        public int PaidAmount { get; set; }
        public int DiscountAmount { get; set; }
    }
    // PId" uuid, "Exemption" int4, "Id" uuid, "DisplayName" text, "ClassName" text, "Students" int4, "Challan" int4, 
// "ActualAmount" int8, "PaidAmount" int8, "DiscountAmount" int8, "Avg" int8

     public class ConcessionDashboardEx2
    {
        [Key]
        public Guid PId { get; set; }
        public Guid Id { get; set; }
        public string DisplayName { get; set; }
        public string ClassName { get; set; }
        public int? Students { get; set; }
        public int? Challan { get; set; }
        public long? ActualAmount { get; set; }
        public long? PaidAmount { get; set; }

        public int? Exemption { get; set; }
        public long? DiscountAmount { get; set; }
        public long? Avg { get; set; }
    }

    public class RevenueDashboard
    {
        [Key]
        public Guid PId { get; set; }
        public int Students { get; set; }
        public int Revenue { get; set; }
        public int AveragePrStd { get; set; }
        public string City { get; set; }
        public Guid CityId { get; set; }
        public Guid SessionId { get; set; }
        public string ZoneName { get; set; }
    }

    public class StudntListEx
    {
        [Key]
        public Guid AdmissionFormId { get; set; }

        public string RollNo { get; set; }
        public string FullName { get; set; }
        public string Status { get; set; }


    }

}