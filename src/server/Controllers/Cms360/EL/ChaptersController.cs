
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
using Newtonsoft.Json;
using System.Data;
using Microsoft.EntityFrameworkCore;
using Dapper;
using System.Net.Http;
using Microsoft.Extensions.Azure;
using System.Net.Http.Headers;
using System.Text;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Text.Json;
using Cms360.Data.Model.ArvoSL;
using Org.BouncyCastle.Ocsp;
using Cms360.Contract;
using Microsoft.Graph;

namespace Cms360.UI.Controllers.Account
{

    [Route("api/[controller]")]
    [ServiceFilter(typeof(Server.Filters.ApiResultFilter))]
    [ServiceFilter(typeof(Server.Filters.ApiExceptionFilter))]
    [ServiceFilter(typeof(Server.Filters.IdentityMappingFilter))]
    public class ELChaptersController : Controller
    {
        private readonly IELChaptersRepository repository;
        private readonly IARVOConfigurationRepository arvorepositoryEx;
        private readonly IARVO_ConfigurationsRepository arvorepository;
        protected IDomainContextResolver Resolver;
        private IDomainContext domainContext;
        private readonly ISetupClassRepository clssrepository;
        private readonly IRegistrationCourseRepository courserepository;
        private static readonly object updateLock = new object();
        public string userLoginEmail;


        private readonly DbContextBase db;
        private readonly IUserLogService log;

        protected IDomainContext DomainContext
        {
            get
            {
                if (this.domainContext == null)
                    this.domainContext = this.Resolver.Resolve();

                return this.domainContext;
            }
        }

        public ELChaptersController(IUserLogService log, DbContextBase db, IDomainContextResolver Resolver, IELChaptersRepository repository, IARVOConfigurationRepository arvorepositoryEx, IARVO_ConfigurationsRepository arvorepository, ISetupClassRepository clssrepository, IRegistrationCourseRepository courserepository)
        {
            this.repository = repository;
            this.db = db;
            this.log = log;
            this.arvorepository = arvorepository;
            this.clssrepository = clssrepository;
            this.courserepository = courserepository;
            this.arvorepositoryEx = arvorepositoryEx;
            this.Resolver = Resolver;
            this.userLoginEmail = DomainContext.User.Username;
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
        public async Task<IActionResult> GetSingle([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ELChapters).Assembly);
            Expression<Func<ELChapters, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ELChapters, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.Single(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult GetChapters([FromBody] Predicate model)
        {
            var courseId = new Guid(model.ProvidedString.Split("?")[0]);
            string sql = String.Format("Select * from \"EL\".\"Chapters\" Where \"StatusId\"!=2 AND \"CourseId\"= '{0}'", courseId);
            // Console.WriteLine(sql);
            return Ok(db.ELChapters.FromSql(sql));
        }
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetChaptersList([FromBody] Predicate model)
        {
            var boardId = new Guid(model.ProvidedString.Split("?")[0]);
            var classId = new Guid(model.ProvidedString.Split("?")[1]);
            string sql = String.Format("Select * from \"EL\".\"Chapters\" Where \"StatusId\"!=2 AND \"BoardId\"= '{0}' AND \"ClassId\"= '{1}'", boardId, classId);
            // Console.WriteLine(sql);
            return Ok(db.ELChapters.FromSql(sql));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetSingleAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ELChapters).Assembly);
            Expression<Func<ELChapters, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ELChapters, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.SingleAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindBy([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ELChapters).Assembly);
            Expression<Func<ELChapters, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ELChapters, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.FindBy(discountFilterExpression));
        }
        private TreeItem CreateTreeItem(ChapterTestLatest chapter)
        {
            var chapterNode = new TreeItem
            {
                ID = chapter.ChapterId,
                Caption = chapter.ChapterTitle,
                IsChecked = false,
                Children = new List<TreeItem>()
            };

            foreach (var topic in chapter.Topics)
            {
                var topicNode = CreateTreeItemRecursive(topic);
                chapterNode.Children.Add(topicNode);
            }

            return chapterNode;
        }
        private TreeItemARVO CreateTreeItemARVO(ChapterTest chapter)
        {
            var chapterNode = new TreeItemARVO
            {
                ID = chapter.chapterId,
                Caption = chapter.chapterTitle,
                IsChecked = false,
                Children = new List<TreeItemARVO>()
            };

            foreach (var topic in chapter.topics)
            {
                var topicNode = CreateTreeItemRecursiveARVO(topic);
                chapterNode.Children.Add(topicNode);
            }

            return chapterNode;
        }
        private TreeItem CreateTreeItemRecursive(TopicEms topic)
        {
            var topicNode = new TreeItem
            {
                ID = topic.id,
                Caption = topic.name,
                IsChecked = false,
                Children = new List<TreeItem>()
            };

            foreach (var subTopic in topic.topics ?? new List<TopicEms>())
            {
                var subTopicNode = CreateTreeItemRecursive(subTopic);
                topicNode.Children.Add(subTopicNode);
            }

            return topicNode;
        }
        private TreeItemARVO CreateTreeItemRecursiveARVO(TopicTest topic)
        {
            var topicNode = new TreeItemARVO
            {
                ID = topic.id,
                Caption = topic.name,
                IsChecked = false,
                Children = new List<TreeItemARVO>()
            };

            foreach (var subTopic in topic.topics ?? new List<TopicTest>())
            {
                var subTopicNode = CreateTreeItemRecursiveARVO(subTopic);
                topicNode.Children.Add(subTopicNode);
            }

            return topicNode;
        }
        private void CheckTreeItems(TreeItem treeItem, string topicId)
        {
            if (treeItem.ID.ToString() == topicId)
            {
                treeItem.IsChecked = true;
            }

            foreach (var child in treeItem.Children)
            {
                CheckTreeItems(child, topicId);
            }

            // If any child is checked, the parent should also be checked
            if (treeItem.Children.Any(c => c.IsChecked))
            {
                treeItem.IsChecked = true;
            }
        }
        private void CheckTreeItemsARVO(TreeItemARVO treeItem, string topicId)
        {
            if (treeItem.ID.ToString() == topicId)
            {
                treeItem.IsChecked = true;
            }

            foreach (var child in treeItem.Children)
            {
                CheckTreeItemsARVO(child, topicId);
            }

            // If any child is checked, the parent should also be checked
            if (treeItem.Children.Any(c => c.IsChecked))
            {
                treeItem.IsChecked = true;
            }
        }
        private void CheckTreeItemsArvo(TreeItemARVO treeItem, string topicId)
        {
            if (treeItem.ID.ToString() == topicId)
            {
                treeItem.IsChecked = true;
            }

            foreach (var child in treeItem.Children)
            {
                CheckTreeItemsARVO(child, topicId);
            }

            // If any child is checked, the parent should also be checked
            if (treeItem.Children.Any(c => c.IsChecked))
            {
                treeItem.IsChecked = true;
            }
        }


        public IActionResult GetAllEMSChaptersTopic([FromBody] Predicate model)

        {
            var courseid = new Guid(model.ProvidedString.Split("?")[0]);
            var boardid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            var academiccalentermasterid = new Guid(model.ProvidedString.Split("?")[3]);

            var fromdateString = model.ProvidedString.Split("?")[4];
            var todateString = model.ProvidedString.Split("?")[5];

            DateTime fromdate = DateTime.Parse(fromdateString);
            DateTime todate = DateTime.Parse(todateString);
            if (!DateTime.TryParse(fromdateString, out fromdate) || !DateTime.TryParse(todateString, out todate))
            {
                return BadRequest("Invalid date format");
            }
            string json = String.Format(@"select * from ""EL"".""ChapterTopicsData""('{0}','{1}','{2}')", courseid, boardid, classid);
            Console.WriteLine("********************************************************************************************************************************");

            Console.WriteLine(json);

            var jsonSettings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };

            var chapters = this.db.ChapterTestNew.FromSql(json).ToList();

            var chaptersE = chapters.Select(chapter => new ChapterTestLatest
            {
                ChapterId = chapter.ChapterId,
                ChapterTitle = chapter.ChapterTitle,
                Topics = JsonConvert.DeserializeObject<List<TopicEms>>(chapter.Topics)
            }).ToList();

            var tree = new List<TreeItem>();
            foreach (var chapter in chaptersE)
            {
                var chapterNode = CreateTreeItem(chapter);
                tree.Add(chapterNode);
            }

            var academiccalendarids = this.db.AcademicCalendar.Where(e => e.AcademicCalendarMasterId == academiccalentermasterid && fromdate >= e.FromDate && fromdate <= e.ToDate && e.CourseId == courseid).ToList();
            var newstring = new StringBuilder();

            foreach (var newvalue in academiccalendarids)
            {
                if (newstring.Length > 0)
                {
                    newstring.Append(",");
                }
                newstring.Append(newvalue.AcademicCalendarId.ToString());

                foreach (var treevalue in tree)
                {
                    CheckTreeItems(treevalue, newvalue.TopicIds);
                }
            }

