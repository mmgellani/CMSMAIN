
/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

using Microsoft.AspNetCore.Authorization;

using System.Linq.Expressions;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.CodeAnalysis.CSharp.Scripting;

using Cms360.Server;
using Cms360.Service;
using Cms360.Data.Model;
using Cms360.Server.Model;
using Cms360.Data;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Dapper;

using Newtonsoft.Json;

namespace Cms360.UI.Controllers.Account
{
    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class FeeChallanValidityController : Controller
    {
        private readonly IFeeChallanValidityRepository repository;
        private readonly IFeeChallanValidityVMRepository VMrepository;
        private readonly IUserLogService log;
        private readonly DbContextBase db;
        public FeeChallanValidityController(IFeeChallanValidityRepository repository, IFeeChallanValidityVMRepository VMrepository, IUserLogService log, DbContextBase db)
        {
            this.repository = repository;
            this.VMrepository = VMrepository;
            this.log = log;
            this.db = db;
        }

        private static Expression<Func<T, bool>> FuncToExpression<T>(Func<T, bool> f)
        {
            return x => f(x);
        }

        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAll()
        {
            return Ok(this.VMrepository.FindBy(e => e.StatusId != 2));
        }

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await this.repository.AllAsync());
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeChallanValidity).Assembly);
            Expression<Func<FeeChallanValidity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeChallanValidity, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeChallanValidity).Assembly);
            Expression<Func<FeeChallanValidity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeChallanValidity, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(CampusChallanValidityVM).Assembly);
            Expression<Func<CampusChallanValidityVM, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<CampusChallanValidityVM, bool>>(predicate.ProvidedString, options));

            return Ok(this.VMrepository.FindBy(discountFilterExpression));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByEx([FromBody] Predicate predicate)
        {
            try
            {
                var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
                var programdetailid = new Guid(predicate.ProvidedString.Split("?")[2]);
                var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
                // var sectionCourseLinkId = new Guid(predicate.ProvidedString.Split("?")[4]);
                var installmentNo = Convert.ToInt32(predicate.ProvidedString.Split("?")[4]);
                var where = predicate.ProvidedString.Split("?")[5];
                string sql = String.Format(@"SELECT * FROM ""Fee"".""ChallanValidityUpdateEx""('{0}','{1}','{2}','{3}',{4},'{5}') ", sessionid, campusid, programdetailid, classid, installmentNo, where);
                return Ok(db.ChallanValidityUpdatemodel.FromSql(sql));
                //return Ok(this.db.ChallanValidityUpdatemodel.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programdetailid && s.ClassId == classid && s.SectionCourseLinkId == sectionCourseLinkId && s.InstallmentNo == installmentNo && s.StatusId != 2));
                Console.WriteLine(sql);
            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE EXEMPTION Controller.BoardBoardCampus()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetFindByEx2([FromBody] Predicate predicate)
        {
            try
            {
                var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
                var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
                var programdetailid = new Guid(predicate.ProvidedString.Split("?")[2]);
                var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
                var genderid = new Guid(predicate.ProvidedString.Split("?")[4]);


                var installmentNo = Convert.ToInt16(predicate.ProvidedString.Split("?")[5]);
                string sql = String.Format(@"SELECT * FROM ""Fee"".""ChallanValidityUpdateExx""('{0}','{1}','{2}','{3}','{4}',{5}) ", sessionid, campusid, programdetailid, classid, genderid, installmentNo);
                return Ok(db.ChallanValidityUpdateEx.FromSql(sql));
                //return Ok(this.db.ChallanValidityUpdateEx.Where(s => s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programdetailid && s.ClassId == classid && s.InstallmentNo == installmentNo && s.StatusId == 1 && s.GenderId == genderid));

            }
            catch (Exception ex)
            {
                AppException app = new AppException();
                app.Message = "ERROR IN FEE EXEMPTION Controller.BoardBoardCampus()" + ex.Message;
                app.Time = DateTime.Now;
                app.Data = predicate.ProvidedString;
                this.db.Add(app.Message);
                this.db.SaveChanges();
                return BadRequest(app.Message);

            }
        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult GetStudentList([FromBody] Predicate predicate)
        {


            var sectionCourseLinkId = new Guid(predicate.ProvidedString);


            return Ok(this.db.StudentUserGenEx.Where(s => s.SectionCourseLinkId == sectionCourseLinkId));


        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult get_challan_report([FromBody] Predicate predicate)
        {
            var sectionCourseLinkId = Guid.Parse("00000000-0000-0000-0000-000000000000");
            var campusid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var programdetailid = new Guid(predicate.ProvidedString.Split("?")[1]);
            if (predicate.ProvidedString.Split("?")[2] != "")
                sectionCourseLinkId = new Guid(predicate.ProvidedString.Split("?")[2]);
            else
                sectionCourseLinkId = Guid.Parse("00000000-0000-0000-0000-000000000000");
            var installmentNo = Convert.ToInt16(predicate.ProvidedString.Split("?")[3]);
            var username = (predicate.ProvidedString.Split("?")[4]);
            var campusidprogramid = new Guid(predicate.ProvidedString.Split("?")[5]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[6]);
            var challannumbers = new String(predicate.ProvidedString.Split("?")[7]);
            string sql = "";

            if (sectionCourseLinkId != null && sectionCourseLinkId != Guid.Parse("00000000-0000-0000-0000-000000000000"))
            {
                // sql = String.Format(@"SELECT * FROM ""Fee"".""BChallanR""('{0}','{1}')", sectionCourseLinkId, installmentNo);
                sql = String.Format(@"SELECT * FROM ""Fee"".""BChallanRWithCampusss""('{0}')", challannumbers);
                Console.WriteLine(sql);
            }
            else
            {
                //sql = String.Format(@"SELECT * FROM ""Fee"".""BChallanRWithCampus""('{0}','{1}','{2}','{3}','{4}')", campusid,programdetailid, installmentNo,campusidprogramid,classid);
                sql = String.Format(@"SELECT * FROM ""Fee"".""BChallanRWithCampusss""('{0}')", challannumbers);


                Console.WriteLine(sql);
            }
            var result = db.ChallanList.FromSql(sql).ToList();
            // var bankresult = this.db.CampusBank.Where(e => e.StatusId == 1 && e.CampusId == campusid && e.ProgramDetailId == programdetailid);
            var challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == campusid && e.InstallmentNo == installmentNo && e.FullName.ToLower().StartsWith("edu"));
            //var bankNote = this.db.BankIbanVM.Where(e => e.CampusId == campusid).ToList();
            var challanReport = new List<ChallanBReportExLatest>();
            var generalList = new GeneralListExLatest();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReportExLatest();
            var infod = new InfoList();
            var bank = new BankDataList();
            string strRes = "<br/> Note: <br/> ";
            foreach (var cNote in challanNote)
            {
                cNote.Description = String.Concat("<li>", cNote.Description);
                cNote.Description = String.Concat(cNote.Description, "</li>");
                strRes = String.Concat(strRes, cNote.Description);
            }

            if (result.Count > 0)
            {
                foreach (var item in result)
                {
                    StudentFeeExist z = new StudentFeeExist() { CheckFeeStructure = Guid.NewGuid() };

                    var sqlque = String.Format(@"select ""ClassId"" as ""CheckFeeStructure"" from ""Fee"".""StudentChallan"" where ""ChallanNo""='{0}'", item.ChallanNo);
                    // Console.WriteLine(sqlque);

                    z.CheckFeeStructure = this.db.StudentFeeExist.FromSql(sqlque).FirstOrDefault().CheckFeeStructure;

                    var bankNote = this.db.ClassNote.Where(e => e.ClassId == z.CheckFeeStructure).ToList();

                    string strRr = "<strong> ";
                    model = new ChallanBReportExLatest();
                    string ql = String.Format(@"Select * from ""Fee"".""ChallanReportLatest""('{0}')", item.ChallanNo);
                    var data = this.db.StudentChallanReportFuLatest.FromSql(ql).ToList();
                    model.ChallanNo = data[0].ChallanNo;
                    generalList = new GeneralListExLatest();
                    generalList.BusinessUnit = data[0].BusinessUnit;
                    generalList.CampusName = data[0].CampusName;
                    generalList.Prefix = data[0].Prefix;
                    generalList.MobileApp = data[0].MobileApp;
                    generalList.MobileApp1 = data[0].MobileApp1;
                    generalList.MobileApp2 = data[0].MobileApp2;
                    generalList.MobileApp3 = data[0].MobileApp3;
                    generalList.MobileApp4 = data[0].MobileApp4;
                    generalList.MobileApp5 = data[0].MobileApp5;
                    generalList.Cap = data[0].Cap;
                    generalList.ChallanAmount = data[0].ChallanAmount;
                    generalList.ChallanNo = data[0].ChallanNo;
                    generalList.CustomerCode = data[0].CustomerCode;
                    generalList.Description = data[0].Description;
                    generalList.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
                    generalList.DueDate = data[0].DueDate;
                    generalList.FatherName = data[0].FatherName;
                    generalList.FullName = data[0].FullName;
                    generalList.InstallmentNo = data[0].InstallmentNo;
                    generalList.ObtainMarks = data[0].ObtainMarks;
                    generalList.TotalMarks = data[0].TotalMarks;
                    generalList.RefferenceNo = data[0].RefferenceNo;
                    generalList.SectionName = data[0].SectionName;
                    generalList.UserName = username;

                    strRr = String.Concat(strRr, data[0].ZoneNote);
                    strRr = String.Concat(strRr, "</strong>");
                    strRr = String.Concat(strRr, strRes);
                    generalList.ChallanNote = strRr;
                    if (bankNote.Count > 0)
                    {
                        generalList.BankIban = bankNote[0].ChallanNote;
                    }
                    else
                    {
                        generalList.BankIban = "";
                    }
                    model.General = generalList;
                    string sqlex = String.Format(@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", data[0].CampusId, data[0].ProgramDetailId, data[0].AdmissionFormId);
                    // Console.WriteLine(sqlex);
                    var bankresult = this.db.CampusBank.FromSql(sqlex);
                    foreach (var itemdata in data)
                    {
                        infod = new InfoList();
                        infod.ChallanNo = itemdata.ChallanNo;
                        infod.ConcessionName = itemdata.ConcessionName;
                        infod.FeeAmount = itemdata.FeeAmount;
                        infod.FeeHead = itemdata.FeeHead;
                        infod.PayableAmount = itemdata.PayableAmount;
                        infoList.Add(infod);
                    }

                    model.ChallanInfo.AddRange(infoList);
                    infoList = new List<InfoList>();

                    foreach (var bankdata in bankresult)
                    {
                        bank = new BankDataList();
                        bank.ChallanNo = data[0].ChallanNo;
                        bank.BankName = bankdata.BankName;
                        bank.Address = bankdata.Address;
                        bank.AccountNo = bankdata.AccountNo;
                        bankList.Add(bank);

                    }

                    model.Banks.AddRange(bankList);
                    bankList = new List<BankDataList>();

                    var challan = this.db.FeeStudentChallan.Where(s => s.StatusId == 1 && s.AdmissionFormId == data[0].AdmissionFormId && s.InstallmentNo == installmentNo && s.PaidDate == null && s.ChallanTypeId == item.ChallanTypeId && s.ClassId == z.CheckFeeStructure).ToList();
                    if (challan.Count > 1)
                    {
                        foreach (var subchallan in challan)
                        {
                            if (subchallan.ChallanNo != data[0].ChallanNo)

                            {
                                subinst = new SubInstList();
                                subinst.ChallanNo = data[0].ChallanNo;
                                subinst.ChallanNoEx = subchallan.ChallanNo;
                                subinst.DueDate = subchallan.DueDate;
                                subinst.FeeAmount = subchallan.FeeAmount;
                                NextInstallment.Add(subinst);
                            }
                        }
                    }
                    else
                    {
                        subinst = new SubInstList();
                        subinst.ChallanNo = data[0].ChallanNo;
                        subinst.ChallanNoEx = "";
                        subinst.DueDate = null;
                        subinst.FeeAmount = 0;
                        NextInstallment.Add(subinst);
                    }

                    model.NextInstallment.AddRange(NextInstallment);
                    NextInstallment = new List<SubInstList>();
                    challanReport.Add(model);

                }


            }
            return Ok(challanReport);

        }

        [HttpPost]
        [Route("[action]")]

        public IActionResult get_challan_reportBulk([FromBody] Predicate predicate)
        {
            var session = new Guid(predicate.ProvidedString.Split("?")[0]);
            var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var programidId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var classid = new Guid(predicate.ProvidedString.Split("?")[3]);
            var genderid = new Guid(predicate.ProvidedString.Split("?")[4]);

            var installmentNo = Convert.ToInt16(predicate.ProvidedString.Split("?")[5]);
            var username = (predicate.ProvidedString.Split("?")[6]);
            var result = JsonConvert.DeserializeObject<List<StudentChallanprint>>(predicate.ProvidedString.Split("?")[7]);

            // string sql = String.Format(@"SELECT * FROM ""Fee"".""BChallanREx""('{0}','{1}','{2}','{3}',{4},'{5}')", session,campusid,programidId,classid,installmentNo,genderid);
            // var result = db.ChallanList.FromSql(sql).ToList();
            // var bankresult = this.db.CampusBank.Where(e => e.StatusId == 1 && e.CampusId == campusid && e.ProgramDetailId == programdetailid);
            var challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == campusid && e.InstallmentNo == installmentNo && e.FullName.ToLower().StartsWith("edu"));
            //var bankNote = this.db.BankIbanVM.Where(e => e.CampusId == campusid).ToList();
            var challanReport = new List<ChallanBReportExLatest>();
            var generalListLatest = new GeneralListExLatest();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReportExLatest();
            var infod = new InfoList();
            var bank = new BankDataList();
            string strRes = "<br/> Note: <br/> ";
            foreach (var cNote in challanNote)
            {
                cNote.Description = String.Concat("<li>", cNote.Description);
                cNote.Description = String.Concat(cNote.Description, "</li>");
                strRes = String.Concat(strRes, cNote.Description);
            }

            if (result.Count > 0)
            {
                foreach (var item in result)
                {
                    StudentFeeExist z = new StudentFeeExist() { CheckFeeStructure = Guid.NewGuid() };

                    var sqlque = String.Format(@"select ""ClassId"" as ""CheckFeeStructure"" from ""Fee"".""StudentChallan"" where ""ChallanNo""='{0}'", item.ChallanNo);
                    // Console.WriteLine(sqlque);

                    z.CheckFeeStructure = this.db.StudentFeeExist.FromSql(sqlque).FirstOrDefault().CheckFeeStructure;

                    var bankNote = this.db.ClassNote.Where(e => e.ClassId == z.CheckFeeStructure).ToList();



                    string strRr = "<strong> ";
                    model = new ChallanBReportExLatest();
                    string ql = String.Format(@"Select * from ""Fee"".""ChallanReportLatest""('{0}')", item.ChallanNo);
                    var data = this.db.StudentChallanReportFuLatest.FromSql(ql).ToList();
                    model.ChallanNo = data[0].ChallanNo;
                    generalListLatest = new GeneralListExLatest();
                    generalListLatest.BusinessUnit = data[0].BusinessUnit;
                    generalListLatest.Prefix = data[0].Prefix;
                    generalListLatest.MobileApp = data[0].MobileApp;
                    generalListLatest.MobileApp1 = data[0].MobileApp1;
                    generalListLatest.MobileApp2 = data[0].MobileApp2;
                    generalListLatest.MobileApp3 = data[0].MobileApp3;
                    generalListLatest.MobileApp4 = data[0].MobileApp4;
                    generalListLatest.MobileApp5 = data[0].MobileApp5;
                    generalListLatest.CampusName = data[0].CampusName;
                    generalListLatest.Cap = data[0].Cap;
                    generalListLatest.ChallanAmount = data[0].ChallanAmount;
                    generalListLatest.ChallanNo = data[0].ChallanNo;
                    generalListLatest.CustomerCode = data[0].CustomerCode;
                    generalListLatest.Description = data[0].Description;
                    generalListLatest.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
                    generalListLatest.DueDate = data[0].DueDate;
                    generalListLatest.FatherName = data[0].FatherName;
                    generalListLatest.FullName = data[0].FullName;
                    generalListLatest.InstallmentNo = data[0].InstallmentNo;
                    generalListLatest.ObtainMarks = data[0].ObtainMarks;
                    generalListLatest.TotalMarks = data[0].TotalMarks;
                    generalListLatest.RefferenceNo = data[0].RefferenceNo;
                    generalListLatest.SectionName = data[0].SectionName;
                    generalListLatest.UserName = username;

                    strRr = String.Concat(strRr, data[0].ZoneNote);
                    strRr = String.Concat(strRr, "</strong>");
                    strRr = String.Concat(strRr, strRes);
                    generalListLatest.ChallanNote = strRr;
                    if (bankNote.Count > 0)
                    {
                        generalListLatest.BankIban = bankNote[0].ChallanNote;
                    }
                    else
                    {
                        generalListLatest.BankIban = "";
                    }
                    model.General = generalListLatest;
                    string sqlex = String.Format(@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", data[0].CampusId, data[0].ProgramDetailId, data[0].AdmissionFormId);
                    // Console.WriteLine(sqlex);
                    var bankresult = this.db.CampusBank.FromSql(sqlex);
                    foreach (var itemdata in data)
                    {
                        infod = new InfoList();
                        infod.ChallanNo = itemdata.ChallanNo;
                        infod.ConcessionName = itemdata.ConcessionName;
                        infod.FeeAmount = itemdata.FeeAmount;
                        infod.FeeHead = itemdata.FeeHead;
                        infod.PayableAmount = itemdata.PayableAmount;
                        infoList.Add(infod);
                    }

                    model.ChallanInfo.AddRange(infoList);
                    infoList = new List<InfoList>();

                    foreach (var bankdata in bankresult)
                    {
                        bank = new BankDataList();
                        bank.ChallanNo = data[0].ChallanNo;
                        bank.BankName = bankdata.BankName;
                        bank.Address = bankdata.Address;
                        bank.AccountNo = bankdata.AccountNo;
                        bankList.Add(bank);

                    }

                    model.Banks.AddRange(bankList);
                    bankList = new List<BankDataList>();

                    var challan = this.db.FeeStudentChallan.Where(s => s.StatusId == 1 && s.AdmissionFormId == data[0].AdmissionFormId && s.InstallmentNo == installmentNo && s.PaidDate == null && s.ChallanTypeId == item.ChallanTypeId && s.ClassId == z.CheckFeeStructure).ToList();
                    if (challan.Count > 1)
                    {
                        foreach (var subchallan in challan)
                        {
                            if (subchallan.ChallanNo != data[0].ChallanNo)

                            {
                                subinst = new SubInstList();
                                subinst.ChallanNo = data[0].ChallanNo;
                                subinst.ChallanNoEx = subchallan.ChallanNo;
                                subinst.DueDate = subchallan.DueDate;
                                subinst.FeeAmount = subchallan.FeeAmount;
                                NextInstallment.Add(subinst);
                            }
                        }
                    }
                    else
                    {
                        subinst = new SubInstList();
                        subinst.ChallanNo = data[0].ChallanNo;
                        subinst.ChallanNoEx = "";
                        subinst.DueDate = null;
                        subinst.FeeAmount = 0;
                        NextInstallment.Add(subinst);
                    }

                    model.NextInstallment.AddRange(NextInstallment);
                    NextInstallment = new List<SubInstList>();
                    challanReport.Add(model);

                }


            }
            return Ok(challanReport);

        }


        [HttpPost]
        [Route("[action]")]
        public IActionResult get_challan_reportEx([FromBody] Predicate predicate)
        {
            var campusid = new Guid(predicate.ProvidedString.Split("?")[0]);
            var programdetailid = new Guid(predicate.ProvidedString.Split("?")[1]);
            var sectionCourseLinkId = new Guid(predicate.ProvidedString.Split("?")[2]);
            var list = (predicate.ProvidedString.Split("?")[3]);
            var username = (predicate.ProvidedString.Split("?")[4]);
            var challanTypeId = new Guid(predicate.ProvidedString.Split("?")[5]);
            var feeHeadId = new Guid(predicate.ProvidedString.Split("?")[6]);

            IDbConnection connection = db.Database.GetDbConnection();

            string sql = String.Format(@"SELECT * FROM ""Fee"".""BChallanO""('{0}','{1}','{2}')", list, challanTypeId, feeHeadId);
            // Console.WriteLine(sql);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            var result = connection.Query<ChallanListEx>(sql).ToList();




            // string sql = String.Format(@"SELECT * FROM ""Fee"".""BChallanO""('{0}','{1}')", list, challanTypeId);
            // // Console.WriteLine(sql);
            // var result = db.ChallanListEx.FromSql(sql).ToList();
            // var bankresult = this.db.CampusBank.Where(e => e.StatusId == 1 && e.CampusId == campusid && e.ProgramDetailId == programdetailid);
            var challanNote = this.db.FeeCampusChallanNoteLinkVM.Where(e => e.StatusId == 1 && e.CampusId == campusid && e.ChallanTypeId == challanTypeId).ToList();
            var challanReport = new List<ChallanBReportExLatest>();
            var generalList = new GeneralListExLatest();
            var bankList = new List<BankDataList>();
            var infoList = new List<InfoList>();
            var NextInstallment = new List<SubInstList>();

            var subinst = new SubInstList();

            var model = new ChallanBReportExLatest();
            var infod = new InfoList();
            var bank = new BankDataList();
            string strRes = "<br/> Note: <br/> ";
            if (challanNote.Count > 0)
            {
                foreach (var cNote in challanNote)
                {
                    cNote.Description = String.Concat("<li>", cNote.Description);
                    cNote.Description = String.Concat(cNote.Description, "</li>");
                    strRes = String.Concat(strRes, cNote.Description);
                }
            }

            if (result.Count > 0)
            {
                foreach (var item in result)
                {

                    string strRr = "<strong> ";
                    model = new ChallanBReportExLatest();
                    string ql = String.Format(@"Select * from ""Fee"".""ChallanReportLatest""('{0}')", item.ChallanNo);
                    var data = this.db.StudentChallanReportFuLatest.FromSql(ql).ToList();
                    model.ChallanNo = data[0].ChallanNo;
                    generalList = new GeneralListExLatest();
                    generalList.BusinessUnit = data[0].BusinessUnit;
                    generalList.CampusName = data[0].CampusName;

                    generalList.BusinessUnit = data[0].BusinessUnit;
                    generalList.Prefix = data[0].Prefix;
                    generalList.MobileApp = data[0].MobileApp;
                    generalList.MobileApp1 = data[0].MobileApp1;
                    generalList.MobileApp2 = data[0].MobileApp2;
                    generalList.MobileApp3 = data[0].MobileApp3;
                    generalList.MobileApp4 = data[0].MobileApp4;
                    generalList.MobileApp5 = data[0].MobileApp5;
                    generalList.Cap = data[0].Cap;
                    generalList.ChallanAmount = data[0].ChallanAmount;
                    generalList.ChallanNo = data[0].ChallanNo;
                    generalList.CustomerCode = data[0].CustomerCode;
                    generalList.Description = data[0].Description;
                    generalList.DocNo = data[0].ChallanNo.Substring(data[0].ChallanNo.Length - 7, data[0].ChallanNo.Length - (data[0].ChallanNo.Length - 7));
                    generalList.DueDate = data[0].DueDate;
                    generalList.FatherName = data[0].FatherName;
                    generalList.FullName = data[0].FullName;
                    generalList.InstallmentNo = data[0].InstallmentNo;
                    generalList.ObtainMarks = data[0].ObtainMarks;
                    generalList.TotalMarks = data[0].TotalMarks;
                    generalList.RefferenceNo = data[0].RefferenceNo;
                    generalList.SectionName = data[0].SectionName;
                    generalList.UserName = username;

                    strRr = String.Concat(strRr, data[0].ZoneNote);
                    strRr = String.Concat(strRr, "</strong>");
                    strRr = String.Concat(strRr, strRes);
                    generalList.ChallanNote = strRr;
                    model.General = generalList;
                    string sqlex = String.Format(@"Select * from ""Fee"".""GetBankEx""('{0}','{1}','{2}')", data[0].CampusId, data[0].ProgramDetailId, data[0].AdmissionFormId);
                    // Console.WriteLine(sqlex);
                    var bankresult = this.db.CampusBank.FromSql(sqlex);
                    foreach (var itemdata in data)
                    {
                        infod = new InfoList();
                        infod.ChallanNo = itemdata.ChallanNo;
                        infod.ConcessionName = itemdata.ConcessionName;
                        infod.FeeAmount = itemdata.FeeAmount;
                        infod.FeeHead = itemdata.FeeHead;
                        infod.PayableAmount = itemdata.PayableAmount;
                        infoList.Add(infod);
                    }

                    model.ChallanInfo.AddRange(infoList);
                    infoList = new List<InfoList>();

                    foreach (var bankdata in bankresult)
                    {
                        bank = new BankDataList();
                        bank.ChallanNo = data[0].ChallanNo;
                        bank.BankName = bankdata.BankName;
                        bank.Address = bankdata.Address;
                        bank.AccountNo = bankdata.AccountNo;
                        bankList.Add(bank);

                    }

                    model.Banks.AddRange(bankList);
                    bankList = new List<BankDataList>();

                    // var challan = this.db.FeeStudentChallan.Where(s => s.StatusId == 1 && s.AdmissionFormId == data[0].AdmissionFormId && s.InstallmentNo == installmentNo && s.PaidDate == null && s.ChallanTypeId == item.ChallanTypeId).ToList();
                    // if (challan.Count > 1)
                    // {
                    //     foreach (var subchallan in challan)
                    //     {
                    //         if (subchallan.ChallanNo != data[0].ChallanNo)

                    //         {
                    //             subinst = new SubInstList();
                    //             subinst.ChallanNo = data[0].ChallanNo;
                    //             subinst.ChallanNoEx = subchallan.ChallanNo;
                    //             subinst.DueDate = subchallan.DueDate;
                    //             subinst.FeeAmount = subchallan.FeeAmount;
                    //             NextInstallment.Add(subinst);
                    //         }
                    //     }
                    // }
                    // else
                    // {
                    subinst = new SubInstList();
                    subinst.ChallanNo = data[0].ChallanNo;
                    subinst.ChallanNoEx = "";
                    subinst.DueDate = null;
                    subinst.FeeAmount = 0;
                    NextInstallment.Add(subinst);
                    // }

                    model.NextInstallment.AddRange(NextInstallment);
                    NextInstallment = new List<SubInstList>();
                    challanReport.Add(model);

                }


            }
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }
            return Ok(challanReport);

        }





        // [HttpPost]
        // [Route("[action]")]
        // public async Task<IActionResult> GetFindBy2([FromBody]Predicate predicate)
        // {



        //     var sessionid = new Guid(predicate.ProvidedString.Split("?")[0]);
        //     var campusid = new Guid(predicate.ProvidedString.Split("?")[1]);
        //     var programdetailid = new Guid(predicate.ProvidedString.Split("?")[2]);
        //     var classId = new Guid(predicate.ProvidedString.Split("?")[3]);

        //     return Ok(this.db.CampusChallanValidityVM.Where(s=> s.SessionId == sessionid && s.CampusId == campusid && s.ProgramDetailId == programdetailid && s.ClassId == classId && s.StatusId !=2));
        // }


        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeChallanValidity).Assembly);
            Expression<Func<FeeChallanValidity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeChallanValidity, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] FeeChallanValidity entity)
        {
            this.repository.Add(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert", "Fee.ChallanValidity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] FeeChallanValidity entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async", "Fee.ChallanValidity"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<FeeChallanValidity> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi", "Fee.ChallanValidity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<FeeChallanValidity> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async", "Fee.ChallanValidity"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] FeeChallanValidity entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update", "Fee.ChallanValidity"));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult UpdateBulk([FromBody] Predicate predicate)
        {
            var tempList = Convert.ToString(predicate.ProvidedString.Split("?")[0]);
            var campusId = Convert.ToString(predicate.ProvidedString.Split("?")[1]);
            var installmentNo = Convert.ToInt16(predicate.ProvidedString.Split("?")[2]);
            var programDetailId = Convert.ToString(predicate.ProvidedString.Split("?")[3]);
            var classid = Convert.ToString(predicate.ProvidedString.Split("?")[4]);
            var sessionid = Convert.ToString(predicate.ProvidedString.Split("?")[5]);

            IDbConnection connection = db.Database.GetDbConnection();
            var Data = this.log.GetLog();
            string query = String.Format(@"SELECT * FROM ""Fee"".""ChallanValidityUpdate""('{0}','{1}',{2},'{3}','{4}','{5}','{6}')", tempList, campusId, installmentNo, programDetailId, classid, sessionid, Data);
            Console.WriteLine(query);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok("Done");

        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult StudentUserGen([FromBody] Predicate predicate)
        {
            var tempList = Convert.ToString(predicate.ProvidedString);

            IDbConnection connection = db.Database.GetDbConnection();

            string query = String.Format(@"SELECT * FROM ""Role"".""StudentEnrollEx""('{0}')", tempList);
            // Console.WriteLine(query);
            if (connection.State == ConnectionState.Closed)
                connection.Open();
            connection.Execute(query);
            if (connection.State == ConnectionState.Open)
            {
                connection.Close();
                connection.Dispose();
            }

            return Ok("Done");

        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] FeeChallanValidity entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async", "Fee.ChallanValidity"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] FeeChallanValidity entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete", "Fee.ChallanValidity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] FeeChallanValidity entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async", "Fee.ChallanValidity"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeChallanValidity).Assembly);
            Expression<Func<FeeChallanValidity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeChallanValidity, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(FeeChallanValidity).Assembly);
            Expression<Func<FeeChallanValidity, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<FeeChallanValidity, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }
    }
}

public class StudentChallanprint
{
    [Key]
    public string ChallanNo { get; set; }

    public Guid ChallanTypeId { get; set; }
}