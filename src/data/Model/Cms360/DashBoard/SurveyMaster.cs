using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model{

    [Table("SurveyMaster", Schema = "Dashboard")]

    public class SurveyMaster
    {


        [Key]

        public Guid SurveyMasterId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public int StatusId { get; set; }





    }
}