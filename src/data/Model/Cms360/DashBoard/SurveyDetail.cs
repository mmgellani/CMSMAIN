using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Cms360.Data.Model
{

    [Table("SurveyDetail", Schema = "Dashboard")]

    public class SurveyDetail
    {


        [Key]

        public Guid SurveyDetailId { get; set; }
        public string Question { get; set; }
        public string Description { get; set; }
        public string Query { get; set; }
        public string ControlType { get; set; }


        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }

        public int StatusId { get; set; }
        public Guid SurveyMasterId { get; set; }

        public int Order { get; set; }







    }

     public class SurveyDetail2
    {


        [Key]

        public Guid SurveyDetailId { get; set; }
        public string Question { get; set; }
        public string Description { get; set; }
        public string Query { get; set; }
        public string ControlType { get; set; }


        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }

        public int StatusId { get; set; }

        public int Order {get;set;}
       







    }
    public class SurveyDetailVM
    {


       


        public Guid SurveyMasterId { get; set; }
           [Key]
        public Guid SurveyDetailId { get; set; }
        public string Question { get; set; }
        public string Description { get; set; }
        public string Query { get; set; }
        public string ControlType { get; set; }


        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }

        public string SurveyMaster { get; set; }

        public string SurveyDescription { get; set; }
        public string PopupDescription { get; set; }




        public int StatusId { get; set; }

        public int Order {get;set;}





    }
[Table("VWSurveyDetailActive", Schema = "Dashboard")]
     public class SurveyDetailActiveVM
    {


        [Key]
        public Guid SurveyDetailId { get; set; }


        public Guid SurveyMasterId { get; set; }

        public string Question { get; set; }
        public string SurveyDetailDescription { get; set; }
        public string Query { get; set; }
        public string ControlType { get; set; }


        [Column(TypeName = "jsonb")]
        public string Operation { get; set; }

        public string SurveyName { get; set; }

        public string SurveyDescription { get; set; }

    }

    public class SurveyReturnObj{
        public SurveyDetailActiveVM2 SurveyDetailActiveVM { get; set; }
        public List<Options> Options { get; set; }
        public SurveyReturnObj(){
            Options= new List<Options>();
            SurveyDetailActiveVM=new SurveyDetailActiveVM2();
        }
    }
 public class SurveyDetailActiveVM2
    {


        [Key]
        public Guid SurveyDetailId { get; set; }


        public Guid SurveyMasterId { get; set; }

        public string Question { get; set; }
        public string SurveyDetailDescription { get; set; }
        public string Query { get; set; }
        public string ControlType { get; set; }


        

        public string SurveyName { get; set; }

        public string SurveyDescription { get; set; }

    }
    public class Options
    {
        public int Order { get; set; }
        public string Option { get; set; }
    }
}