            var returnVal = new CheckedTreeListEx
            {
                OldIds = newstring.ToString(),
                TreeList = tree
            };
            return Ok(returnVal);

        }



        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetAllChapters([FromBody] Predicate model)
        {
            try
            {
                var courseid = new Guid(model.ProvidedString.Split("?")[0]);
                var boardid = new Guid(model.ProvidedString.Split("?")[1]);
                var classid = new Guid(model.ProvidedString.Split("?")[2]);
                var classdata = this.db.SetupClass.FirstOrDefault(e => e.ClassId == classid).ClassCode;
                var subjectName = this.db.RegistrationCourse.FirstOrDefault(e => e.CourseId == courseid).FullName;
                var boardcode = this.db.Boards.FirstOrDefault(e => e.BoardId == boardid).Abbreviation;
                var academiccalentermasterid = new Guid(model.ProvidedString.Split("?")[3]);

                if (subjectName == "Islamiyat")
                {
                    subjectName = "Islamiat";
                }

                if (subjectName == "Islamic Studies")
                {
                    subjectName = "Islamiat";
                }




                if (subjectName == "Translation of Holy Quran")
                {
                    subjectName = "Tarjama Tul Quran";
                }

                var fromdateString = model.ProvidedString.Split("?")[4];
                var todateString = model.ProvidedString.Split("?")[5];

                DateTime fromdate = DateTime.Parse(fromdateString);
                DateTime todate = DateTime.Parse(todateString);


                ChapterAndTopicsReq paramsvalue = new ChapterAndTopicsReq();

                // Check ArvoReferenceSubject for subject name override
                var refSubject = this.db.ArvoReferenceSubject.FirstOrDefault(e => e.Subject == subjectName);
                var arvoSubjectName = refSubject != null ? refSubject.ReferenceSubject : subjectName;

                if (!string.IsNullOrEmpty(refSubject?.Program) &&
                                   refSubject?.Program.IndexOf("dit", StringComparison.OrdinalIgnoreCase) >= 0 &&
                                   classdata == "10")
                {
                    paramsvalue = new ChapterAndTopicsReq
                    {
                        programCamboKey = "11-PreDIT-S1-E",
                        subjectName = arvoSubjectName
                    };
                }
                else if (classdata == "10")
                {
                    paramsvalue = new ChapterAndTopicsReq
                    {
                        programCamboKey = $"11-Pre-{boardcode}-E",
                        subjectName = arvoSubjectName
                    };
                }
                else
                {
                    paramsvalue = new ChapterAndTopicsReq
                    {
                        programCamboKey = $"{classdata}-Inter-{boardcode}-E",
                        subjectName = arvoSubjectName
                    };
                }



                var arvoCourse = this.db.ArvoCourses.FirstOrDefault(e => e.CourseName == subjectName);

                string arvoSubject = null;
                if (arvoCourse != null && !string.IsNullOrEmpty(arvoCourse.ClassIds))
                {
                    var classIdList = arvoCourse.ClassIds.Split(',');
                    if (classIdList.Contains(classid.ToString()))
                    {
                        arvoSubject = arvoCourse.CourseName;
                    }
                }
                var arvoBoards = this.db.ArvoDataBoards.FirstOrDefault(e => e.Abbreviation == boardcode && e.ClassIds.Contains(classid.ToString()))?.FullName;

                ARVOConfiguration _config = new ARVOConfiguration();

                if (!string.IsNullOrEmpty(arvoSubject) && !string.IsNullOrEmpty(arvoBoards))
                {



                    var resultvalue = await GetChapterandTopicsTest(model);
                    if (resultvalue.data != null && resultvalue.Code == "200")
                    {
                        var jsonSettings = new JsonSerializerSettings
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        };
                        // var jsonResponse = JsonConvert.SerializeObject(resultvalue, jsonSettings);
                        var tree = new List<TreeItemARVO>();
                        foreach (var chapter in resultvalue.data)
                        {
                            var chapterNode = CreateTreeItemARVO(chapter);
                            tree.Add(chapterNode);
                        }
                        var academiccalendarids = this.db.AcademicCalendar.Where(e => e.AcademicCalendarMasterId == academiccalentermasterid && fromdate >= e.FromDate && fromdate <= e.ToDate && e.CourseId == courseid).ToList();
                        var newstring = new StringBuilder();

                        foreach (var newvalue in academiccalendarids)
                        {
                            if (newstring.Length > 0)
                            {
                                newstring.Append(",");
                            }
                            newstring.Append(newvalue.AcademicCalendarId.ToString());

                            foreach (var treevalue in tree)
                            {
                                CheckTreeItemsARVO(treevalue, newvalue.TopicIds);
                            }
                        }

                        var returnVal = new CheckedTreeList
                        {
                            OldIds = newstring.ToString(),
                            TreeList = tree
                        };
                        return Ok(returnVal);
                    }
                    else
                    {
                        return Ok("Error in Arvo Api");
                    }

                }
                else
                {
                    return GetAllEMSChaptersTopic(model);
                }
            }
            catch (Exception ex)
            {
                // Log exception details for debugging
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, ex.Message);
            }

        }
        private async Task<ARVOConfiguration> ARVOLoginEx(ARVOConfiguration _config)
        {
            // SAMS_Configurations _config = await _unitOfWork.SAMS_Configurations.GetFirstOrDefaultAsync(r => r.srNo == 1);

            lock (updateLock)
            {
                if (_config != null)
                {
                    var loginRequest = new
                    {
                        email = _config.ARVOLoginEmail,
                        password = _config.ARVOLoginPassword
                    };

                    string jsonRequest = JsonConvert.SerializeObject(loginRequest);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    using (HttpClient client = new HttpClient())
                    {
                        HttpResponseMessage response = client.PostAsync(_config.LoginURL, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = response.Content.ReadAsStringAsync().Result;
                            JObject json = JObject.Parse(responseData);
                            _config.ARVOAccessToken = json["data"]["token"].ToString();
                            arvorepositoryEx.Update(_config);
                        }
                    }


                }
            }

            return _config;
        }
        private async Task<ARVO_Configurations> ARVOLogin(ARVO_Configurations _config)
        {
            // SAMS_Configurations _config = await _unitOfWork.SAMS_Configurations.GetFirstOrDefaultAsync(r => r.srNo == 1);

            lock (updateLock)
            {
                if (_config != null)
                {
                    var loginRequest = new
                    {
                        email = _config.ARVOLoginEmail,
                        password = _config.ARVOLoginPassword
                    };

                    string jsonRequest = JsonConvert.SerializeObject(loginRequest);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    using (HttpClient client = new HttpClient())
                    {
                        HttpResponseMessage response = client.PostAsync(_config.LoginURL, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = response.Content.ReadAsStringAsync().Result;
                            JObject json = JObject.Parse(responseData);
                            _config.ARVOAccessToken = json["data"]["token"].ToString();
                        }
                    }

                    arvorepository.Update(_config);
                }
            }

            return _config;
        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<GenericResponse<ChapterTest>> GetChapterandTopicsTest([FromBody] Predicate model)
        {

            Console.WriteLine("+++++++++++++++++++++++++++++++GetChapterandTopicsTest Called++++++++++++++++");
            var courseid = new Guid(model.ProvidedString.Split("?")[0]);
            var boardid = new Guid(model.ProvidedString.Split("?")[1]);
            var classid = new Guid(model.ProvidedString.Split("?")[2]);
            var classdata = this.db.SetupClass.FirstOrDefault(e => e.ClassId == classid).ClassCode;
            var subjectName = this.db.RegistrationCourse.FirstOrDefault(e => e.CourseId == courseid).FullName;
            var boardcode = this.db.Boards.FirstOrDefault(e => e.BoardId == boardid).Abbreviation;

            if (subjectName == "Islamiyat")
            {
                subjectName = "Islamiat";
            }



            if (subjectName == "Islamic Studies")
            {
                subjectName = "Islamiat";
            }

            if (subjectName == "Translation of Holy Quran")
            {
                subjectName = "Tarjama Tul Quran";
            }

            // Check ArvoReferenceSubject for subject name override
            var refSubjectTest = this.db.ArvoReferenceSubject.FirstOrDefault(e => e.Subject == subjectName);
            var arvoSubjectNameTest = refSubjectTest != null ? refSubjectTest.ReferenceSubject : subjectName;
            var originalSubjectName = subjectName;

            ChapterAndTopicsReq value = new ChapterAndTopicsReq();

            if (!string.IsNullOrEmpty(refSubjectTest?.Program) &&
                                             refSubjectTest?.Program.IndexOf("dit", StringComparison.OrdinalIgnoreCase) >= 0 &&
                                             classdata == "10")
            {
                value = new ChapterAndTopicsReq
                {
                    programCamboKey = "11-PreDIT-S1-E",
                    subjectName = arvoSubjectNameTest
                };
            }
            else
                if (classdata == "10")
                {
                    value = new ChapterAndTopicsReq
                    {
                        programCamboKey = $"11-Pre-{boardcode}-E",
                        subjectName = arvoSubjectNameTest
                    };
                }
                else
                {
                    value = new ChapterAndTopicsReq
                    {
                        programCamboKey = $"{classdata}-Inter-{boardcode}-E",
                        subjectName = arvoSubjectNameTest
                    };
                }

            GenericResponse<ChapterTest> response = new GenericResponse<ChapterTest>();
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.FullName == "ProgramComboAndSubListURL");
                // _config = samsdata.FirstOrDefault(e => e.FullName == "ProgramComboAndSubListURL");

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "ProgramComboAndSubListURL");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    apiUrl = _config.BaseURL + _config.APIURL;
                    accessToken = _config.ARVOAccessToken;

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    Console.WriteLine("+++++++++++++++++Arvo Calling++++++++++++");
                    HttpResponseMessage response1 = await client.GetAsync(apiUrl);
                    Console.WriteLine(response1);

                    if (response1.StatusCode.ToString() != "Unauthorized")
                    {
                        Console.WriteLine(response1.StatusCode.ToString());
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    }
                    else
                    {
                        _config = await ARVOLoginEx(_config);
                        accessToken = _config.ARVOAccessToken;

                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                        HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                        string responseData = await response2.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    }
                }
                else
                {
                    response.Code = "400";
                    response.Message = "No ARVO Configuration Found. Please contact system administrator";

                    return response;
                }


                List<ProgramCombo> pgmCombos = new List<ProgramCombo>();
                pgmCombos = resp.Data.ProgramCombos;

                List<Subject> sub = new List<Subject>();
                sub = resp.Data.Subjects;

                int targetProgramId = 0;
                int targetSubjectId = 0;
                ProgramCombo targetProgram = pgmCombos.FirstOrDefault(program => program.Name.ToLower() == value.programCamboKey.ToLower());
                Subject targetSubject = sub.FirstOrDefault(subject => subject.Name.Trim().ToLower() == value.subjectName.Trim().ToLower());

                if (targetProgram != null)
                {
                    targetProgramId = targetProgram.Id;
                }
                else
                {
                    response.Code = "400";
                    response.Message = "No Program Combo Found.";

                    return response;
                }

                if (targetSubject != null)
                {
                    targetSubjectId = targetSubject.Id;
                }
                else
                {
                    response.Code = "400";
                    response.Message = "No Subject Found";

                    return response;
                }

                response.Code = "200";
                response.Message = "Success";
                response.data = await getARVOChapAndTopicListTest(_config, targetProgramId, targetSubjectId, originalSubjectName);

            }
            catch (Exception ex)
            {
                response.Code = "500";
                response.Message = ex.Message;
            }
            finally
            {
                client.Dispose();
            }

            return response;
        }


        [HttpPost]
        [Route("[action]")]
        private async Task<List<ChapterTest>> getARVOChapAndTopicListTest(ARVOConfiguration _config, int progId, int subId, string originalSubjectName = null)
        {
            TopicListResponseTest resp = new TopicListResponseTest();
            List<ChapterTest> ChapList = new List<ChapterTest>();
            // var samsdata = this.db.ARVOConfiguration.Where(e => e.FullName == "ChapterAndTopicsListURL");
            // _config = samsdata.FirstOrDefault(e => e.FullName == "ChapterAndTopicsListURL");

            string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "ChapterAndTopicsListURL");
            var samsdata = this.db.ARVOConfiguration.FromSql(json);
            _config = samsdata.FirstOrDefault();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}?programComboId={progId}&subjectId={subId}&organizationId=4";

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<TopicListResponseTest>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<TopicListResponseTest>(responseData);
                    }
                }
            }
            ChapList = resp.data;

            // Filter by organizationSubject if original subject name is provided
            if (!string.IsNullOrEmpty(originalSubjectName) && ChapList != null)
            {
                ChapList = ChapList.Where(c =>
                    string.IsNullOrEmpty(c.organizationSubject) ||
                    c.organizationSubject.Trim().Equals(originalSubjectName.Trim(), StringComparison.OrdinalIgnoreCase)
                ).ToList();
            }

            return ChapList;

        }


        [HttpPost]
        [Route("[action]")]

        private async Task<List<Chapter>> getARVOChapAndTopicList(ARVO_Configurations _config, int progId, int subId)
        {
            TopicListResponse resp = new TopicListResponse();
            //ResponseData respData = new ResponseData(); 
            List<Chapter> ChapList = new List<Chapter>();

            //var topicsListRequest = new
            //{
            //    programComboId = progId,
            //    subjectId = subId
            //};


            string apiUrl = $"{_config.ChapterAndTopicsListURL}?programComboId={progId}&subjectId={subId}&organizationId={4}";

            //string jsonRequest = JsonConvert.SerializeObject(topicsListRequest);
            // var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<TopicListResponse>(responseData);
                }
            }

            //ResponseData respData = resp.respdata;
            ChapList = resp.data;
            ;
            return ChapList;

        }


        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<GenericResponse<QuestionMcQEx>> GetARVOTopicShortQuestion([FromBody] Predicate model)
        {


            GenericResponse<QuestionMcQEx> response = new GenericResponse<QuestionMcQEx>();
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string frontendTopics = parts[1];
            string contentType = parts[2];
            string module = parts[3];
            string userEmail = parts[4];
            string device = parts[5];


            string[] topicParts = frontendTopics.Split(',');
            List<int> frontendTopicIds = new List<int>();

            bool allAreInts = topicParts.All(t => int.TryParse(t, out _));

            if (allAreInts)
            {
                frontendTopicIds = topicParts.Select(int.Parse).ToList();
            }
            else
            {
                response.Code = "400";
                response.Message = "There are no Questions for this topic";
                return response;
            }




            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 7);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "7");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    apiUrl = _config.BaseURL + _config.APIURL;
                    accessToken = _config.ARVOAccessToken;

                    // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    // HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                    // if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                    // {
                    //     string responseData = await response1.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                    // else
                    // {
                    //     _config = await ARVOLoginEx(_config);
                    //     accessToken = _config.ARVOAccessToken;

                    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    //     HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                    //     string responseData = await response2.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                }
                else
                {
                    response.Code = "400";
                    response.Message = "No ARVO Configuration Found. Please contact system administrator";

                    return response;
                }
                response.Code = "200";
                response.Message = "Success";
                Console.WriteLine("response");
                Console.WriteLine(response);
                var resdata = await GetARVOTopicShortQuestionApi(_config, organization, frontendTopicIds, contentType, module, userEmail, device);

                var questionExList = MapShortQuestionDataToQuestionEx(new List<ShortData> { resdata });
                //response.data = new List<ShortData> { resdata };

                //string jsonString = System.Text.Json.JsonSerializer.Serialize(resdata, new JsonSerializerOptions { WriteIndented = true });
                //Console.WriteLine(jsonString);
                //response.data = new List<QuestionMcQEx> { resdata };

                response.data = questionExList;

            }
            catch (Exception ex)
            {
                response.Code = "500";
                response.Message = ex.Message;
            }
            finally
            {
                client.Dispose();
            }

            return response;
        }

        [HttpPost]
        [Route("[action]")]
        private async Task<ShortData> GetARVOTopicShortQuestionApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string module, string userEmail, string device)
        {
            ShortQuesResponse resp = new ShortQuesResponse();


            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                frontendTopicIds = frontendTopicIds,
                contentType = contentType,
                organizationCode = organization,
                userEmail = userEmail,
                module = module,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<ShortQuesResponse>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<ShortQuesResponse>(responseData);
                    }

                }
            }



            return resp.Data;

        }

        public List<QuestionMcQEx> MapShortQuestionDataToQuestionEx(List<ShortData> shortDataList)
        {
            var questionExList = new List<QuestionMcQEx>();



            foreach (var shrtData in shortDataList)
            {
                if (shrtData != null)
                {
                    foreach (var shrtItem in shrtData.Data)
                    {
                        var questionEx = new QuestionMcQEx
                        {
                            qid = shrtItem.Id.ToString(),
                            fullquestion = shrtItem.Question,
                            questiontype = (int)shrtItem.QuestionNatureId,
                            difficultylevel = (int)shrtItem.QuestionDifficultyId,
                            QuestionDifficultyName = shrtItem.QuestionDifficultyName,
                            QuestionNatureName = shrtItem.QuestionNatureName,
                            QuestionSourceName = shrtItem.QuestionSourceName,
                            SubjectName = shrtItem.QuestionLanguageName,
                            answers = System.Text.Json.JsonSerializer.Serialize(new List<AnswerQuiz>
                            {
                                new AnswerQuiz
                                {
                                    AnswerId = Guid.NewGuid().ToString(),
                                    FullAnswer = shrtItem.Answer,
                                    Reason = string.Empty,
                                    IsCorrect = 0,
                                    OrderNumber = 1
                                }
                            })
                        };

                        questionExList.Add(questionEx);
                    }
                }

            }

            return questionExList;
        }




        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<GenericResponse<QuestionMcQEx>> GetARVOTopicQuestion([FromBody] Predicate model)
        {


            GenericResponse<QuestionMcQEx> response = new GenericResponse<QuestionMcQEx>();
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string frontendTopics = parts[1];
            string contentType = parts[2];
            string module = parts[3];
            string userEmail = parts[4];
            string device = parts[5];



            string[] topicParts = frontendTopics.Split(',');
            List<int> frontendTopicIds = new List<int>();

            bool allAreInts = topicParts.All(t => int.TryParse(t, out _));

            if (allAreInts)
            {
                frontendTopicIds = topicParts.Select(int.Parse).ToList();
            }
            else
            {
                response.Code = "400";
                response.Message = "There are no Questions for this topic";
                return response;
            }




            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 7);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "7");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    // apiUrl = _config.BaseURL + _config.APIURL;
                    // accessToken = _config.ARVOAccessToken;

                    // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    // HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                    // if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                    // {
                    //     string responseData = await response1.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                    // else
                    // {
                    //     _config = await ARVOLoginEx(_config);
                    //     accessToken = _config.ARVOAccessToken;

                    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    //     HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                    //     string responseData = await response2.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                }
                else
                {
                    response.Code = "400";
                    response.Message = "No ARVO Configuration Found. Please contact system administrator";

                    return response;
                }
                response.Code = "200";
                response.Message = "Success";
                Console.WriteLine("response");
                Console.WriteLine(response);

                var resdata = await GetARVOTopicQuestionApi(_config, organization, frontendTopicIds, contentType, module, userEmail, device);

                var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });

                response.Code = "200";
                response.Message = "Success";
                response.data = questionExList;
            }
            catch (Exception ex)
            {
                response.Code = "500";
                response.Message = ex.Message;
            }
            finally
            {
                client.Dispose();
            }

            return response;
        }


        public List<QuestionMcQEx> MapMcqDataToQuestionEx(List<McqData> mcqDataList)
        {
            var questionExList = new List<QuestionMcQEx>();



            foreach (var mcqData in mcqDataList)
            {
                if (mcqData != null)
                {
                    foreach (var mcqItem in mcqData.Data)
                    {

                        // Map boards data
                        var boardsData = mcqItem.GeneralContentPastPapers?.Select(paper => new
                        {
                            year = paper.YearName,
                            board = paper.BoardName
                        }).ToList();

                        string boardsJson = System.Text.Json.JsonSerializer.Serialize(boardsData);


                        var questionEx = new QuestionMcQEx
                        {

                            qid = mcqItem.id.ToString(),
                            topicName = mcqItem.TopicName,
                            SubjectName = mcqItem.questionLanguageName,
                            fullquestion = mcqItem.statement,
                            questiontype = mcqItem.questionNatureId,
                            difficultylevel = mcqItem.questionDifficultyId,
                            subject = mcqItem.subjectName,
                            answers = System.Text.Json.JsonSerializer.Serialize(mcqItem.mcqoptions.Select(o => new AnswerQuiz
                            {
                                AnswerId = o.Id.ToString(),
                                FullAnswer = o.OptionValue,
                                // Reason = o.AnswerExplanation?.ToString() ?? string.Empty,
                                Reason = mcqItem.answerExplanation?.ToString() ?? string.Empty,
                                IsCorrect = o.CorrectAnswer == true ? 1 : 0,
                                OrderNumber = o.Id
                            }).ToList()),


                            boards = boardsJson, // Assign the serialized boards JSON string
                            QuestionDifficultyName = mcqItem.QuestionDifficultyName,
                            QuestionNatureName = mcqItem.QuestionNatureName,
                            QuestionSourceName = mcqItem.QuestionSourceName
                        };

                        questionExList.Add(questionEx);
                    }
                }

            }

            return questionExList;
        }


        public List<QuestionMcQEx> MapMcqDataToQuestiontestyourself(List<BookQuizQuestionTestYourself> mcqDataList)
        {
            var questionExList = new List<QuestionMcQEx>();



            foreach (var mcqData in mcqDataList)
            {
                if (mcqData != null)
                {
                    var mcqItem = mcqData.QuizQuestionDetail;
                    // foreach (var mcqItem in mcqData.QuizQuestionDetail)
                    // {

                    // Map boards data
                    var boardsData = mcqItem.GeneralContentPastPapers?.Select(paper => new
                    {
                        year = paper.YearName,
                        board = paper.BoardName
                    }).ToList();

                    string boardsJson = System.Text.Json.JsonSerializer.Serialize(boardsData);


                    var questionEx = new QuestionMcQEx
                    {

                        qid = mcqData.Id.ToString(),
                        topicName = mcqItem.TopicName,
                        SubjectName = mcqItem.QuestionLanguageName,
                        fullquestion = mcqItem.Statement,
                        questiontype = mcqItem.QuestionNatureId,
                        difficultylevel = mcqItem.QuestionDifficultyId,
                        subject = mcqItem.SubjectName,
                        answers = System.Text.Json.JsonSerializer.Serialize(mcqItem.McqOptions.Select(o => new AnswerQuiz
                        {
                            AnswerId = o.Id.ToString(),
                            FullAnswer = o.OptionValue,
                            // Reason = o.AnswerExplanation?.ToString() ?? string.Empty,
                            Reason = mcqItem.AnswerExplanation?.ToString() ?? string.Empty,
                            IsCorrect = o.CorrectAnswer == true ? 1 : 0,
                            OrderNumber = o.Id
                        }).ToList()),


                        boards = boardsJson // Assign the serialized boards JSON string
                    };

                    questionExList.Add(questionEx);
                    // }
                }

            }

            return questionExList;
        }

        [HttpPost]
        [Route("[action]")]
        private async Task<McqData> GetARVOTopicQuestionApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string module, string userEmail, string device)
        {
            McqResponse resp = new McqResponse();


            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                frontendTopicIds = frontendTopicIds,
                contentType = contentType,
                organizationCode = organization,
                userEmail = userEmail,
                module = module,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<McqResponse>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<McqResponse>(responseData);
                    }

                }
            }



            return resp.Data;

        }




        public List<QuestionMcQEx> MapContentToQuestionEx(List<ContentData> shortDataList)
        {
            var questionExList = new List<QuestionMcQEx>();



            foreach (var shrtData in shortDataList)
            {
                if (shrtData != null)
                {
                    foreach (var shrtItem in shrtData.Data)
                    {
                        var boardsData = shrtItem.GeneralContentPastPapersShortQuestion?.Select(paper => new
                        {
                            year = paper.YearName,
                            board = paper.BoardName
                        }).ToList();

                        string boardsJson = System.Text.Json.JsonSerializer.Serialize(boardsData);


                        var questionEx = new QuestionMcQEx
                        {
                            qid = shrtItem.Id.ToString(),
                            topicName = shrtItem.TopicName,
                            SubjectName = shrtItem.QuestionLanguageName,
                            fullquestion = shrtItem.Question,
                            questiontype = (int)shrtItem.QuestionNatureId,
                            difficultylevel = (int)shrtItem.QuestionDifficultyId,
                            subject = shrtItem.subjectName == null ? "" : shrtItem.subjectName,
                            answers = System.Text.Json.JsonSerializer.Serialize(new List<AnswerQuiz>
                            {
                                new AnswerQuiz
                                {
                                    AnswerId = Guid.NewGuid().ToString(),
                                    FullAnswer = shrtItem.Answer,
                                    Reason = string.Empty,
                                    IsCorrect = 0,
                                    OrderNumber = 1
                                }
                            }),
                            boards = boardsJson, // Assign the serialized boards JSON string
                            QuestionDifficultyName = shrtItem.QuestionDifficultyName,
                            QuestionNatureName = shrtItem.QuestionNatureName,
                            QuestionSourceName = shrtItem.QuestionSourceName
                        };

                        questionExList.Add(questionEx);
                    }
                }

            }

            return questionExList;
        }


        public List<QuestionMcQEx> MapContentToQuestionExLq(List<ContentDataLq> shortDataList)
        {
            var questionExList = new List<QuestionMcQEx>();



            foreach (var shrtData in shortDataList)
            {
                if (shrtData != null)
                {
                    foreach (var shrtItem in shrtData.Data)
                    {
                        var boardsData = shrtItem.GeneralContentPastPapersLongQuestion?.Select(paper => new
                        {
                            year = paper.YearName,
                            board = paper.BoardName
                        }).ToList();

                        string boardsJson = System.Text.Json.JsonSerializer.Serialize(boardsData);


                        var questionEx = new QuestionMcQEx
                        {
                            qid = shrtItem.Id.ToString(),
                            topicName = shrtItem.TopicName,
                            SubjectName = shrtItem.QuestionLanguageName,
                            fullquestion = shrtItem.Question,
                            questiontype = (int)shrtItem.QuestionNatureId,
                            difficultylevel = (int)shrtItem.QuestionDifficultyId,
                            answers = System.Text.Json.JsonSerializer.Serialize(new List<AnswerQuiz>
                            {
                                new AnswerQuiz
                                {
                                    AnswerId = Guid.NewGuid().ToString(),
                                    FullAnswer = shrtItem.Answer,
                                    Reason = string.Empty,
                                    IsCorrect = 0,
                                    OrderNumber = 1
                                }
                            }),
                            boards = boardsJson, // Assign the serialized boards JSON string
                            QuestionDifficultyName = shrtItem.QuestionDifficultyName,
                            QuestionNatureName = shrtItem.QuestionNatureName,
                            QuestionSourceName = shrtItem.QuestionSourceName  // Assign the serialized boards JSON string
                        };

                        questionExList.Add(questionEx);
                    }
                }

            }

            return questionExList;
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetARVObookQuiz([FromBody] Predicate model)
        {
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string id = parts[1];
            string module = parts[2];
            string userEmail = parts[3];
            string device = parts[4];

            var json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "28");
            var samsdata = this.db.ARVOConfiguration.FromSql(json);
            _config = samsdata.FirstOrDefault();



            var resdata = await GetARVOTestYouSelfContentApiMobileApp(_config, organization, id, module, userEmail, device);
            var questionExList = MapMcqDataToQuestiontestyourself(resdata.Data.BookQuizQuestions);
            return Ok(questionExList);

        }



        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetARVOContent([FromBody] Predicate model)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string frontendTopics = parts[1];
            string contentType = parts[2];
            string referenceType = parts[3];
            string referenceId = parts[4];
            int? subjectId = (parts.Length > 5 && !string.IsNullOrEmpty(parts[5])) ? int.Parse(parts[5]) : (int?)null;

            string module = parts[6];
            string userEmail = parts[7];
            string device = parts[8];


            string[] topicParts = frontendTopics.Split(',');
            List<int> frontendTopicIds = new List<int>();

            bool allAreInts = topicParts.All(t => int.TryParse(t, out _));

            if (allAreInts)
            {
                frontendTopicIds = topicParts.Select(int.Parse).ToList();
            }
            else
            {
                var responseNew = "There are no Questions for this Topic.";
                return Ok(responseNew);
            }
            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 8);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "8");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    // apiUrl = _config.BaseURL + _config.APIURL;
                    // accessToken = _config.ARVOAccessToken;

                    // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    // HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                    // if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                    // {
                    //     string responseData = await response1.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                    // else
                    // {
                    //     _config = await ARVOLoginEx(_config);
                    //     accessToken = _config.ARVOAccessToken;

                    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    //     HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                    //     string responseData = await response2.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                }
                else
                {

                    var responseNew1 = "No Configuration found for this Arvo Api.";
                    return Ok(responseNew1);
                }

                if (contentType == "6" || contentType == "7" || contentType == "ShortQuestions" || contentType == "LongQuestions")
                {
                    var resdata = await GetARVOContentSQLQApiMobileApp(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, subjectId, module, userEmail, device);
                    var questionExList = MapContentToQuestionEx(new List<ContentData> { resdata });
                    return Ok(questionExList);
                }
                else if (contentType == "4" || contentType == "MCQs")
                {
                    var resdata = await GetARVOMCQContentApiMobileApp(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, subjectId, module, userEmail, device);
                    var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });
                    return Ok(questionExList);

                }
                else if (contentType == "1" || contentType == "Videos" || contentType == "10" || contentType == "21")
                {
                    var resdata = await GetARVOContentVideoApiMobileApp(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, subjectId, module, userEmail, device);
                    var questionExList = MapVideoData(new List<VideoDataResponse> { resdata });


                    return Ok(questionExList);
                }
                else if (contentType == "20" || contentType == "Gif" || contentType == "19" || contentType == "Code" || contentType == "17" || contentType == "ExternalURL")
                {
                    var resdata = await GetARVOContentGifApiMobileApp(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, subjectId, module, userEmail, device);
                    //var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });
                    return Ok(resdata.Data);
                }
                else if (contentType == "11" || contentType == "Model3D" || contentType == "18" || contentType == "Game")
                {
                    var resdata = await GetARVOContentGameApiMobileApp(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, subjectId, module, userEmail, device);
                    //var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });
                    return Ok(resdata.Data);
                }

                else if (contentType == "FillInTheBlank" || contentType == "22")
                {
                    contentType = "FillInTheBlank";
                    var resdata = await GetARVOContentFillinBlanksMobileApp(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, subjectId, module, userEmail, device);
                    //var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });
                    return Ok(resdata.Data);
                }
                else if (contentType == "TestYourSelf" || contentType == "23")
                {

                    json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "29");
                    samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();



                    var resdata = await GetARVOContenttestYourSelfApi(_config, organization, frontendTopicIds, module, userEmail, device);
                    return Ok(resdata.Data);

                }
                else
                {
                    return Ok("Content Type is not valid.");
                }


            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
            finally
            {
                client.Dispose();
            }


        }


        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetARVOContentWeb([FromBody] Predicate model)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string frontendTopics = parts[1];
            string contentType = parts[2];
            string referenceType = parts[3];
            string referenceId = parts[4];
            string chapterid = parts[5];
            string userid = parts[6];
            string isArvo = parts[7];
            string isPastPaper = parts.Length > 8 && !string.IsNullOrWhiteSpace(parts[8]) ? parts[8] : "false";
            string userEmail = parts[9];
            string module = parts[10];
            string device = parts[11];




            if (isArvo == "true")
            {

                string[] topicParts = frontendTopics.Split(',');
                List<int> frontendTopicIds = new List<int>();

                bool allAreInts = topicParts.All(t => int.TryParse(t, out _));

                if (allAreInts)
                {
                    frontendTopicIds = topicParts.Select(int.Parse).ToList();
                }
                else
                {
                    var responseNew = "There are no Questions for this Topic.";
                    return Ok(responseNew);
                }
                try
                {
                    // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 8);
                    // _config = samsdata.FirstOrDefault();

                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "8");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    string apiUrl, accessToken = string.Empty;


                    if (_config != null)
                    {
                        // apiUrl = _config.BaseURL + _config.APIURL;
                        // accessToken = _config.ARVOAccessToken;

                        // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                        // HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                        // if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                        // {
                        //     string responseData = await response1.Content.ReadAsStringAsync();
                        //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                        // }
                        // else
                        // {
                        //     _config = await ARVOLoginEx(_config);
                        //     accessToken = _config.ARVOAccessToken;

                        //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                        //     HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                        //     string responseData = await response2.Content.ReadAsStringAsync();
                        //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                        // }
                    }
                    else
                    {

                        var responseNew1 = "No Configuration found for this Arvo Api.";
                        return Ok(responseNew1);
                    }

                    if (contentType == "6" || contentType == "ShortQuestions")
                    {
                        var resdata = await GetARVOContentSQLQApi(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, module, userEmail, device);
                        var questionExList = MapContentToQuestionEx(new List<ContentData> { resdata });
                        return Ok(questionExList);
                    }
                    else if (contentType == "7" || contentType == "LongQuestions")
                    {
                        var resdata = await GetARVOContentLQLQApi(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, module, userEmail, device);
                        var questionExList = MapContentToQuestionExLq(new List<ContentDataLq> { resdata });
                        return Ok(questionExList);
                    }
                    else if (contentType == "4" || contentType == "MCQs")
                    {
                        var resdata = await GetARVOMCQContentApi(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, module, userEmail, device);
                        var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });
                        return Ok(questionExList);

                    }
                    else if (contentType == "1" || contentType == "Videos" || contentType == "10" || contentType == "21" || contentType == "BiteSize")
                    {
                        var resdata = await GetARVOContentVideoApi(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, module, userEmail, device);
                        var questionExList = MapVideoData(new List<VideoDataResponse> { resdata });
                        var newuserid = new Guid(userid);

                        var tpicwatchlist = this.db.TopicsWatched.Where(e => e.UserId == newuserid).ToList();
                        if (tpicwatchlist.Count > 0)
                        {
                            foreach (var item in questionExList)
                            {
                                var topicwatchId = tpicwatchlist.FirstOrDefault(e => e.TopicId == item.topicId);
                                if (topicwatchId != null)
                                {
                                    item.maxWatched = 100;
                                }
                            }
                            ;
                        }

                        return Ok(questionExList);
                    }



                    else if (contentType == "20" || contentType == "Gif" || contentType == "19" || contentType == "Code" || contentType == "17" || contentType == "ExternalURL")
                    {
                        var resdata = await GetARVOContentGifApi(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, module, userEmail, device);
                        //var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });
                        return Ok(resdata.Data);
                    }
                    else if (contentType == "11" || contentType == "Model3D" || contentType == "18" || contentType == "Game")
                    {
                        var resdata = await GetARVOContentGameApi(_config, organization, frontendTopicIds, contentType, referenceType, referenceId, module, userEmail, device);
                        //var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });
                        return Ok(resdata.Data);
                    }
                    else
                    {
                        return Ok("Content Type is not valid.");
                    }


                }
                catch (Exception ex)
                {
                    return Ok(ex.Message);
                }
                finally
                {
                    client.Dispose();
                }

            }


            else
            {
                if (contentType == "1" || contentType == "Videos")
                {
                    var resdata = await GetELVideoDataContent(_config, userid, chapterid, module, userEmail, device);
                    return Ok(resdata);
                }
                else if (contentType == "6" || contentType == "7" || contentType == "4" || contentType == "MCQs" || contentType == "ShortQuestions" || contentType == "LongQuestions")
                {
                    var qtype = GetQuestionTypeId(contentType);
                    var resdata = await GetQuestionWAnswers(_config, userid, chapterid, qtype, module, userEmail, device, isPastPaper);
                    return Ok(resdata);
                }
                return Ok(1);
            }

        }


        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetARVOContentOldVideo([FromBody] Predicate model)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string chapterid = parts[0];
            string userid = parts[1];
            string module = parts[2];
            string userEmail = parts[3];
            string device = parts[4];


            var resdata = await GetELVideoDataContentOld(_config, userid, chapterid, module, userEmail, device);
            var newuserid = new Guid(userid);
            var tpicwatchlist = this.db.TopicsWatched.Where(e => e.UserId == newuserid).ToList();
            if (tpicwatchlist.Count > 0)
            {
                foreach (var item in resdata)
                {
                    var topicwatchId = tpicwatchlist.FirstOrDefault(e => e.TopicId == item.topicId);
                    if (topicwatchId != null)
                    {
                        item.maxWatched = 100;
                    }
                }
                ;
            }
            return Ok(resdata);

        }


        public async Task<List<MapVideoData>> GetELVideoDataContent(ARVOConfiguration _config, string userid, string chid, string module, string userEmail, string device)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            // ARVOConfiguration _config = new ARVOConfiguration();
            List<MapVideoData> res = new List<MapVideoData>();
            MapVideoData responseNew1 = new MapVideoData();

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 16);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "16");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    apiUrl = $"{_config.BaseURL + _config.APIURL}";

                    var requestbody = new
                    {
                        val = chid,
                        userEmail = userEmail,
                        module = module,
                        organizationCode = "CMS",
                        device = device
                    };

                    string jsonRequest = JsonConvert.SerializeObject(requestbody);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                    HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<List<MapVideoData>>(responseData);

                    }
                    else
                    {
                        _config = await ARVOLoginEx(_config);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                        HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                        if (response1.IsSuccessStatusCode)
                        {
                            string responseData = await response1.Content.ReadAsStringAsync();
                            res = JsonConvert.DeserializeObject<List<MapVideoData>>(responseData);
                        }
                    }


                    return res;






                }
                return new List<MapVideoData> { responseNew1 };
            }
            catch (Exception ex)
            {
                responseNew1.fullName = ex.Message;
                return new List<MapVideoData> { responseNew1 };
            }
            finally
            {
                client.Dispose();
            }


        }


        public async Task<List<MapVideoData>> GetELVideoDataContentOld(ARVOConfiguration _config, string userid, string chid, string module, string userEmail, string device)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            // ARVOConfiguration _config = new ARVOConfiguration();
            List<MapVideoData> res = new List<MapVideoData>();
            MapVideoData responseNew1 = new MapVideoData();

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 22);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "22");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    apiUrl = $"{_config.BaseURL + _config.APIURL}";

                    var requestbody = new
                    {
                        val = chid,
                        userEmail = userEmail,
                        module = module,
                        organizationCode = "CMS",
                        device = device
                    };

                    string jsonRequest = JsonConvert.SerializeObject(requestbody);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                    HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<List<MapVideoData>>(responseData);

                    }
                    else
                    {
                        _config = await ARVOLoginEx(_config);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                        HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                        if (response1.IsSuccessStatusCode)
                        {
                            string responseData = await response1.Content.ReadAsStringAsync();
                            res = JsonConvert.DeserializeObject<List<MapVideoData>>(responseData);
                        }
                    }


                    return res;






                }
                return new List<MapVideoData> { responseNew1 };
            }
            catch (Exception ex)
            {
                responseNew1.fullName = ex.Message;
                return new List<MapVideoData> { responseNew1 };
            }
            finally
            {
                client.Dispose();
            }


        }



        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetARVOContentCreatTest([FromBody] CreatTestLimit model)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            if (model.Data.Count > 0)
            {

                if (model.Data[0].IsArvo == true)
                {

                    List<int> allContentIds = new List<int>();

                    List<int> selectedContentIds = new List<int>();

                    foreach (var chapter in model.Data)
                    {
                        foreach (var content in chapter.Content)
                        {
                            allContentIds.AddRange(content.ContentIds);
                        }
                    }

                    // Step 2: Check if QCount is greater than the total number of ContentIds
                    if (model.QCount >= allContentIds.Count)
                    {
                        selectedContentIds = allContentIds;
                    }
                    else
                    {
                        // Step 3: Randomly select QCount number of ContentIds
                        var random = new Random();
                        selectedContentIds = allContentIds.OrderBy(x => random.Next()).Take(model.QCount).ToList();


                    }



                    try
                    {


                        string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "8");
                        var samsdata = this.db.ARVOConfiguration.FromSql(json);
                        _config = samsdata.FirstOrDefault();

                        string apiUrl, accessToken = string.Empty;


                        if (_config != null)
                        {

                        }
                        else
                        {

                            var responseNew1 = "No Configuration found for this Arvo Api.";
                            return Ok(responseNew1);
                        }


                        var resdata = await GetARVOMCQContentApi(_config, "CMS", selectedContentIds, "MCQs", "", "", model.Module, model.UserEmail, model.Device);
                        var questionExList = MapMcqDataToQuestionEx(new List<McqData> { resdata });
                        return Ok(questionExList);




                    }
                    catch (Exception ex)
                    {
                        return Ok(ex.Message);
                    }
                    finally
                    {
                        client.Dispose();
                    }

                }
                else
                {

                    List<string> chapterIds = new List<string>();

                    foreach (var chapter in model.Data)
                    {
                        chapterIds.Add(chapter.Id);

                    }

                    // Step 2: Concatenate Ids with ','
                    string concatenatedIds = string.Join(",", chapterIds);


                    var qtype = GetQuestionTypeId("MCQs");
                    var resdata = await GetQuestionWAnswersBx(_config, "", concatenatedIds, model.QCount, model.Module, model.UserEmail, model.Device);
                    return Ok(resdata);

                }

            }
            return Ok(1);
        }





        [HttpPost]
        [Route("[action]")]
        private async Task<ContentData> GetARVOContentSQLQApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, string module, string userEmail, string device)
        {

            ContentData res = new ContentData();

            Datavalue rs = new Datavalue();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<ContentData>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<ContentData>(responseData);
                    }

                }
            }
            return res;

        }

        [HttpPost]
        [Route("[action]")]
        private async Task<ContentData> GetARVOContentSQLQApiMobileApp(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, int? subjectId, string module, string userEmail, string device)
        {

            ContentData res = new ContentData();

            Datavalue rs = new Datavalue();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                subjectId = subjectId,
                organizationCode = organization,
                module = module,
                userEmail = userEmail,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<ContentData>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<ContentData>(responseData);
                    }

                }
            }
            return res;

        }


        [HttpPost]
        [Route("[action]")]
        private async Task<ContentDataLq> GetARVOContentLQLQApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, string module, string userEmail, string device)
        {

            ContentDataLq res = new ContentDataLq();

            Datavalue rs = new Datavalue();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<ContentDataLq>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<ContentDataLq>(responseData);
                    }

                }
            }
            return res;

        }



        [HttpPost]
        [Route("[action]")]
        private async Task<McqData> GetARVOMCQContentApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, string module, string userEmail, string device)
        {

            McqData resp = new McqData();


            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<McqData>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<McqData>(responseData);
                    }

                }
            }



            return resp;

        }

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<dynamic> GetARVOSetupTags([FromBody] SetupTagsModel model)
        {
            ARVOConfiguration _config = new ARVOConfiguration();

            string json = string.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "33");
            var samsdata = this.db.ARVOConfiguration.FromSql(json);
            _config = samsdata.FirstOrDefault();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = model.Organization,
                userEmail = model.UserEmail,
                module = model.Module,
                organizationCode = model.Organization,
                device = model.Device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<dynamic>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = await client.PostAsync(apiUrl, content);

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        return JsonConvert.DeserializeObject<dynamic>(responseData);
                    }
                }
            }

            return null;
        }




        [HttpPost]
        [Route("[action]")]
        private async Task<McqData> GetARVOMCQContentApiMobileApp(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, int? subjectId, string module, string userEmail, string device)
        {

            McqData resp = new McqData();


            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                subjectId = subjectId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device

            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<McqData>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<McqData>(responseData);
                    }

                }
            }



            return resp;

        }

        [HttpPost]
        [Route("[action]")]
        private async Task<ApiResponseTestYourself> GetARVOTestYouSelfContentApiMobileApp(ARVOConfiguration _config, string organization, string frontendTopicIds, string module, string userEmail, string device)
        {

            ApiResponseTestYourself resp = new ApiResponseTestYourself();


            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                id = Convert.ToInt32(frontendTopicIds),
                module = module,
                userEmail = userEmail,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<ApiResponseTestYourself>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<ApiResponseTestYourself>(responseData);
                    }

                }
            }



            return resp;

        }


        private static readonly object academicLoginLock = new object();

        private async Task<ARVOConfiguration> ARVOAcademicLoginAsync(
            ARVOConfiguration config)
        {
            if (config == null)
                return config;

            lock (academicLoginLock)
            {
                var loginPayload = new
                {
                    organization = "CMS",
                    module = "El",
                    device = "WEB",
                    email = config.ARVOLoginEmail,
                    password = config.ARVOLoginPassword,
                    productId = "ff1e0286-0e7c-4bb1-a240-9d359aa7b7f8",
                    provider = "email"
                };

                string json = JsonConvert.SerializeObject(loginPayload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                using (HttpClient client = new HttpClient())
                {
                    var response = client.PostAsync(config.LoginURL, content).Result;

                    if (!response.IsSuccessStatusCode)
                        throw new Exception("ARVO Academic login failed");

                    var responseData = response.Content.ReadAsStringAsync().Result;
                    var jsonObj = JObject.Parse(responseData);

                    var token = jsonObj["data"]?["token"]?.ToString();

                    if (string.IsNullOrEmpty(token))
                        throw new Exception("ARVO Academic token not found");

                    config.ARVOAccessToken = token;

                    arvorepositoryEx.Update(config);
                }
            }

            return config;
        }


        public async Task<dynamic> ExecuteArvoAcademicApiAsync(
            ARVOConfiguration config,
            dynamic payload)
        {
            string apiUrl = $"{config.BaseURL}{config.APIURL}";
            string jsonRequest = JsonConvert.SerializeObject(payload);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", config.ARVOAccessToken);

                var response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    return JsonConvert.DeserializeObject<dynamic>(
                        await response.Content.ReadAsStringAsync());
                }

                // ONLY academic login retry
                if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    config = await ARVOAcademicLoginAsync(config);

                    client.DefaultRequestHeaders.Authorization =
                        new AuthenticationHeaderValue("Bearer", config.ARVOAccessToken);

                    var retry = await client.PostAsync(apiUrl, content);

                    if (retry.IsSuccessStatusCode)
                    {
                        return JsonConvert.DeserializeObject<dynamic>(
                            await retry.Content.ReadAsStringAsync());
                    }
                }
            }

            return null;
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetTrainings([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('42')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetTrainingDetail([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('43')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetTrainingContent([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('35')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetTraningQuiz([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('36')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.encryptedData);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> TraningUserActionLog([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('37')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> TraningSaveQuiz([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('38')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetActionLogs([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('39')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetTrainingProgress([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('40')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetCertificate([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('41')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }

        [IgnoreAntiforgeryToken]
        [AllowAnonymous]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetQuizResult([FromBody] dynamic payload)
        {
            var config = db.ARVOConfiguration
                .FromSql(@"select * from ""EL"".""GetArvoConfig""('44')")
                .FirstOrDefault();

            var result = await ExecuteArvoAcademicApiAsync(config, payload);
            return Ok(result?.data);
        }






        [HttpPost]
        [Route("[action]")]
        private async Task<VideoDataResponse> GetARVOContentVideoApiMobileApp(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, int? subjectId, string module, string userEmail, string device)
        {

            VideoDataResponse res = new VideoDataResponse();

            VideoData rs = new VideoData();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                subjectId = subjectId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<VideoDataResponse>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<VideoDataResponse>(responseData);
                    }

                }
            }
            return res;

        }


        [HttpPost]
        [Route("[action]")]
        private async Task<VideoDataResponse> GetARVOContentVideoApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, string module, string userEmail, string device)
        {

            VideoDataResponse res = new VideoDataResponse();

            VideoData rs = new VideoData();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<VideoDataResponse>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<VideoDataResponse>(responseData);
                    }

                }
            }
            return res;

        }

        [HttpPost]
        [Route("[action]")]
        private async Task<VideoDataResponseEx> GetAcademicARVOContentVideoApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string module, string userEmail, string device)
        {

            VideoDataResponseEx res = new VideoDataResponseEx();

            VideoDataEX rs = new VideoDataEX();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                frontendTopicIds = frontendTopicIds,
                contentType = contentType,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device

            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<VideoDataResponseEx>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<VideoDataResponseEx>(responseData);
                    }

                }
            }
            return res;

        }

        public List<MapVideoData> AcademicMapVideoData(List<VideoDataResponseEx> mcqDataList)
        {
            var questionExList = new List<MapVideoData>();



            foreach (var mcqData in mcqDataList)
            {
                if (mcqData != null && mcqData.Data != null && mcqData.Data.Data != null)
                {
                    foreach (var mcqItem in mcqData.Data.Data)
                    {
                        var questionEx = new MapVideoData
                        {
                            topicId = mcqItem.Id.ToString(),
                            topicName = mcqItem.topicName,
                            SubjectName = mcqItem.QuestionLanguageName,
                            chapterId = mcqItem.ChapterId.ToString(),
                            tCode = "",
                            fullName = mcqItem.Title,
                            description = mcqItem.ChapterTitle,
                            videoLink = mcqItem.VimeoURL,
                            orderNumber = mcqItem.Sequence,
                            isEnable = 1,
                            subject = mcqItem.SubjectName

                        };

                        questionExList.Add(questionEx);
                    }
                }

            }

            return questionExList;
        }


        public List<MapVideoData> MapVideoData(List<VideoDataResponse> mcqDataList)
        {
            var questionExList = new List<MapVideoData>();

            foreach (var mcqData in mcqDataList)
            {
                if (mcqData != null)
                {
                    foreach (var mcqItem in mcqData.Data.Where(e => !string.IsNullOrEmpty(e.VimeoURL)))
                    {
                        var videoUrl = mcqItem.VimeoURL;
                        var iframeTag = $@"<iframe src=""{videoUrl}"" frameborder=""0"" allow=""autoplay; fullscreen; picture-in-picture; clipboard-write"" style=""position:absolute;top:0;left:0;width:100%;height:100%;""></iframe>";

                        var questionEx = new MapVideoData
                        {
                            topicId = mcqItem.Id.ToString(),
                            topicName = mcqItem.topicName,
                            SubjectName = mcqItem.QuestionLanguageName,
                            chapterId = mcqItem.ChapterId.ToString(),
                            tCode = "",
                            fullName = mcqItem.Title,
                            description = string.IsNullOrEmpty(mcqItem.ChapterTitle) ? mcqItem.Title : mcqItem.ChapterTitle,
                            videoLink = iframeTag,
                            orderNumber = mcqItem.Sequence,
                            isEnable = 1,
                            subject = mcqItem.subjectName == null ? "" : mcqItem.subjectName,
                        };

                        questionExList.Add(questionEx);
                    }
                }
            }

            return questionExList;
        }


        [HttpPost]
        [Route("[action]")]
        private async Task<GifDataResponse> GetARVOContentGifApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, string module, string userEmail, string device)
        {

            GifDataResponse res = new GifDataResponse();

            GifData rs = new GifData();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device

            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<GifDataResponse>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<GifDataResponse>(responseData);
                    }

                }
            }
            return res;

        }



        [HttpPost]
        [Route("[action]")]
        private async Task<GifDataResponse> GetARVOContenttestYourSelfApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string module, string userEmail, string device)
        {

            GifDataResponse res = new GifDataResponse();

            GifData rs = new GifData();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                ids = frontendTopicIds,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device

            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<GifDataResponse>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<GifDataResponse>(responseData);
                    }

                }
            }
            return res;

        }
        [HttpPost]
        [Route("[action]")]
        private async Task<GifDataResponse> GetARVOContentGifApiMobileApp(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, int? subjectId, string module, string userEmail, string device)
        {

            GifDataResponse res = new GifDataResponse();

            GifData rs = new GifData();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                subjectId = subjectId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device

            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<GifDataResponse>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<GifDataResponse>(responseData);
                    }

                }
            }
            return res;

        }

        [HttpPost]
        [Route("[action]")]
        private async Task<GameDataResponse> GetARVOContentGameApi(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, string module, string userEmail, string device)
        {

            GameDataResponse res = new GameDataResponse();

            // GifData rs = new GifData();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<GameDataResponse>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<GameDataResponse>(responseData);
                    }

                }
            }
            return res;

        }





        [HttpPost]
        [Route("[action]")]
        private async Task<GameDataResponse> GetARVOContentGameApiMobileApp(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, int? subjectId, string module, string userEmail, string device)
        {

            GameDataResponse res = new GameDataResponse();

            // GifData rs = new GifData();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                referenceType = referenceType,
                referenceId = referenceId,
                subjectId = subjectId,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<GameDataResponse>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<GameDataResponse>(responseData);
                    }

                }
            }
            return res;

        }



        [HttpPost]
        [Route("[action]")]
        private async Task<ResponseBlanks>
        GetARVOContentFillinBlanksMobileApp(ARVOConfiguration _config, string organization, List<int> frontendTopicIds, string contentType, string referenceType, string referenceId, int? subjectId, string module, string userEmail, string device)
        {

            ResponseBlanks res = new ResponseBlanks();

            // GifData rs = new GifData();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                contentIds = frontendTopicIds,
                contentType = contentType,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<ResponseBlanks>(responseData);
                    // rs = new List<VideoData> { res.Data };

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<ResponseBlanks>(responseData);
                    }

                }
            }
            return res;

        }





        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetSubjectsByPeogramCombo([FromBody] Predicate model)
        {

            //var courseid = new Guid(model.ProvidedString.Split("?")[0]);
            var board = model.ProvidedString.Split("?")[0];
            var classid = (model.ProvidedString.Split("?")[1]);
            if (classid == "Pre1stYear")
                classid = "Pre 1st Year";
            var classdata = this.db.SetupClass.FirstOrDefault(e => e.FullName == classid).ClassCode;
            //var subjectName = this.db.RegistrationCourse.FirstOrDefault(e => e.CourseId == courseid).FullName;
            var emsboard = GetEMSBoard(board);
            var boardcode = this.db.Boards.FirstOrDefault(e => e.FullName == emsboard).Abbreviation;


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            //int programComboId = Convert.ToInt32(parts[0]);
            //int subjectId = Convert.ToInt32(parts[1]);
            string organization = parts[2];
            string contentType = parts[3];
            bool isPastPaper = Convert.ToBoolean(parts[4]);

            string eluserid = parts[5];
            string elclid = parts[6];
            string subjectName = parts[7];

            string module = parts[8];
            string userEmail = parts[9];
            string device = parts[10];

            // Optional parameter: program name (e.g. "Pre DIT-PHY (Morning-English)")
            string programName = parts.Length > 11 && !string.IsNullOrWhiteSpace(parts[11]) ? parts[11].Trim() : string.Empty;


            if (subjectName == "Islamiyat")
            {
                subjectName = "Islamiat";
            }



            if (subjectName == "Islamic Studies")
            {
                subjectName = "Islamiat";
            }

            if (subjectName == "Translation of Holy Quran")
            {
                subjectName = "Tarjama Tul Quran";
            }


            var arvoCourse = this.db.ArvoCourses.FirstOrDefault(e => e.CourseName == subjectName);
            string arvoSubject = null;
            if (arvoCourse != null && !string.IsNullOrEmpty(arvoCourse.ClassIds))
            {

                var classIdList = arvoCourse.ClassIds.Split(',');
                if (classIdList.Contains(classid.ToString()))
                {
                    arvoSubject = arvoCourse.CourseName;
                }
            }
            var arvoBoards = this.db.ArvoDataBoards.FirstOrDefault(e => e.Abbreviation == boardcode && e.ClassIds.Contains(classid.ToString()))?.FullName;

            ARVOConfiguration _config = new ARVOConfiguration();

            if (!string.IsNullOrEmpty(arvoSubject) && !string.IsNullOrEmpty(arvoBoards))
            {




                ChapterAndTopicsReq value = new ChapterAndTopicsReq();

                // Check ArvoReferenceSubject for subject name override
                var refSubjectCombo = this.db.ArvoReferenceSubject.FirstOrDefault(e => e.Subject == subjectName);
                var arvoSubjectNameCombo = refSubjectCombo != null ? refSubjectCombo.ReferenceSubject : subjectName;
                var originalSubjectNameCombo = subjectName;

                // DIT override: if programName contains "dit" and class is Pre 1st Year
                if (!string.IsNullOrEmpty(programName) &&
                    programName.IndexOf("dit", StringComparison.OrdinalIgnoreCase) >= 0 &&
                    (classid == "Pre 1st Year" || classid == "Pre1stYear"))
                {
                    value = new ChapterAndTopicsReq
                    {
                        programCamboKey = "11-PreDIT-S1-E",
                        subjectName = arvoSubjectNameCombo
                    };
                }
                else if (classdata == "10")
                {
                    value = new ChapterAndTopicsReq
                    {
                        programCamboKey = $"11-Pre-{boardcode}-E",
                        subjectName = arvoSubjectNameCombo
                    };
                }
                else
                {
                    value = new ChapterAndTopicsReq
                    {
                        programCamboKey = $"{classdata}-Inter-{boardcode}-E",
                        subjectName = arvoSubjectNameCombo
                    };
                }
                GenericResponse<ChapterTest> response = new GenericResponse<ChapterTest>();
                ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
                HttpClient client = new HttpClient();


                try
                {
                    // var samsdata = this.db.ARVOConfiguration.Where(e => e.FullName == "ProgramComboAndSubListURL");
                    // _config = samsdata.FirstOrDefault(e => e.FullName == "ProgramComboAndSubListURL");

                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "ProgramComboAndSubListURL");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    string apiUrl, accessToken = string.Empty;


                    if (_config != null)
                    {
                        apiUrl = _config.BaseURL + _config.APIURL;
                        accessToken = _config.ARVOAccessToken;

                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                        HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                        if (response1.StatusCode.ToString() != "Unauthorized")
                        {
                            string responseData = await response1.Content.ReadAsStringAsync();
                            resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                        }
                        else
                        {
                            _config = await ARVOLoginEx(_config);
                            accessToken = _config.ARVOAccessToken;

                            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                            HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                            string responseData = await response2.Content.ReadAsStringAsync();
                            resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                        }
                    }
                    else
                    {
                        response.Code = "400";
                        response.Message = "No ARVO Configuration Found. Please contact system administrator";

                        return Ok(response.Message);
                    }


                    List<ProgramCombo> pgmCombos = new List<ProgramCombo>();
                    pgmCombos = resp.Data.ProgramCombos;

                    List<Subject> sub = new List<Subject>();
                    sub = resp.Data.Subjects;

                    int targetProgramId = 0;
                    int targetSubjectId = 0;
                    ProgramCombo targetProgram = pgmCombos.FirstOrDefault(program => program.Name.ToLower() == value.programCamboKey.ToLower());
                    Subject targetSubject = sub.FirstOrDefault(subject => subject.Name.Trim().ToLower() == value.subjectName.Trim().ToLower());

                    if (targetProgram != null)
                    {
                        targetProgramId = targetProgram.Id;
                    }
                    else
                    {
                        response.Code = "400";
                        response.Message = "No Program Combo Found.";

                        return Ok(response.Message);
                    }

                    if (targetSubject != null)
                    {
                        targetSubjectId = targetSubject.Id;
                    }
                    else
                    {
                        response.Code = "400";
                        response.Message = "No Subject Found";

                        return Ok(response.Message);
                    }

                    response.Code = "200";
                    response.Message = "Success";

                    var res = await GetARVOContentByProgramComboAndSubject(_config, targetProgramId, targetSubjectId, organization, contentType, isPastPaper, module, userEmail, device, originalSubjectNameCombo);

                    if (contentType == "4" || contentType == "MCQs")
                    {
                        res = UpdateAttemptedMCQ(res, new Guid(eluserid), isPastPaper);
                    }


                    foreach (var item in res)
                    {
                        item.IsArvo = true;
                    }

                    return Ok(res);

                }
                catch (Exception ex)
                {
                    response.Code = "500";
                    response.Message = ex.Message;
                    return Ok(ex.Message);
                }

                finally
                {
                    client.Dispose();
                }


            }


            else
            {
                if (contentType != "Videos")
                {
                    var res = GetELMCQContent(_config, eluserid, elclid, contentType, isPastPaper, module, userEmail, device).Result;
                    res = UpdateOrderNumber(res);
                    res = UpdateAttemptedMCQ(res, new Guid(eluserid), isPastPaper);
                    return Ok(res);
                }

                else
                {
                    var res = GetELVideoContent(_config, eluserid, elclid, module, userEmail, device).Result;
                    res = UpdateOrderNumber(res);
                    return Ok(res);
                }
            }

            // return response;
        }





        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetSubjectsByPeogramComboNew([FromBody] Predicate model)
        {




            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');

            string eluserid = parts[0];
            string elclid = parts[1];
            string module = parts[2];
            string userEmail = parts[3];
            string device = parts[4];



            ARVOConfiguration _config = new ARVOConfiguration();


            var res = GetELVideoContent(_config, eluserid, elclid, module, userEmail, device).Result;
            res = UpdateOrderNumber(res);
            return Ok(res);

        }




        //     private List<MapChapterData> UpdateAttemptedMCQ(List<MapChapterData> response, Guid userid, bool isPastPaper)
        //     {
        //         var percentage = -2;
        //         if (isPastPaper == true)
        //         {
        //             percentage = -1;
        //         }
        //         foreach (var item in response)
        //         {
        //             if (item.FullName != null)
        //             {
        //                 var data = this.db.McqAttempted
        // .Where(e => e.TopicId == item.Id && e.UserId == userid && e.Percentage == percentage)
        // .OrderByDescending(e => e.OperationOn)
        // .FirstOrDefault();
        //                 if (data != null)
        //                 {
        //                     item.MaxWatched = data.Duration;
        //                 }
        //             }
        //         }
        //         return response;
        //     }


        private List<MapChapterData> UpdateAttemptedMCQ(List<MapChapterData> response, Guid userId, bool isPastPaper)
        {
            foreach (var item in response)
            {
                if (item.FullName != null)
                {
                    // Find UserMcqResponse record for this topic and user
                    var userMcq = db.UserMcqResponse
                        .FirstOrDefault(e => e.TopicId == item.Id && e.UserId == userId);

                    if (userMcq != null && !string.IsNullOrEmpty(userMcq.Operations))
                    {
                        var operations = JsonConvert.DeserializeObject<List<McqOperation>>(userMcq.Operations);

                        if (isPastPaper)
                        {
                            var correctAnswersCount = operations
                                .Where(op => op.IsPastPaper == isPastPaper && op.Answer == true)
                                .Count();

                            item.MaxWatched = correctAnswersCount;
                        }
                        else
                        {
                            var correctAnswersCount = operations
                              .Where(op => op.Answer == true)
                              .Count();

                            item.MaxWatched = correctAnswersCount;
                        }
                    }
                    else
                    {
                        item.MaxWatched = 0;
                    }
                }
            }

            return response;
        }


        private List<MapChapterData> UpdateOrderNumber(List<MapChapterData> response)
        {
            foreach (var item in response)
            {
                if (item.FullName != null)
                {
                    // Extract the digit from the fullName
                    var match = System.Text.RegularExpressions.Regex.Match(item.FullName, @"\d+");
                    if (match.Success)
                    {
                        item.OrderNumber = int.Parse(match.Value);
                    }
                }
            }
            return response;
        }



        public async Task<List<MapChapterData>> GetARVOContentByProgramComboAndSubject(ARVOConfiguration _config, int programComboId, int subjectId, string organization, string contentType, bool isPastPaper, string module, string userEmail, string device, string originalSubjectName = null)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            // ARVOConfiguration _config = new ARVOConfiguration();
            ResponsProgramConboChaptere res = new ResponsProgramConboChaptere();
            MapChapterData responseNew1 = new MapChapterData();

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 13);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "13");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    // apiUrl = _config.BaseURL + _config.APIURL;
                    // accessToken = _config.ARVOAccessToken;

                    // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    // HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                    // if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                    // {
                    //     string responseData = await response1.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                    // else
                    // {
                    //     _config = await ARVOLoginEx(_config);
                    //     accessToken = _config.ARVOAccessToken;

                    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    //     HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                    //     string responseData = await response2.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                }
                else
                {
                    responseNew1.FullName = "No Configuration found for this Arvo Api.";
                    return new List<MapChapterData> { responseNew1 };
                }


                apiUrl = $"{_config.BaseURL + _config.APIURL}";

                var requestbody = new
                {
                    programComboId = programComboId,
                    subjectId = subjectId,
                    organization = organization,
                    contentType = contentType,
                    isPastPaper = isPastPaper,
                    userEmail = userEmail,
                    module = module,
                    organizationCode = organization,
                    device = device,
                    includeTopicDetail = true
                };

                string jsonRequest = JsonConvert.SerializeObject(requestbody);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<ResponsProgramConboChaptere>(responseData);

                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<ResponsProgramConboChaptere>(responseData);
                    }

                }

                //if(res.Data.Count > 0)
                //{
                var questionExList = MapContentToChapterData(res.Data, originalSubjectName);
                return questionExList.OrderBy(e => e.OrderNumber).ToList();

                //}
                //else
                //{
                //    var samsdata1 = this.db.ARVOConfiguration.Where(e => e.srNo == 14);
                //    _config = samsdata1.FirstOrDefault();

                //    string apiUrl1 = $"{_config.BaseURL + _config.APIURL}"; 
                //}




            }
            catch (Exception ex)
            {
                responseNew1.FullName = ex.Message;
                return new List<MapChapterData> { responseNew1 };
            }
            finally
            {
                client.Dispose();
            }


        }

        public async Task<List<MapChapterData>> GetELMCQContent(ARVOConfiguration _config, string userid, string clid, string contentType, bool isPastPaper, string module, string userEmail, string device)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            // ARVOConfiguration _config = new ARVOConfiguration();
            List<MapChapterData> res = new List<MapChapterData>();
            MapChapterData responseNew1 = new MapChapterData();

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 14);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "14");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {

                    var qtype = GetQuestionTypeId(contentType);



                    apiUrl = $"{_config.BaseURL + _config.APIURL}";

                    var requestbody = new
                    {
                        val = userid + ":" + clid + ":" + isPastPaper + ":" + qtype,
                        userEmail = userEmail,
                        module = module,
                        organizationCode = "CMS",
                        device = device
                    };

                    string jsonRequest = JsonConvert.SerializeObject(requestbody);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");



                    HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<List<MapChapterData>>(responseData);

                    }

                    return res;






                }
                return new List<MapChapterData> { responseNew1 };
            }
            catch (Exception ex)
            {
                responseNew1.FullName = ex.Message;
                return new List<MapChapterData> { responseNew1 };
            }
            finally
            {
                client.Dispose();
            }


        }


        public async Task<List<MapChapterData>> GetELVideoContent(ARVOConfiguration _config, string userid, string clid, string module, string userEmail, string device)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            // ARVOConfiguration _config = new ARVOConfiguration();
            List<MapChapterData> res = new List<MapChapterData>();
            MapChapterData responseNew1 = new MapChapterData();

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 15);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "15");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    apiUrl = $"{_config.BaseURL + _config.APIURL}";

                    var requestbody = new
                    {
                        val = userid + ":" + clid,
                        userEmail = userEmail,
                        module = module,
                        organizationCode = "CMS",
                        device = device
                    };

                    string jsonRequest = JsonConvert.SerializeObject(requestbody);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                    HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<List<MapChapterData>>(responseData);

                    }

                    return res;






                }
                return new List<MapChapterData> { responseNew1 };
            }
            catch (Exception ex)
            {
                responseNew1.FullName = ex.Message;
                return new List<MapChapterData> { responseNew1 };
            }
            finally
            {
                client.Dispose();
            }


        }


        public static int GetQuestionTypeId(string questionType)
        {
            switch (questionType)
            {
                case "MCQs":
                    return 1;
                case "ShortQuestions":
                    return 2;
                case "LongQuestions":
                    return 3;
                default:
                    throw new ArgumentException("Invalid question type");
            }
        }


        public static string GetEMSBoard(string board)
        {
            switch (board)
            {
                case "Punjab Boards":
                    return "Punjab Boards";
                case "Punjab Board":
                    return "Punjab Boards";
                case "KPK Boards":
                    return "Khyber Pakhtoon Khwa Board";
                case "KPK Board":
                    return "Khyber Pakhtoon Khwa Board";
                case "Federal Board":
                    return "Federal Board";
                case "Federal Boards":
                    return "Federal Board";
                case "AJK Board":
                    return "Azad Jammu Kashmir Board";
                case "AJK Boards":
                    return "Azad Jammu Kashmir Board";
                default:
                    throw new ArgumentException("Invalid question type");
            }
        }

        public List<MapChapterData> MapContentToChapterData(List<ProgramCoboContent> shortDataList, string originalSubjectName = null)
        {
            var questionExList = new List<MapChapterData>();

            if (shortDataList != null)
            {
                // Filter by organizationSubjectCode if originalSubjectName is provided
                var filteredList = shortDataList;
                if (!string.IsNullOrEmpty(originalSubjectName))
                {
                    var filtered = shortDataList.Where(c =>
                        string.IsNullOrEmpty(c.organizationSubjectCode) ||
                        c.organizationSubjectCode.Trim().Equals(originalSubjectName.Trim(), StringComparison.OrdinalIgnoreCase)
                    ).ToList();

                    if (filtered.Any())
                        filteredList = filtered;
                }

                foreach (var shrtData in filteredList)
                {
                    if (shrtData != null)
                    {
                        var totalContentIdsCount = shrtData.Content?.Sum(content => content.ContentIds?.Count ?? 0) ?? 0;
                        var questionEx = new MapChapterData
                        {
                            Id = shrtData.ChapterId.ToString(),
                            FullName = shrtData.ChapterName,
                            MaxWatched = 0,
                            Remaining = totalContentIdsCount,
                            OrderNumber = shrtData.ChapterNumber,
                            Content = shrtData.Content,
                            sloBased = shrtData.sloBased,
                            TopicContent = shrtData.TopicContent,

                        };

                        questionExList.Add(questionEx);
                    }
                }
            }

            return questionExList;
        }



        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<GenericResponse<TopicContentVir>> GetARVOTopicViewApi([FromBody] Predicate model)
        {

            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string frontendTopic = parts[1];
            string module = parts[2];
            string userEmial = parts[3];
            string device = parts[4];

            //string[] topicParts = frontendTopic.Split(',');
            //List<int> frontendTopicIds = new List<int>();
            //frontendTopicIds = topicParts.Select(int.Parse).ToList();



            string[] topicParts = frontendTopic.Split(',');
            List<string> frontendTopicIds = new List<string>();
            //List<Guid> frontendTopicUuids = new List<Guid>();
            frontendTopicIds = topicParts.ToList();


            //bool allAreInts = frontendTopicIds.All(t => int.TryParse(t, out _));
            //bool allAreGuids = topicParts.All(t => Guid.TryParse(t, out _));

            //if (allAreInts)
            //{
            //    frontendTopicIds = topicParts.Select(int.Parse).ToList();
            //}
            //else
            //{
            //    frontendTopicIds = topicParts.Select(Guid.Parse).ToList();
            //}



            GenericResponse<TopicContentVir> response = new GenericResponse<TopicContentVir>();

            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();
            // var samsdata = this.db.ARVOConfiguration.Where(e => e.FullName == "AcademicCalendarTopicTree");
            // _config = samsdata.FirstOrDefault(e => e.FullName == "AcademicCalendarTopicTree");

            string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "AcademicCalendarTopicTree");
            var samsdata = this.db.ARVOConfiguration.FromSql(json);
            _config = samsdata.FirstOrDefault();

            string apiUrl, accessToken = string.Empty;

            try
            {



                if (_config != null)
                {
                    // apiUrl = _config.BaseURL + _config.APIURL;
                    // accessToken = _config.ARVOAccessToken;

                    // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    // HttpResponseMessage response1 = client.GetAsync(apiUrl).Result;

                    // if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                    // {
                    //     string responseData = response1.Content.ReadAsStringAsync().Result;
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                    // else
                    // {
                    //     _config = ARVOLoginEx(_config).Result;
                    //     accessToken = _config.ARVOAccessToken;

                    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    //     HttpResponseMessage response2 = client.GetAsync(apiUrl).Result;

                    //     string responseData = response2.Content.ReadAsStringAsync().Result;
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                }
                else
                {
                    response.Code = "400";
                    response.Message = "No ARVO Configuration Found. Please contact system administrator";

                    return response;
                }
                response.Code = "200";
                response.Message = "Success";
                Console.WriteLine("response");
                Console.WriteLine(response);
                var resdata = await GetARVOTopicView(_config, organization, frontendTopicIds, module, userEmial, device);
                response.data = resdata;



            }
            catch (Exception ex)
            {
                response.Code = "500";
                response.Message = ex.Message;
            }
            finally
            {
                client.Dispose();
            }

            return response;
        }


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]

        private async Task<List<TopicContentVir>> GetARVOTopicView(ARVOConfiguration _config, string organization, List<string> frontendTopicIds, string module, string userEmail, string device)
        {
            ApiResponse resp = new ApiResponse();
            List<TopicContent> resp1 = new List<TopicContent>();

            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            bool allAreInts = frontendTopicIds.All(t => int.TryParse(t, out _));

            if (allAreInts)
            {

                var requestbody = new
                {
                    organization = organization,
                    frontendTopicIds = frontendTopicIds,
                    userEmail = userEmail,
                    module = module,
                    organizationCode = organization,
                    device = device
                };


                string jsonRequest = JsonConvert.SerializeObject(requestbody);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<ApiResponse>(responseData);

                    }
                    else
                    {
                        _config = await ARVOLoginEx(_config);
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                        HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                        if (response1.IsSuccessStatusCode)
                        {
                            string responseData = await response1.Content.ReadAsStringAsync();
                            resp = JsonConvert.DeserializeObject<ApiResponse>(responseData);
                        }

                    }
                }

                resp1 = resp.Data;



                return TopicParser(resp1);
            }
            else
            {

                List<TopicContentVir> EmsTopicDetailexList = new List<TopicContentVir>();


                for (int i = 0; i < frontendTopicIds.Count; i++)
                {
                    var calendarItem = new Guid(frontendTopicIds[i]);

                    var topicdata = this.db.ELTopics.FirstOrDefault(e => e.TopicId == calendarItem);
                    if (topicdata != null)
                    {
                        TopicContentVir EmsTopicDetailex = new TopicContentVir
                        {
                            FrontEndTopicId = topicdata.TopicId.ToString(),
                            TopicName = topicdata.Title,
                            BookId = null,
                            BookName = null,
                            Language = null,
                            Sequence = null,
                            ParentId = null,
                            FrontendTopicContents = new List<TopicContentVir>(),
                            TotalMcqsCount = 0,
                            TotalShortQuestionCount = 0,
                            TotalLongQuestionCount = 0,
                            TotalVideosCount = 0,
                            TotalExamCount = 0,
                        };
                        EmsTopicDetailexList.Add(EmsTopicDetailex);

                    }
                }

                return EmsTopicDetailexList;

            }
        }


        public List<TopicContentVir> TopicParser(List<TopicContent> list)
        {
            List<TopicContentVir> EmsTopicDetailexList = new List<TopicContentVir>();
            foreach (var obj in list)
            {
                TopicContentVir EmsTopicDetailex = new TopicContentVir
                {
                    FrontEndTopicId = obj.FrontEndTopicId.ToString(),
                    TopicName = obj.TopicName,
                    BookId = obj.BookId,
                    BookName = obj.BookName,
                    Language = obj.Language,
                    Sequence = obj.Sequence,
                    ParentId = obj.ParentId,
                    FrontendTopicContents = TopicParser(obj.FrontendTopicContents),
                    TotalMcqsCount = obj.TotalMcqsCount,
                    TotalShortQuestionCount = obj.TotalShortQuestionCount,
                    TotalLongQuestionCount = obj.TotalLongQuestionCount,
                    TotalVideosCount = obj.TotalVideosCount,
                    TotalExamCount = obj.TotalExamCount,
                };
                EmsTopicDetailexList.Add(EmsTopicDetailex);
            }

            return EmsTopicDetailexList;


        }





        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<GenericResponse<QRData>> GetARVOQRCode([FromBody] Predicate model)
        {


            GenericResponse<QRData> response = new GenericResponse<QRData>();
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string userEmail = parts[1];
            Guid qrCodeId = new Guid(parts[2]);
            string bookHashes = parts[3];
            bookHashes = bookHashes.Replace("[", "").Replace(" ", "").Replace("]", "");
            string platform = parts[4];
            string module = parts[5];
            string device = parts[6];

            string[] topicParts = bookHashes.Split(',');
            List<string> bookHasheslist = new List<string>(topicParts);


            try
            {
                //var samsdata = arvorepositoryEx.All();
                // _config = this.db.ARVOConfiguration.FirstOrDefault(e => e.srNo == 6);

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "6");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    // apiUrl = _config.BaseURL + _config.APIURL;
                    // accessToken = _config.ARVOAccessToken;

                    // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    // HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                    // if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                    // {
                    //     string responseData = await response1.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                    // else
                    // {
                    //     _config = await ARVOLoginEx(_config);
                    //     accessToken = _config.ARVOAccessToken;

                    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    //     HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                    //     string responseData = await response2.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                }
                else
                {
                    response.Code = "400";
                    response.Message = "No ARVO Configuration Found. Please contact system administrator";

                    return response;
                }
                response.Code = "200";
                response.Message = "Success";
                Console.WriteLine("response");
                Console.WriteLine(response);
                QRResponse resdata = await GetARVOQRCodeApi(_config, organization, userEmail, qrCodeId, bookHasheslist, platform, module, device);

                response.Message = resdata.Message;
                response.Code = resdata.HttpStatusCode.ToString();
                //response.data = new List<QuestionMcQEx> { resdata };
                // string jsonString = System.Text.Json.JsonSerializer.Serialize(resdata, new JsonSerializerOptions { WriteIndented = true });
                //Console.WriteLine(jsonString);
                //var questionExList = new List<QRResponse> { jsonString };
                //  QRResponse res = new List<QRResponse> { jsonString };
                if (resdata.Data != null && resdata.Data.Attachments != null)
                {
                    foreach (var item in resdata.Data.Attachments)
                    {
                        if (item.AttachmentTypeId == 1)
                        {
                            var testYourself = new Cms360.Data.Model.Content();
                            testYourself.ContentType = "TestYourSelf";
                            testYourself.ContentIds = item.AttachmentIds;
                            resdata.Data.Content.Add(testYourself);
                        }

                    }
                }

                response.data = new List<QRData> { resdata.Data };

                //string jsonString = System.Text.Json.JsonSerializer.Serialize(resdata, new JsonSerializerOptions { WriteIndented = true });
                //Console.WriteLine(jsonString);
                //response.data = new List<QRData> { resdata };
            }
            catch (Exception ex)
            {
                response.Code = "500";
                response.Message = ex.Message;
            }
            finally
            {
                client.Dispose();
            }

            return response;
        }




        [HttpPost]
        [Route("[action]")]
        private async Task<QRResponse> GetARVOQRCodeApi(ARVOConfiguration _config, string organization, string userEmail, Guid qrCodeId, List<string> bookHashes, string platform, string module, string device)
        {
            QRResponse resp = new QRResponse();


            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organization = organization,
                userEmail = userEmail,
                qrCodeId = qrCodeId,
                bookHashes = bookHashes,
                platform = platform,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<QRResponse>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<QRResponse>(responseData);
                    }

                }
            }



            return resp;

        }










        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetARVOEbooks([FromBody] Predicate model)
        {
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();

            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string userEmail = parts[1];
            string module = parts[2];
            string device = parts[3];

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 10);
                // _config = samsdata.FirstOrDefault();

                IntModel[] res = (this.db.IntModel.FromSql(String.Format(@"SELECT * FROM ""Message"".""CheckEbookUser"" ('{0}') as val", userEmail))).ToArray<IntModel>();


                if (res[0].val > 0)
                {

                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "10");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    if (_config == null)
                    {
                        return Ok("No ARVO Configuration Found. Please contact system administrator.");
                    }

                    // Call the API to get the ebook data
                    EbooksData resdata = await GetARVOQREbookApi(_config, organization, userEmail, module, device);

                    // Create a new list to hold the transformed SubjectBooks
                    var transformedSubjectBooks = new List<SubjectBook>();

                    // Loop through each SubjectBook and separate each BookHash into its own SubjectBook
                    foreach (var subjectBook in resdata.SubjectBooks)
                    {
                        foreach (var book in subjectBook.BookHashes)
                        {
                            // Create a new SubjectBook for each BookHash
                            transformedSubjectBooks.Add(new SubjectBook
                            {
                                Subject = subjectBook.Subject,
                                BookHashes = new List<BookHash> { book }
                            });
                        }
                    }

                    // Replace the original SubjectBooks with the transformed list
                    resdata.SubjectBooks = transformedSubjectBooks;

                    // Return the modified response
                    return Ok(new List<EbooksData> { resdata });
                }

                else
                {
                    return Ok(new List<EbooksData>());
                }
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
            finally
            {
                client.Dispose();
            }
        }






        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetARVOEbooksNew([FromBody] Predicate model)
        {
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();

            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string userEmail = parts[1];
            string userClass = parts[2];
            string module = parts[3];
            string device = parts[4];

            var classCode = "";
            if (userClass.Trim() == "Part-I")
            {
                classCode = "11";
            }
            else if (userClass.Trim() == "Part-II")
            {
                classCode = "12";
            }
            else
            {
                classCode = "11";
            }

            try
            {
                IntModel[] res = (this.db.IntModel.FromSql(String.Format(@"SELECT * FROM ""Message"".""CheckEbookUser"" ('{0}') as val", userEmail))).ToArray<IntModel>();


                if (res[0].val > 0)
                {

                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "10");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    if (_config == null)
                    {
                        return Ok("No ARVO Configuration Found. Please contact system administrator.");
                    }

                    // Call the API to get the ebook data
                    EbooksData resdata = await GetARVOQREbookApi(_config, organization, userEmail, module, device);

                    // Create a new list to hold the transformed SubjectBooks
                    var transformedSubjectBooks = new List<SubjectBook>();

                    // Loop through each SubjectBook and separate each BookHash into its own SubjectBook
                    if (resdata.SubjectBooks != null && resdata.SubjectBooks.Count > 0)
                    {
                        foreach (var subjectBook in resdata.SubjectBooks)
                        {
                            foreach (var book in subjectBook.BookHashes)
                            {
                                if (!string.IsNullOrEmpty(book.ProgramCombo))
                                {
                                    var code = book.ProgramCombo.Split('-')[0];


                                    if (code == classCode)
                                    {
                                        transformedSubjectBooks.Add(new SubjectBook
                                        {
                                            Subject = subjectBook.Subject,
                                            BookHashes = new List<BookHash> { book }
                                        });
                                    }

                                }
                                else
                                {
                                    transformedSubjectBooks.Add(new SubjectBook
                                    {
                                        Subject = subjectBook.Subject,
                                        BookHashes = new List<BookHash> { book }
                                    });
                                }
                            }
                        }

                        // Replace the original SubjectBooks with the transformed list
                        resdata.SubjectBooks = transformedSubjectBooks;
                    }
                    // Return the modified response
                    return Ok(new List<EbooksData> { resdata });
                }

                else
                {
                    return Ok(new List<EbooksData>());
                }
            }
            catch (Exception ex)
            {
                return Ok(ex);
            }
            finally
            {
                client.Dispose();
            }
        }




        [HttpPost]
        [Route("[action]")]
        private async Task<EbooksData> GetARVOQREbookApi(ARVOConfiguration _config, string organization, string userEmail, string module, string device)
        {
            EbookApiResponse resp = new EbookApiResponse();


            string apiUrl = $"{_config.BaseURL + _config.APIURL}";

            var requestbody = new
            {
                organizationCode = organization,
                email = userEmail,
                userEmail = userEmail,
                module = module,
                organization = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestbody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    resp = JsonConvert.DeserializeObject<EbookApiResponse>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        resp = JsonConvert.DeserializeObject<EbookApiResponse>(responseData);
                    }

                }
            }



            return resp.Data;

        }



        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetFindByAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ELChapters).Assembly);
            Expression<Func<ELChapters, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ELChapters, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.FindByAsync(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddOne([FromBody] ELChapters entity)
        {
            this.repository.Add(entity);

            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddOneAsync([FromBody] ELChapters entity)
        {
            await this.repository.AddAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Insert Async"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AddMany([FromBody] IEnumerable<ELChapters> entities)
        {
            this.repository.AddAll(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> AddManyAsync([FromBody] IEnumerable<ELChapters> entities)
        {
            await this.repository.AddAllAsync(entities);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entities), "Insert Multi Async")); ;
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Update([FromBody] ELChapters entity)
        {
            this.repository.Update(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> UpdateAsync([FromBody] ELChapters entity)
        {
            await this.repository.UpdateAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Update Async"));
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Delete([FromBody] ELChapters entity)
        {
            this.repository.Delete(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteAsync([FromBody] ELChapters entity)
        {
            await this.repository.DeleteAsync(entity);
            return Ok(this.log.Insert(JsonConvert.SerializeObject(entity), "Delete Async"));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhere([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ELChapters).Assembly);
            Expression<Func<ELChapters, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ELChapters, bool>>(predicate.ProvidedString, options));

            return Ok(this.repository.DeleteWhere(discountFilterExpression));
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> DeleteWhereAsync([FromBody] Predicate predicate)
        {
            var options = ScriptOptions.Default.AddReferences(typeof(ELChapters).Assembly);
            Expression<Func<ELChapters, bool>> discountFilterExpression = FuncToExpression(await CSharpScript.EvaluateAsync<Func<ELChapters, bool>>(predicate.ProvidedString, options));

            return Ok(await this.repository.DeleteWhereAsync(discountFilterExpression));
        }



        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetAcademicCalendarARVOContent([FromBody] Predicate model)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            string providedString = model.ProvidedString;
            string[] parts = providedString.Split('?');
            string organization = parts[0];
            string frontendTopics = parts[1];
            string contentType = parts[2];
            string module = parts[3];
            string userEmail = parts[4];
            string device = parts[5];





            string[] topicParts = frontendTopics.Split(',');
            List<int> frontendTopicIds = new List<int>();
            List<Guid> frontendTopicUuids = new List<Guid>();

            bool allAreInts = topicParts.All(t => int.TryParse(t, out _));
            bool allAreGuids = topicParts.All(t => Guid.TryParse(t, out _));

            if (allAreInts)
            {
                frontendTopicIds = topicParts.Select(int.Parse).ToList();
            }
            else if (allAreGuids)
            {
                frontendTopicUuids = topicParts.Select(Guid.Parse).ToList();
            }
            else
            {
                var responseNew = "There are no Videos for this Topic.";
                return Ok(responseNew);
            }


            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 7);
                // _config = samsdata.FirstOrDefault();

                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "7");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();


                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    // apiUrl = _config.BaseURL + _config.APIURL;
                    // accessToken = _config.ARVOAccessToken;

                    // client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    // HttpResponseMessage response1 = await client.GetAsync(apiUrl);

                    // if (response1.StatusCode.ToString() != "Unauthorized" && response1.ReasonPhrase == "OK")
                    // {
                    //     string responseData = await response1.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                    // else
                    // {
                    //     _config = await ARVOLoginEx(_config);
                    //     accessToken = _config.ARVOAccessToken;

                    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    //     HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                    //     string responseData = await response2.Content.ReadAsStringAsync();
                    //     resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    // }
                }
                else
                {

                    var responseNew1 = "No Configuration found for this Arvo Api.";
                    return Ok(responseNew1);
                }


                VideoDataResponseEx resdata = new VideoDataResponseEx();

                if (frontendTopicIds.Count > 0)
                {
                    resdata = await GetAcademicARVOContentVideoApi(_config, organization, frontendTopicIds, contentType, module, userEmail, device);
                    var questionExList = AcademicMapVideoData(new List<VideoDataResponseEx> { resdata });
                    return Ok(questionExList);
                }
                else
                {
                    string frontendTopicUuidsString = string.Join(",", frontendTopicUuids);


                    string sql = string.Format(@"SELECT * FROM ""EL"".""GetCMSVideosByMultipleTopics"" ('{0}')", frontendTopicUuidsString);

                    var result = this.db.MapCMSVideoData.FromSql(sql).ToList<MapCMSVideoData>();
                    return Ok(result);
                }






            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
            finally
            {
                client.Dispose();
            }


        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public IActionResult GetAllEMSSubjects([FromBody] Predicate model)

        {
            var admissionformid = new Guid(model.ProvidedString.Split("?")[0]);
            var clasid = new Guid(model.ProvidedString.Split("?")[1]);
            // IDbConnection connection = db.Database.GetDbConnection();

            string sql = String.Format(@"select * from ""EL"".""getstudentsubjects""('{0}','{1}')", admissionformid, clasid);
            // Console.WriteLine(json);
            // if (connection.State == ConnectionState.Closed)
            //     connection.Open();
            // var data = connection.Query<StudentCourseList>(json).ToList();
            // if (connection.State == ConnectionState.Open)
            // {
            //     connection.Close();
            //     connection.Dispose();
            // }
            return Ok(db.StudentCourseList.FromSql(sql));


        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public IActionResult GetAllBoards()

        {


            string sql = String.Format(@"select * from ""EL"".""GetBoards""()");
            // Console.WriteLine(json);
            // if (connection.State == ConnectionState.Closed)
            //     connection.Open();
            // var data = connection.Query<StudentCourseList>(json).ToList();
            // if (connection.State == ConnectionState.Open)
            // {
            //     connection.Close();
            //     connection.Dispose();
            // }
            return Ok(db.GetBoardList.FromSql(sql));


        }

        public async Task<List<QuestionMcQEx>> GetQuestionWAnswers(ARVOConfiguration _config, string userid, string chid, int typ, string module, string userEmail, string device, string isPastPaper = "false")
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            // ARVOConfiguration _config = new ARVOConfiguration();
            List<QuestionMcQEx> res = new List<QuestionMcQEx>();
            QuestionMcQEx responseNew1 = new QuestionMcQEx();

            try
            {
                if (isPastPaper == "false")
                {
                    // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 17);
                    // _config = samsdata.FirstOrDefault();

                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "17");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    string apiUrl, accessToken = string.Empty;


                    if (_config != null)
                    {
                        apiUrl = $"{_config.BaseURL + _config.APIURL}";

                        var requestbody = new
                        {
                            val = chid + ":" + userid + ":" + typ,
                            userEmail = userEmail,
                            module = module,
                            organizationCode = "CMS",
                            device = device
                        };

                        string jsonRequest = JsonConvert.SerializeObject(requestbody);
                        var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                        HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            res = JsonConvert.DeserializeObject<List<QuestionMcQEx>>(responseData);

                        }

                        return res;


                    }



                }
                else
                {

                    // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 20);
                    // _config = samsdata.FirstOrDefault();

                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "20");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    string apiUrl, accessToken = string.Empty;


                    if (_config != null)
                    {
                        apiUrl = $"{_config.BaseURL + _config.APIURL}";

                        var requestbody = new
                        {
                            val = chid + ":0:0:" + typ
                        };

                        string jsonRequest = JsonConvert.SerializeObject(requestbody);
                        var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                        HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            res = JsonConvert.DeserializeObject<List<QuestionMcQEx>>(responseData);

                        }

                        return res;


                    }



                }

                return new List<QuestionMcQEx> { responseNew1 };
            }
            catch (Exception ex)
            {
                responseNew1.SubjectName = ex.Message;
                return new List<QuestionMcQEx> { responseNew1 };
            }
            finally
            {
                client.Dispose();
            }


        }


        public async Task<List<QuestionMcQEx>> GetQuestionWAnswersBx(ARVOConfiguration _config, string userid, string chid, int typ, string module, string userEmail, string device)
        {
            ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
            HttpClient client = new HttpClient();
            // ARVOConfiguration _config = new ARVOConfiguration();
            List<QuestionMcQEx> res = new List<QuestionMcQEx>();
            QuestionMcQEx responseNew1 = new QuestionMcQEx();

            try
            {
                // var samsdata = this.db.ARVOConfiguration.Where(e => e.srNo == 19);
                // _config = samsdata.FirstOrDefault();



                string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "19");
                var samsdata = this.db.ARVOConfiguration.FromSql(json);
                _config = samsdata.FirstOrDefault();

                string apiUrl, accessToken = string.Empty;


                if (_config != null)
                {
                    apiUrl = $"{_config.BaseURL + _config.APIURL}";

                    var requestbody = new
                    {
                        val = chid + "::" + typ,
                        userEmail = userEmail,
                        module = module,
                        organizationCode = "CMS",
                        device = device
                    };

                    string jsonRequest = JsonConvert.SerializeObject(requestbody);
                    var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                    HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                    if (response.IsSuccessStatusCode)
                    {
                        string responseData = await response.Content.ReadAsStringAsync();
                        res = JsonConvert.DeserializeObject<List<QuestionMcQEx>>(responseData);

                    }

                    return res;






                }
                return new List<QuestionMcQEx> { responseNew1 };
            }
            catch (Exception ex)
            {
                responseNew1.SubjectName = ex.Message;
                return new List<QuestionMcQEx> { responseNew1 };
            }
            finally
            {
                client.Dispose();
            }


        }


        ///////////////   Teacher App Subject List


        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> GetTeacherAppSmartLearningList([FromBody] PredicateVal model)
        {

            try
            {
                var splitValues = model.Val.Split(new[] { ":", "?" }, StringSplitOptions.RemoveEmptyEntries);
                var userId = new Guid(splitValues[0]);
                var classId = new Guid(splitValues[1]);
                var board = new string(splitValues[2]);

                var module = new string(splitValues[3]);
                var userEmail = new string(splitValues[4]);
                var device = new string(splitValues[5]);


                List<EMSSlSubjectList> res = new List<EMSSlSubjectList>();
                ChapAndTopicsResponse resp = new ChapAndTopicsResponse();
                HttpClient client = new HttpClient();
                ARVOConfiguration _config = new ARVOConfiguration();
                if (board == "Punjab Boards")
                {
                    var samsdata = this.db.ARVOConfiguration.Where(e => e.FullName == "SmartLearningProgramComboAndSubjects");
                    _config = samsdata.FirstOrDefault(e => e.FullName == "SmartLearningProgramComboAndSubjects");

                    string apiUrl, accessToken = string.Empty;

                    // if (_config != null)
                    // {
                    //     apiUrl = _config.BaseURL + _config.APIURL;
                    //     accessToken = _config.ARVOAccessToken;

                    //     client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    //     Console.WriteLine("+++++++++++++++++Arvo Calling++++++++++++");
                    //     HttpResponseMessage response1 = await client.GetAsync(apiUrl);
                    //     Console.WriteLine(response1);

                    //     if (response1.StatusCode.ToString() != "Unauthorized" || response1.StatusCode.ToString() != "MethodNotAllowed")
                    //     {
                    //         Console.WriteLine(response1.StatusCode.ToString());
                    //         string responseData = await response1.Content.ReadAsStringAsync();
                    //         resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    //     }
                    //     else
                    //     {
                    //         _config = await ARVOLoginEx(_config);
                    //         accessToken = _config.ARVOAccessToken;

                    //         client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    //         HttpResponseMessage response2 = await client.GetAsync(apiUrl);

                    //         string responseData = await response2.Content.ReadAsStringAsync();
                    //         resp = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    //     }
                    // }
                    // else
                    // {
                    //     var responseNew1 = "No Configuration found for this Arvo Api.";
                    //     return Ok(responseNew1);
                    // }


                    string organization = "CMS";
                    var resdata = await GetARVOSlSubjectList(_config, organization, module, userEmail, device);
                    var requestbody = new PredicateValEXX
                    {
                        Val = userId + ":" + classId,
                        userEmail = userEmail,
                        module = module,
                        organizationCode = organization,
                        device = device
                    };
                    var emsresult = await SubjectList(requestbody);
                    var commonItems = resdata.Where(subject =>
                   emsresult.Any(ems => ems.FullName == subject.Name)).ToList();

                    var slSubjectList = commonItems.Select(subject => new SlSubjectList
                    {
                        Id = subject.Id.ToString(),
                        FullName = subject.Name,
                        MaxWatched = 0,
                        Remaining = 0,
                        OrderNumber = 0
                    }).ToList();
                    return Ok(slSubjectList);
                }

                else
                {
                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "25");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    string apiUrl, accessToken = string.Empty;


                    if (_config != null)
                    {
                        apiUrl = $"{_config.BaseURL + _config.APIURL}";

                        var requestbody = new
                        {
                            val = userId + ":" + classId,
                            userEmail = userEmail,
                            module = module,
                            organizationCode = "CMS",
                            device = device
                        };

                        string jsonRequest = JsonConvert.SerializeObject(requestbody);
                        var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                        HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            res = JsonConvert.DeserializeObject<List<EMSSlSubjectList>>(responseData);

                        }

                        return Ok(res);
                    }
                    //////////
                }

                return Ok();



            }

            catch (Exception ex)
            {
                // Log exception and return error message
                return BadRequest($"An error occurred: {ex.Message}");
            }



        }

        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<List<EMSSlSubjectList>> SubjectList(PredicateValEXX requestbody)
        {
            List<EMSSlSubjectList> res = new List<EMSSlSubjectList>();
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();
            string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "27");
            var samsdata = this.db.ARVOConfiguration.FromSql(json);
            _config = samsdata.FirstOrDefault();

            if (_config != null)
            {
                string apiUrl = $"{_config.BaseURL + _config.APIURL}";

                string jsonRequest = JsonConvert.SerializeObject(requestbody);
                var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    res = JsonConvert.DeserializeObject<List<EMSSlSubjectList>>(responseData);
                }
            }

            return res; // Return the result, even if empty
        }
        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<List<Subject>> GetARVOSlSubjectList(ARVOConfiguration _config, string organization, string module, string userEmail, string device)
        {
            ChapAndTopicsResponse responseObj = new ChapAndTopicsResponse();

            string apiUrl = $"{_config.BaseURL}{_config.APIURL}";

            var requestBody = new
            {
                organization = organization,
                includeBiteSize = true,
                userEmail = userEmail,
                module = module,
                organizationCode = organization,
                device = device
            };

            string jsonRequest = JsonConvert.SerializeObject(requestBody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    responseObj = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        responseObj = JsonConvert.DeserializeObject<ChapAndTopicsResponse>(responseData);
                    }

                }
            }

            // Filter subjects where isBiteSizedVideoInclude is true
            var filteredSubjects = responseObj.Data?.Subjects?.Where(e => e.IsBiteSizedVideoInclude == true)
                ?.ToList() ?? new List<Subject>();

            return filteredSubjects;
        }

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetArvoSmartLChaptersContent([FromBody] PredicateVal model)
        {
            try
            {
                var splitValues = model.Val.Split(new[] { ":", "?" }, StringSplitOptions.RemoveEmptyEntries);
                var userId = new Guid(splitValues[0]);
                var classId = new string(splitValues[1]);
                var board = new string(splitValues[2]);
                var subjectName = new string(splitValues[3]);
                var classname = new string(splitValues[4]);

                var module = new string(splitValues[5]);
                var userEmail = new string(splitValues[6]);
                var device = new string(splitValues[7]);
                if (classname == "Pre1stYear")
                    classname = "Pre 1st Year";
                if (classname == "Part - I")
                    classname = "Part-I";


                List<GTSLChapeters> valueres = new List<GTSLChapeters>();
                List<MapChapterData> res = new List<MapChapterData>();
                HttpClient client = new HttpClient();
                ARVOConfiguration _config = new ARVOConfiguration();
                if (board == "Punjab Boards" || board == "Punjab Board")
                {

                    string apiUrl, accessToken = string.Empty;

                    var PredicateVlau = new PredicateVlauEXX
                    {
                        Board = board,
                        ClassId = classname,
                        Organization = "CMS",
                        ContentType = "BiteSize",
                        IsPastPaper = false, // Adjust this based on your model
                        UserId = userId,
                        SubjectName = subjectName,
                        UserEmail = userEmail,
                        Module = module,
                        OrganizationCode = "CMS",
                        Device = device
                    };

                    Predicate ProvidedString = new Predicate
                    {
                        ProvidedString = $"{PredicateVlau.Board}?{PredicateVlau.ClassId}?{PredicateVlau.Organization}?{PredicateVlau.ContentType}?{PredicateVlau.IsPastPaper}?{PredicateVlau.UserId}?{PredicateVlau.ClassId}?{PredicateVlau.SubjectName}?{PredicateVlau.Module}?{PredicateVlau.UserEmail}?{PredicateVlau.Device}"
                    };

                    var resdata = await GetSubjectsByPeogramCombo(ProvidedString);

                    var responseContent = await ExtractJsonContentAsync(resdata);

                    // Deserialize the JSON content to your ApiResponse model

                    List<Value> responses = JsonConvert.DeserializeObject<List<Value>>(responseContent);

                    return Ok(responses);


                }

                else
                {
                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "26");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    string apiUrl, accessToken = string.Empty;


                    if (_config != null)
                    {
                        apiUrl = $"{_config.BaseURL + _config.APIURL}";

                        var requestbody = new
                        {
                            val = userId + ":" + classId
                        };

                        string jsonRequest = JsonConvert.SerializeObject(requestbody);
                        var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                        HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            valueres = JsonConvert.DeserializeObject<List<GTSLChapeters>>(responseData);
                            var mappedChapters = valueres.Select(MapToMapChapterData).ToList();
                            return Ok(mappedChapters);
                        }


                    }
                    //////////
                }

                return Ok("No Data Found");

            }

            catch (Exception ex)
            {
                // Log exception and return error message
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }

        private async Task<string> ExtractJsonContentAsync(IActionResult result)
        {
            if (result is JsonResult jsonResult)
            {
                // If it's a JsonResult, simply return the serialized content as string
                return JsonConvert.SerializeObject(jsonResult.Value);
            }
            if (result is ContentResult contentResult)
            {
                return contentResult.Content;
            }

            // If the result is from an HttpResponse, we can read the response content
            if (result is ObjectResult objectResult)
            {
                return JsonConvert.SerializeObject(objectResult.Value);
            }
            throw new InvalidOperationException("Unsupported result type.");
        }

        private MapChapterData MapToMapChapterData(GTSLChapeters chapter)
        {
            var contentList = string.IsNullOrEmpty(chapter.Topics) ? new List<Data.Model.Content>() : JsonConvert.DeserializeObject<List<Data.Model.Content>>(chapter.Topics)
                .Where(topic => topic.ContentType != null).ToList();

            //if (contentList.Count == 0)
            //{
            //    contentList.Add(new Data.Model.Content());
            //    contentList[0].ContentType = "BiteSize";
            //    contentList[0].ContentIds= null;
            //}
            return new MapChapterData
            {
                Id = chapter.Id.ToString(),
                FullName = chapter.FullName,
                MaxWatched = chapter.MaxWatched,
                Remaining = chapter.Remaining,
                OrderNumber = chapter.OrderNumber,
                Content = contentList,
                IsArvo = false,
                sloBased = false
                // Customize logic
            };
        }

        /////////////Smart Learning Video Api

        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Authorize]
        [Route("[action]")]
        public async Task<IActionResult> GetArvoSmartLVideoContent([FromBody] PredicateVal model)
        {
            try
            {

                var splitValues = model.Val.Split(new[] { ":", "?" }, StringSplitOptions.None);
                var userId = new Guid(splitValues[0]);
                var subjectId = new string(splitValues[1]);
                var board = new string(splitValues[2]);
                var subjectName = new string(splitValues[3]);
                var classname = new string(splitValues[4]);
                var chapetrId = new string(splitValues[5]);
                var topicid = "";
                // if (splitValues.Length == 7)
                // {
                topicid = new string(splitValues[6]);
                // }

                var module = new string(splitValues[7]);

                var userEmail = new string(splitValues[8]);
                var device = new string(splitValues[9]);


                //if (splitValues[6] != null && splitValues[6] != "")
                //{
                //     topicid = new string(splitValues[6]);
                //}
                //else
                //{
                //    topicid = "";
                //}



                List<GTSLChapeters> valueres = new List<GTSLChapeters>();
                List<MapChapterData> res = new List<MapChapterData>();
                HttpClient client = new HttpClient();
                ARVOConfiguration _config = new ARVOConfiguration();
                if (board == "Punjab Boards" || board == "Punjab Board")
                {

                    if (topicid == "")
                    {
                        return Ok("There are no Questions for this Topic.");
                    }

                    string apiUrl, accessToken = string.Empty;

                    var PredicateVlau = new PredicateVlauVideoEXX
                    {

                        Organization = "CMS",
                        ContentType = "BiteSize",
                        IsPastPaper = false, // Adjust this based on your model
                        UserId = userId,
                        IsArvo = "true",
                        ChapterId = chapetrId,
                        TopicId = topicid,
                        UserEmail = userEmail,
                        Module = module,
                        OrganizationCode = "CMS",
                        Device = device
                    };

                    Predicate ProvidedString = new Predicate
                    {
                        ProvidedString = $"{PredicateVlau.Organization}?{PredicateVlau.TopicId}?{PredicateVlau.ContentType}?{""}?{""}?{PredicateVlau.ChapterId}?{PredicateVlau.UserId}?{PredicateVlau.IsArvo}?{PredicateVlau.IsPastPaper}?{PredicateVlau.UserEmail}?{PredicateVlau.Module}?{PredicateVlau.Device}?"
                    };

                    var resdata = await GetARVOContentWeb(ProvidedString);

                    var responseContent = await ExtractJsonContentAsync(resdata);

                    // Deserialize the JSON content to your ApiResponse model

                    List<Object> responses = JsonConvert.DeserializeObject<List<Object>>(responseContent);

                    //return Ok(resdata);

                    return Ok(responses);


                }

                else
                {
                    string json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "26");
                    var samsdata = this.db.ARVOConfiguration.FromSql(json);
                    _config = samsdata.FirstOrDefault();

                    string apiUrl, accessToken = string.Empty;


                    if (_config != null)
                    {
                        apiUrl = $"{_config.BaseURL + _config.APIURL}";

                        var requestbody = new
                        {
                            val = userId + ":" + subjectId,
                            userEmail = userEmail,
                            module = module,
                            organizationCode = "CMS"
                        };

                        string jsonRequest = JsonConvert.SerializeObject(requestbody);
                        var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                        client.DefaultRequestHeaders.Add("User-Agent", "PostmanRuntime/7.29.0");

                        HttpResponseMessage response = client.PostAsync(apiUrl, content).Result;

                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            valueres = JsonConvert.DeserializeObject<List<GTSLChapeters>>(responseData);
                            var kObj = valueres.FirstOrDefault(e => e.Id.ToString() == chapetrId);
                            var mappedChapters = MapGTSLChaptersToMapVideoData(kObj);
                            return Ok(mappedChapters);
                        }


                    }
                    //////////
                }

                return Ok();

            }

            catch (Exception ex)
            {
                // Log exception and return error message
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
        public List<MapVideoData> MapGTSLChaptersToMapVideoData(GTSLChapeters gtslChapter)
        {
            // Deserialize the Topics property (which is a string of JSON) into a List<slTopic>
            List<slTopic> topics = JsonConvert.DeserializeObject<List<slTopic>>(gtslChapter.Topics);

            // Assuming you're picking the first topic
            //var firstTopic = topics.FirstOrDefault();

            //if (firstTopic == null)
            //{
            //    return null;
            //}

            var mappedVideoData = topics.Select(topic => new MapVideoData
            {
                topicId = topic.TopicId,
                topicName = topic.FullName,
                SubjectName = topic.FullName,
                chapterId = gtslChapter.Id.ToString(),
                tCode = topic.Code,
                fullName = topic.FullName,
                description = topic.FullName,
                videoLink = topic.VideoLink,
                orderNumber = gtslChapter.OrderNumber,
                isEnable = 1, // Default value
                maxWatched = gtslChapter.MaxWatched,
                subject = "" // Adjust as needed
            }).ToList();

            // Return the list of mapped data
            return mappedVideoData;
        }



        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> unityConfig()
        {
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            var json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "30");
            var samsdata = this.db.ARVOConfiguration.FromSql(json);
            _config = samsdata.FirstOrDefault();



            var resdata = await GetUnityConfig(_config);
            return Ok(resdata.data);

        }


        private async Task<dynamic> GetUnityConfig(ARVOConfiguration _config)
        {




            string apiUrl = $"{_config.BaseURL + _config.APIURL}";


            using (HttpClient client = new HttpClient())
            {

                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = client.GetAsync(apiUrl).Result;

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    var resp = JsonConvert.DeserializeObject<dynamic>(responseData);
                    return resp;
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.GetAsync(apiUrl).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        var resp = JsonConvert.DeserializeObject<dynamic>(responseData);
                        return resp;
                    }

                }
                return null;
            }





        }



        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> ModelConfigAdd([FromBody] ModelConfigModel model)
        {
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            var json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "31");
            var samsdata = this.db.ARVOConfiguration.FromSql(json);
            _config = samsdata.FirstOrDefault();



            var resdata = await Arvo3DModelConfigAdd(_config, model);
            return Ok(resdata.data);

        }



        public async Task<dynamic> Arvo3DModelConfigAdd(ARVOConfiguration _config, ModelConfigModel model)
        {

            string apiUrl = $"{_config.BaseURL}{_config.APIURL}";


            string jsonRequest = JsonConvert.SerializeObject(model);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    var responseObj = JsonConvert.DeserializeObject<dynamic>(responseData);
                    return responseObj;
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        var responseObj = JsonConvert.DeserializeObject<dynamic>(responseData);
                        return responseObj;
                    }

                }
            }


            return null;
        }



        [AllowAnonymous]
        [IgnoreAntiforgeryToken]
        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Model3DGet([FromBody] EDModel model)
        {
            HttpClient client = new HttpClient();
            ARVOConfiguration _config = new ARVOConfiguration();


            var json = String.Format(@"select * from ""EL"".""GetArvoConfig""('{0}')", "32");
            var samsdata = this.db.ARVOConfiguration.FromSql(json);
            _config = samsdata.FirstOrDefault();



            var resdata = await ArvoModel3DGet(_config, model);
            return Ok(resdata.data);

        }



        public async Task<dynamic> ArvoModel3DGet(ARVOConfiguration _config, EDModel model)
        {

            string apiUrl = $"{_config.BaseURL}{_config.APIURL}";


            string jsonRequest = JsonConvert.SerializeObject(model);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                HttpResponseMessage response = await client.PostAsync(apiUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    var responseObj = JsonConvert.DeserializeObject<dynamic>(responseData);
                    return responseObj;
                }
                else
                {
                    _config = await ARVOLoginEx(_config);
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _config.ARVOAccessToken);

                    HttpResponseMessage response1 = client.PostAsync(apiUrl, content).Result;

                    if (response1.IsSuccessStatusCode)
                    {
                        string responseData = await response1.Content.ReadAsStringAsync();
                        var responseObj = JsonConvert.DeserializeObject<dynamic>(responseData);
                        return responseObj;
                    }

                }
            }


            return null;
        }



    }


}