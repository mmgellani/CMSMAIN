using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Cms360.Data;
using Cms360.Data.Model;
using Microsoft.AspNetCore.Authorization;

namespace Cms360.UI.Controllers.Dashboard
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class ComparisonController : Controller
    {
        private readonly DbContextBase db;

        public ComparisonController(DbContextBase db)
        {
            this.db = db;
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult ParamsDashboard([FromBody] Predicate model)
        {
            try
            {
                var module = model.ProvidedString.Split(":")[0];
                var param = model.ProvidedString.Split(":")[1];
                string campusType = "Franchise CO";
                switch (module)
                {
                    case "session":
                        return Ok(db.General.FromSql("SELECT DISTINCT \"Session\"::TEXT \"FullName\" FROM \"Dashboard\".\"AdmissionComparison\" ORDER BY \"FullName\" DESC"));
                    case "type":
                        return Ok(db.General.FromSql("SELECT DISTINCT \"CampusType\" \"FullName\" FROM \"Dashboard\".\"AdmissionComparison\" WHERE \"CampusType\" != 'Franchise CO' ORDER BY \"FullName\""));
                    case "city":
                        return Ok(db.General.FromSql("SELECT DISTINCT \"City\" \"FullName\" FROM \"Dashboard\".\"AdmissionComparison\" " + param + " ORDER BY \"FullName\""));
                    case "subcity":
                        return Ok(db.General.FromSql("SELECT DISTINCT \"SubCity\" \"FullName\" FROM \"Dashboard\".\"AdmissionComparison\" WHERE \"City\" = '" + param + "' ORDER BY \"FullName\""));
                    case "program":
                        return Ok(db.General.FromSql("SELECT DISTINCT \"Program\" \"FullName\" FROM \"Dashboard\".\"AdmissionComparison\" ORDER BY \"FullName\""));
                    case "result":
                        return Ok(db.ComparisonData.FromSql("SELECT UUID_GENERATE_V4() \"Id\", \"Session\", \"Shift\", SUM(\"TotalAdmission\")::INTEGER \"Total\" FROM \"Dashboard\".\"AdmissionComparison\" " + param + " GROUP BY \"Session\", \"Shift\" ORDER BY \"Session\""));
                    default:
                        return Ok("Please provide proper api option");
                }
            } catch (Exception ex)
            {
                return Ok(ex.Message);
            }            
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AverageDashboard([FromBody] Predicate model)
        {
            return Ok(db.AdmissionAverage.FromSql("SELECT * FROM \"Dashboard\".\"AdmissionAverage\"" + model.ProvidedString ));
        }


        [HttpGet]
        [Route("[action]")]
        public IActionResult AdmissionAverageEx()
        {
            string sql = string.Format(@"select aav.""AdmissionAverageId"", aav.""Average"",aav.""Possession"",aav.""Session"",aav.""TotalCampus"", sum(aac.""TotalAdmission"") as TotalAdmission
from ""Dashboard"".""AdmissionAverage"" aav
join ""Dashboard"".""AdmissionComparison"" aac on aav.""Session""=aac.""Session"" and aav.""Possession""=aac.""CampusType""
GROUP BY aav.""AdmissionAverageId"", aav.""Average"",aav.""Possession"",aav.""Session"",aav.""TotalCampus""
order by  aav.""Possession"",aav.""Session""");

            return Ok(this.db.AdmissionAverageEx.FromSql(sql));

        }
    }
}
