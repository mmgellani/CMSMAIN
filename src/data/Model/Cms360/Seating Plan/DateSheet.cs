using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cms360.Data.Model

{
    [Table ("DateSheet", Schema = "ExamSeatingPlan")]

    public class SeatingPlanDateSheet {
        [Key]
        public Guid DateSheetId { get; set; }

        public Guid CampusProgramId { get; set; }

        public string ExamName { get; set; }

        public Guid RoomBuildingLinkId { get; set; }

        public int StatusId { get; set; }

    }

    public class SeatingPlanDateSheetVM {

        [Key]
        public Guid DateSheetId { get; set; }

        public Guid CampusProgramId { get; set; }

        public string ExamName { get; set; }

        public string CampusName { get; set; }

        public string Description { get; set; }

        public string BuildingName { get; set; }

        public string RoomName { get; set; }

        public Guid RoomBuildingLinkId { get; set; }

        public int StatusId { get; set; }

        public Guid CampusId { get; set; }

        public Guid SessionId { get; set; }


        public Guid ProgramDetailId  {get;set;}

    }

}