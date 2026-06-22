
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/
using Dapper;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;

using Newtonsoft.Json;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class FeeFeeStructureController : Controller
    {
        private readonly IFeeFeeStructureRepository repository;
        private readonly IUserLogService log;
        private DbContextBase db;
        List<ProgramJSON> listProgram;
        List<ClassJSON> listClass;
        List<ShiftJSON> listShift;
        List<FeeHeadJSON> listFeehead;
        List<FeesJSON> listFees;
        ZoneJSON zoneJSON;
        FeesJSON feesJSON;
        ProgramJSON programJSON;
        ClassJSON classJSON;
        ShiftJSON shiftJSON;
        FeeHeadJSON feeHeadJSON;
        List<Installment> listInstallment;
        InstallmentHead installment;
        Installment tempInstallment;
        int tempLength;
        public FeeFeeStructureController(IFeeFeeStructureRepository repository, DbContextBase db, IUserLogService log)
        {
            this.repository = repository;
            this.log = log;
            this.db = db;
            zoneJSON = new ZoneJSON();
            feesJSON = new FeesJSON();
            listProgram = new List<ProgramJSON>();
            listClass = new List<ClassJSON>();
            listShift = new List<ShiftJSON>();
            listFeehead = new List<FeeHeadJSON>();
            listFees = new List<FeesJSON>();
            listInstallment = new List<Installment>();
            tempInstallment = new Installment();
            installment = new InstallmentHead();
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.repository.All());
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructure).Assembly);
            Expression<Func<FeeFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));

        }

        [HttpPost]
        [Route("[action]")]
        public int FeeSum([FromBody] Predicate model)
        {

            IDbConnection connection = db.Database.GetDbConnection();
            var zoneId = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionId = new Guid(model.ProvidedString.Split("?")[1]);
            var shiftId = new Guid(model.ProvidedString.Split("?")[2]);
            var classId = new Guid(model.ProvidedString.Split("?")[3]);
            var programId = new Guid(model.ProvidedString.Split("?")[4]);
            string json = String.Format("SELECT \"Fee\".\"FeeSum\"('{0}','{1}','{2}','{3}','{4}')", zoneId, sessionId, shiftId, classId, programId);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            int result = connection.Execute(json);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return result;


        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllVM([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var programid = new Guid(model.ProvidedString.Split("?")[2]);
            return Ok(this.db.FeeStructureVM.Where(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.ProgramId == programid && s.StatusId != 2));
        }



        [HttpPost]
        [Route("[action]")]
        public IActionResult GetBulkVM([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            return Ok(this.db.FeeStructureVM.Where(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVM([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var programid = new Guid(model.ProvidedString.Split("?")[2]);
            var shifftid = new Guid(model.ProvidedString.Split("?")[3]);
            return Ok(this.db.FeeStructureVM.Where(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.ProgramId == programid && s.ShiftId == shifftid && s.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByVMEx([FromBody] Predicate model)
        {
            var zoneid = new Guid(model.ProvidedString.Split("?")[0]);
            var sessionid = new Guid(model.ProvidedString.Split("?")[1]);
            var programid = new Guid(model.ProvidedString.Split("?")[2]);
            var shifftid = new Guid(model.ProvidedString.Split("?")[3]);
            return Ok(this.db.FeeStructureVMEx.Where(s => s.ZoneId == zoneid && s.SessionId == sessionid && s.ProgramId == programid && s.ShiftId == shifftid && s.StatusId != 2));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructure).Assembly);
            Expression<Func<FeeFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructure).Assembly);
            Expression<Func<FeeFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructure).Assembly);
            Expression<Func<FeeFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody]FeeFeeStructure entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.FeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody]FeeFeeStructure entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Fee.FeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody]IEnumerable<FeeFeeStructure> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Fee.FeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody]IEnumerable<FeeFeeStructure> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Fee.FeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody]FeeFeeStructure entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Fee.FeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody]FeeFeeStructure entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Fee.FeeStructure"));
        }



          [HttpPost]
        [Route ("[action]")]
        public IActionResult DeleteFeestructure ([FromBody] Predicate predicate) {
            var obj = new Predicate () { ProvidedString = "" };
            try {
                IDbConnection connection = db.Database.GetDbConnection ();
               
                var feestructureid = new Guid (predicate.ProvidedString.Split ("?") [0]);
                var amount = Convert.ToInt64 (predicate.ProvidedString.Split ("?") [1]);
                var opemode=(predicate.ProvidedString.Split ("?") [2]);
              

                string json = String.Format ("SELECT \"Fee\".\"UpdateFeeStructure\"('{0}',{1},'{2}') as ProvidedString", feestructureid,amount,opemode);
                // Console.WriteLine (json);

                if (connection.State == ConnectionState.Closed)
                    connection.Open ();
                obj.ProvidedString = connection.Query<Predicate> (json).FirstOrDefault ().ProvidedString;

                if (connection.State == ConnectionState.Open) {
                    connection.Close ();
                    connection.Dispose ();
                }

                return Ok (obj.ProvidedString);
            } catch (Exception ex) {
                return BadRequest (ex.Message);
            }

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody]FeeFeeStructure entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Fee.FeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody]FeeFeeStructure entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Fee.FeeStructure"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructure).Assembly);
            Expression<Func<FeeFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody]Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeFeeStructure).Assembly);
            Expression<Func<FeeFeeStructure, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeFeeStructure, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }

        //SEARCH METHOD IMPLEMENTATION
        [HttpPost]
        [Route("[action]")]
        public IActionResult AddBulk([FromBody] Predicate row)
        {
            try
            {
                programJSON = new ProgramJSON();

                listFees = JsonConvert.DeserializeObject<List<FeesJSON>>(row.ProvidedString.Split("?")[0]);
                List<InstallStr> installmentList = JsonConvert.DeserializeObject<List<InstallStr>>(row.ProvidedString.Split("?")[1]);
                Guid ClassIdOld = Guid.Empty;
                Guid Shiftold = Guid.Empty;

                tempLength = 2;

                int i = 0;
                int j = 0;
                foreach (var install in installmentList)
                {
                    j = 0;
                    foreach (var feestr in listFees)
                    {

                        tempInstallment = new Installment();

                        tempInstallment.InstallmentId = Guid.NewGuid();
                        tempInstallment.FeeStructureId = feestr.FeeStructureId;
                        tempInstallment.InstallmentNo = i + 1;
                        tempInstallment.InstallmentAmount = install.Feestr[j].Value;
                        tempInstallment.FeeHeadId = feestr.FeeHeadId;
                        installment.InstallmentList.Add(tempInstallment);
                        j++;
                    }
                    i++;

                }

                string installJson = JsonConvert.SerializeObject(installment);

                foreach (FeesJSON objfees in listFees
                    .OrderBy(e => e.ClassId)
                    .Where(e => !string.IsNullOrEmpty(e.FeeHeadId.ToString()))
                    .ToList())
                {
                    if (objfees.ZoneId.ToString().Length > 0)
                    {
                        zoneJSON.ZoneId = objfees.ZoneId;
                        zoneJSON.SessionId = objfees.SessionId;
                        programJSON.ProgamId = objfees.ProgramId;

                        if (objfees.ClassId.ToString().Length > 0)
                        {

                            if (objfees.ClassId.CompareTo(ClassIdOld) > 0 || objfees.ClassId.CompareTo(ClassIdOld) < 0)
                            {
                                classJSON = new ClassJSON();
                                classJSON.ClassId = objfees.ClassId;

                                shiftJSON = new ShiftJSON();
                                shiftJSON.ShiftId = objfees.ShiftId;
                                feeHeadJSON = new FeeHeadJSON();
                                feeHeadJSON.FeeStructureId = objfees.FeeStructureId;
                                feeHeadJSON.FeeHeadId = objfees.FeeHeadId;
                                feeHeadJSON.FeeAmount = objfees.FeeAmount;

                                feeHeadJSON.Status = objfees.StatusId;

                                shiftJSON.ObjFee.Add(feeHeadJSON);
                                classJSON.ObjShift.Add(shiftJSON);
                                programJSON.ObjClass.Add(classJSON);
                            }
                            else if (objfees.ClassId.CompareTo(ClassIdOld) == 0)
                            {

                                if (objfees.ShiftId.CompareTo(Shiftold) > 0 || objfees.ShiftId.CompareTo(Shiftold) < 0)
                                {
                                    shiftJSON = new ShiftJSON();
                                    shiftJSON.ShiftId = objfees.ShiftId;
                                    feeHeadJSON = new FeeHeadJSON();
                                    feeHeadJSON.FeeStructureId = objfees.FeeStructureId;
                                    feeHeadJSON.FeeHeadId = objfees.FeeHeadId;
                                    feeHeadJSON.FeeAmount = objfees.FeeAmount;

                                    feeHeadJSON.Status = objfees.StatusId;
                                    shiftJSON.ObjFee.Add(feeHeadJSON);

                                }
                                else if (objfees.ShiftId.CompareTo(Shiftold) == 0)
                                {
                                    feeHeadJSON = new FeeHeadJSON();
                                    feeHeadJSON.FeeStructureId = objfees.FeeStructureId;
                                    feeHeadJSON.FeeHeadId = objfees.FeeHeadId;
                                    feeHeadJSON.FeeAmount = objfees.FeeAmount;

                                    feeHeadJSON.Status = objfees.StatusId;
                                    shiftJSON.ObjFee.Add(feeHeadJSON);

                                    shiftJSON.ObjFee.Add(feeHeadJSON);

                                }
                                classJSON.ObjShift.Add(shiftJSON);
                            }
                        }

                    }
                    ClassIdOld = objfees.ClassId;
                    Shiftold = objfees.ShiftId;
                }

                zoneJSON.ObjProgram = programJSON;
                zoneJSON.LoggerId = Guid.NewGuid();

                IDbConnection connection = db.Database.GetDbConnection();

                string json = String.Format("SELECT \"Fee\".\"feestructureBulkInsertion\"('{0}','{1}')", JsonConvert.SerializeObject(zoneJSON), installJson);
                if (connection.State == ConnectionState.Closed)
                    connection.Open();
                connection.Execute(json);
                if (connection.State == ConnectionState.Open)
                {
                    connection.Close();
                    connection.Dispose();
                }

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}