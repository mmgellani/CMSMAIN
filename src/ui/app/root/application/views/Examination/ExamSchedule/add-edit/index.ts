/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { required, maxLength } from "vuelidate/lib/validators";
import { ValidationRuleset, Vuelidate, validationMixin } from "vuelidate";

import { StoreTypes } from "../../../../../../store";
import { PayloadMessageTypes } from "../../../../../../model";

import * as helper from "../../../../helper";
import { GetCourseFromTimetable, GetCourseListByTimetable, IExaminationExamSchedule, IExamScheduleExx, IExaminationExamScheduleCourseName, DateArray, UpdatemarksResponse } from "../../../../models/Examination/ExamSchedule";
import { ExaminationExamScheduleService } from "../../../../service/Examination/ExamSchedule";
import {
    IExaminationExamType,
    IRegistrationSectionCourseLinkVM,
    RegistrationProgramCourseLinkVM,
} from "../../../../models";
import { ExaminationExamTypeService } from "../../../../service";
import {
    IExaminationFailMasterCriteria,
    IExaminationVWFailMasterCriteria,
} from "../../../../models/Examination/FailCriteria";
import { ExaminationFailCriteriaService } from "../../../../service/Examination/FailCriteria";
import { GradingMasterDetailData } from "../../../../models/Examination/GradingCriteria";
import { ExaminationGradingMasterService } from "../../../../service/Examination/GradingMaster";
import moment from "moment";
import { FailMasterPreview } from "../failMasterPreview";
import { GradingPolicyPreview } from "../gradingPolicyPreview";
import { debug } from "console";

type ValidateExaminationExamSchedule = {
    data: IExaminationExamSchedule;
    validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateExaminationExamSchedule> = {
    data: {
        examTypeId: { required },
        fullName: { required },
        gradingMasterId: { required },
        failMasterId: { required },
        month: { required },
    },
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: "ExamSchedule-add-edit-model",
    template: require("./index.html"),
    props: ["courseLists"],
    components: {
        "fail-master-preview": FailMasterPreview,
        "grading-olicy-preview": GradingPolicyPreview,
    },
})
export class ExaminationExamScheduleAddEdit extends Vue {
    private repository: ExaminationExamScheduleService;
    isActive: boolean = true;
    private examTypeId: string;
    private courseId: string;
    private forAllSectionId: string;

    private campusProgramId: string;
    private fromDate = new Date();
    private toDate = new Date();
    private courseLists: Array<RegistrationProgramCourseLinkVM>;
    private examTypeRepo: ExaminationExamTypeService;
    private examTypeList: Array<IExaminationExamType> = [];
    private GradingMasterDetailData: Array<GradingMasterDetailData> = [];
    datestring = new Date();
    private datas: Array<IExaminationExamSchedule> = [];
    private esNameList: Array<IExamScheduleExx> = [];
    private examScheduleList: IExaminationExamSchedule[] = [];
    private examScheduleListCourseName: IExaminationExamScheduleCourseName[] = [];
    private listlength: number;
    private courseList: Array<GetCourseListByTimetable> = [];
    private updatemarks: Array<UpdatemarksResponse> = [];
    private exammarking: Array<GetCourseListByTimetable> = [];
    private iscourseentered: Array<GetCourseListByTimetable> = [];
    private getListOfCourse: Array<GetCourseFromTimetable> = [];
    private exaamdate: Date;
    //name: string = this.name;
    private SectionCourseLinkIdList = "";
    private SectionCourseLinkIdListarray = [];
    private SectionCourseLinkIdleng: number;
    private sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    private abc = "";
    private abcArray = [];
    private programDetailId: string = '';
    private dateArray: Array<DateArray> = [];
    private examDate = new Date();
    private sessionId: string = '';
    private campusid: string = '';
    private sectionId: string = '';
    private GradingMasterrepository: ExaminationGradingMasterService = null;
    private failCriteriaList: Array<IExaminationVWFailMasterCriteria> = [];
    private failCriteriaRepo: ExaminationFailCriteriaService = new ExaminationFailCriteriaService(
        this.$store
    );
    private msgShow: string = '';

    private cousridcheck: string = '';
    private activeDayoff: boolean = false;
    private dateselect: boolean = false;
    private enablebutton: boolean = true;
    private disablebuuton: boolean = false;
    private enablelistcourse: boolean = false;
    private monthList =
        [{ name: 'January' }, { name: 'February' }, { name: 'March' }, { name: 'April' }, { name: 'May' }, { name: 'June' }, { name: 'July' }, { name: 'August' }, { name: 'September' }, { name: 'October' }, { name: 'November' }, { name: 'December' }]
    private data: IExaminationExamSchedule = {
        examScheduleId: "",
        examDate: "",
        statusId: 0,
        examTypeId: "",
        courseId: "",
        campusProgramId: "",
        classId: "",
        failMasterId: "",
        gradingMasterId: "",
        sectionCourseLinkId: '',
        totalMarks: 0,
        fullName: "",
        month: "",

    };
    private dataCoursename: IExaminationExamScheduleCourseName = {
        examScheduleId: "",
        examDate: "",
        statusId: 0,
        examTypeId: "",
        courseId: "",
        campusProgramId: "",
        classId: "",
        failMasterId: "",
        gradingMasterId: "",
        sectionCourseLinkId: '',
        totalMarks: 0,
        fullName: "",
        month: "",
        courseName: ''

    };
    private IsNewRecord: boolean = true;
    private title: string = "";
    private inputValue: string = '';

    created() {
        this.repository = new ExaminationExamScheduleService(this.$store);
        this.examTypeRepo = new ExaminationExamTypeService(this.$store);
        this.loadFailCriteria();
        this.loadExamType();
        this.GradingMasterrepository = new ExaminationGradingMasterService(
            this.$store
        );
        this.GradingMasterrepository.GetGradingMasterDetailEx().then((r) => {
            this.GradingMasterDetailData = r as Array<GradingMasterDetailData>;
        });
        this.listlength = this.data.sectionCourseLinkId.length;
        console.log(this.$refs.table, 'dfasdfsdfsdf');

        //   this.$watch('courseLists', this.GetCourseList);


    }
    pushToList() {
        debugger;

        this.dateselect = true;
        this.examScheduleList.push({

            campusProgramId: this.data.campusProgramId,
            courseId: this.data.courseId,
            examDate: new Date(
                moment(this.data.examDate).format("YYYY-MM-DD")
            ),
            failMasterId: "",
            totalMarks: 0,
            classId: this.data.classId,
            examScheduleId: helper.newGuid(),
            examTypeId: "",
            fullName: "",
            gradingMasterId: "",
            sectionCourseLinkId: this.data.sectionCourseLinkId,
            statusId: 1,
            month: this.data.month,



        });




    }
    pushToListCourseName() {

        // this.checkdayoff();
        debugger;

        this.enablebutton = false;
        this.dateselect = true;

        this.examScheduleListCourseName.push({

            campusProgramId: this.data.campusProgramId,
            courseId: this.data.courseId,
            examDate: helper.formateDate(new Date(this.data.examDate)),
            failMasterId: "",
            totalMarks: this.data.totalMarks,
            classId: this.data.classId,
            examScheduleId: helper.newGuid(),
            examTypeId: "",
            fullName: "",
            gradingMasterId: "",
            sectionCourseLinkId: this.data.sectionCourseLinkId,
            statusId: 1,
            month: this.data.month,
            courseName: this.courseLists.find(e => e.courseId == this.data.courseId).courseName

        });

        // this.courseLists = [];\

        this.data.examDate = null;
        this.data.totalMarks = null;
        this.data.courseId = null;

    }

    removeCourseList(i) {

        //this.activeDayoff = true; ////// ansa 
        this.examScheduleListCourseName.splice(i, 1);
    }


    removeFromList(id) {
        this.activeDayoff = true; ////// ansa 
        this.examScheduleList = this.examScheduleList.filter(
            (s) => s.examScheduleId != id
        );
    }

    editModel() {
        var model = this.failCriteriaList.find(
            (s) => s.failMasterId == this.data.failMasterId
        );
        //
        this.$modal.show("fail-master-preview", {
            IsNewRecord: false,
            failMaster: this.data.failMasterId,
            failMarks: model.failMarks,
            failIn: model.fail_In,
            absentConsiderFail: model.absentConsiderFail,
            failMasterName: model.fullName,
        });
    }

    editModel2() {
        var model = this.GradingMasterDetailData.find(
            (s) => s.gradingMasterId == this.data.gradingMasterId
        );
        this.$modal.show("grading-olicy-preview", {
            fullName: model.name,
            gradingMasterId: this.data.gradingMasterId,
            IsNewRecord: false,
        });

    }



    codeToBind = "";
    loadCode() {

        var key = this.data.examTypeId + "?" + this.data.sectionCourseLinkId;
        if (this.IsNewRecord) {
            if (!this.isExistingNew) {
                if (this.data.sectionCourseLinkId.length > 1) {
                    this.codeToBind = "";
                    this.repository.GetCodeSpecificSections(key).then((r) => {
                        this.codeToBind = r[0].providedString as any;
                        this.data.fullName = "";
                        var code = this.examTypeList.find(
                            (e) => e.examTypeId == this.data.examTypeId
                        ).code;
                        this.data.fullName = code + "-" + this.codeToBind;
                    });
                }
                else if (!this.forAllSection) {
                    this.codeToBind = "";
                    this.repository.GetCode(key).then((r) => {
                        this.codeToBind = r[0].providedString as any;
                        this.data.fullName = "";
                        var code = this.examTypeList.find(
                            (e) => e.examTypeId == this.data.examTypeId
                        ).code;
                        this.data.fullName = code + "-" + this.codeToBind;
                    });
                }
                else {
                    var key = this.data.campusProgramId + "?" + this.data.classId + "?" + this.data.examTypeId
                    this.codeToBind = "";
                    this.repository.GetCodeForAllSections(key).then((r) => {
                        this.codeToBind = r[0].providedString as any;
                        this.data.fullName = "";
                        var code = this.examTypeList.find(
                            (e) => e.examTypeId == this.data.examTypeId
                        ).code;
                        this.data.fullName = code + "-" + this.codeToBind;

                    });
                }

            }

        } else {
            //new incremented code should load if examtype is changed
            this.editFlag++;
            if (this.editFlag > 1) {
                this.codeToBind = "";
                this.repository.GetCode(key).then((r) => {
                    this.codeToBind = r[0].providedString as any;
                    this.data.fullName = "";
                    var code = this.examTypeList.find(
                        (e) => e.examTypeId == this.data.examTypeId
                    ).code;
                    this.data.fullName = code + "-" + this.codeToBind;
                });
            }
        }
    }
    loadFailCriteria() {
        this.failCriteriaList = [];
        this.failCriteriaRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
            this.failCriteriaList = r as Array<IExaminationFailMasterCriteria>;
            this.failCriteriaList.forEach((element) => {
                element.fullName =
                    element.fullName +
                    "-" +
                    element.fail_In +
                    "-" +
                    element.failMarks +
                    "-" +
                    element.absentConsiderFail;
            });
        });
    }

    loadExamType() {

        this.examTypeRepo.GetFindBy("s=>s.StatusId==1").then((r) => {
            this.examTypeList = r as Array<IExaminationExamType>;
        });
    }


    private sectionList: Array<IRegistrationSectionCourseLinkVM> = []
    private course: string = "";
    editFlag = 0;
    isExistingNew = false;
    forAllSection: false;


    beforeModalOpen(event) {

      

        this.activeDayoff = false;
        this.enablebutton = true;
        this.dateselect = false;
        this.disablebuuton = false;
        this.$v.$reset();
        if (!this.IsNewRecord) this.editFlag = 0;
        this.examScheduleList = [];
        this.examScheduleListCourseName = [];
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? "Add Record" : "Edit Record";
        Object.assign(this.data, event.params.model);
        this.isExistingNew = event.params.isExistingNew;
        this.forAllSection = event.params.forAllSection;
        this.sectionList = event.params.sectionList;
        this.sectionCourseLinkList = event.params.sectionCourseLinkList;
        this.programDetailId = event.params.programdetailid;
        this.sessionId = event.params.sessionid;
        this.campusid = event.params.campusId;
        this.courseId = event.params.model.courseId;
        this.forAllSectionId = event.params.forAllSectionId;
        this.enablelistcourse= false;
        if (!this.IsNewRecord) {
            //this.ChangeDate(event.params.model.examDate);
            // this.getListOfCourse = [];
            this.CheckexamMarking();
            this.cousridcheck = '';
        }
        if (this.IsNewRecord) {
            this.CheckExamApproved();
            this.pushToListCourseName();
            this.examScheduleList = [];
            this.examScheduleListCourseName = [];
            
            //this.data.examDate = new Date();
        }
        this.esNameList = [];
    }




    loadSectionCode() {

        this.esNameList = [];
        if (this.IsNewRecord) {
            if (!this.isExistingNew) {


                if (this.data.sectionCourseLinkId.length > 0) {

                    this.SectionCourseLinkIdListarray = this.data.sectionCourseLinkId.toString().replace("[", "").replace("]", "").split(",");
                    this.SectionCourseLinkIdListarray.forEach(sectionCourseLinkId => {
                        var key = this.data.examTypeId + "?" + sectionCourseLinkId;
                        this.codeToBind = "";
                        this.repository.GetCodeSpecificSections(key).then((r) => {

                            this.codeToBind = r[0].providedString as any;
                            this.data.fullName = "";
                            var code = this.examTypeList.find(
                                (e) => e.examTypeId == this.data.examTypeId
                            ).code;

                            this.esNameList.push({ examTypeId: sectionCourseLinkId, fullName: code + "-" + this.codeToBind });
                            this.data.fullName = this.esNameList[0].fullName;

                        });
                    })
                }


                else {

                    ////////////for All sections
                    this.sectionCourseLinkList.forEach(sectionCourseLink => {
                        var key = this.data.examTypeId + "?" + sectionCourseLink.sectionCourseLinkId;
                        this.codeToBind = "";
                        this.repository.GetCodeSpecificSections(key).then((r) => {

                            this.codeToBind = r[0].providedString as any;
                            this.data.fullName = "";
                            var code = this.examTypeList.find(
                                (e) => e.examTypeId == this.data.examTypeId
                            ).code;

                            this.esNameList.push({ examTypeId: sectionCourseLink.sectionCourseLinkId, fullName: code + "-" + this.codeToBind });
                            this.data.fullName = this.esNameList[0].fullName;

                        });


                    })

                }
            }
        }
        else {
            //new incremented code should load if examtype is changed
            this.editFlag++;
            if (this.editFlag > 1) {
                this.data.fullName = this.data.fullName;
            }
        }

    }



    private ids = ""

    cancel() {
        this.$modal.hide("ExamSchedule-add-edit-model");
        this.$emit("submit");
    }


    ///////// changed by Ansa //////

    // ChangeDate(date) {

    //     if (this.IsNewRecord) {
    //         this.dateselect = false;
    //     }
    //     else {
    //         this.dateselect = true;
    //     }

    //     this.exaamdate = new Date(
    //         moment(date).format("YYYY-MM-DD")
    //     );


    //     this.getListOfCourse = [];
    //     if (this.data.sectionCourseLinkId.length > 0) {

    //         var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.data.sectionCourseLinkId + '?' + this.exaamdate.toDateString()
    //         this.repository.GetCoursesFromTimetable(key).then((r) => {

    //             this.getListOfCourse = r as Array<GetCourseFromTimetable>;


    //         });
    //     }

    //     else {
    //         //// for All sections///////////

    //         var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.forAllSectionId + '?' + this.exaamdate.toDateString()
    //         this.repository.GetCoursesFromTimetable(key).then((r) => {

    //             this.getListOfCourse = r as Array<GetCourseFromTimetable>;


    //         });


    //     }


    // }
    ////////////by Ansa////////
    enablecourselist()
    {
    this.enablelistcourse=true;
    }




    CheckexamMarking() {
        var param = this.courseId + '?' + this.data.sectionCourseLinkId + '?' + this.data.fullName
        this.repository.CheckSubjectExamMarking(param).then((r) => {

            this.exammarking = r as Array<GetCourseListByTimetable>;

            if (this.exammarking.length > 0) {
                this.msgShow = this.exammarking[0].response;
                this.activeDayoff = true;
                this.disablebuuton = true;

            }
            else {
                this.activeDayoff = false;
                this.dateselect = false;
                this.disablebuuton = false;

            }

        });
    }
    

    CheckExamApproved() {
        var param = this.data.sectionCourseLinkId + '?' + this.data.fullName
        this.repository.CheckExamIsApproved(param).then((r) => {

            this.exammarking = r as Array<GetCourseListByTimetable>;

            if (this.exammarking.length > 0) {
                this.msgShow = this.exammarking[0].response;
                this.activeDayoff = true;
                this.disablebuuton = true;

            }
            else {
                this.activeDayoff = false;
                this.dateselect = false;
                this.disablebuuton = false;

            }

        });
    }

    //////////changed by Ansa ////////////////
    // dayoffdata(datee) {
      

    //     this.activeDayoff = false;
    //     this.exaamdate = new Date(
    //         moment(datee).format("YYYY-MM-DD")
    //     );
    //     if (!this.IsNewRecord) {

    //         var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.data.sectionCourseLinkId + '?' + this.exaamdate.toDateString()

    //         this.repository.GetCoursesbyTimetablee(key).then((r) => {
    //             this.courseList = r as Array<GetCourseListByTimetable>;



    //             if (this.courseList.length == 0) {
    //                 this.activeDayoff = false;
    //             }
    //             else {

    //                 this.msgShow = this.courseList[0].response;

    //                 this.activeDayoff = true;

    //             }


    //         });

    //     }
    // }
    // else 
    GetCourseList(datee) {

        if (this.cousridcheck != '') {
            this.activeDayoff = false; 
            if (this.data.sectionCourseLinkId.length > 0) {
                ////////check already existance of same subject in examschedual with same date//////
                var param = this.data.courseId  + '?'+ helper.formateDate(new Date(datee))+ '?' + this.data.fullName + '?' + this.data.sectionCourseLinkId

                this.repository.CheckAlreadyExistingSubject(param).then((r) => {
                    this.iscourseentered = r as Array<GetCourseListByTimetable>;

                    if (this.iscourseentered.length > 0) {
                        this.msgShow = this.iscourseentered[0].response;

                        this.activeDayoff = true;
                    }

                });

            }

            //////////////////for all sections///////////
            else {

                var param = this.data.courseId + '?' + helper.formateDate(new Date(datee)) + '?' + this.data.fullName + '?' + this.forAllSectionId

                this.repository.CheckAlreadyExistingSubject(param).then((r) => {
                    this.iscourseentered = r as Array<GetCourseListByTimetable>;

                    if (this.iscourseentered.length > 0) {
                        this.msgShow = this.iscourseentered[0].response;

                        this.activeDayoff = true;

                    }

                });

            }
        }
        else {
            this.cousridcheck = this.data.courseId;
        }

    }
    //}



    checkdayoff() {
debugger
        //var checkdayoff = false;
        this.enablelistcourse=false;
        this.activeDayoff = false;  
        if (this.data.sectionCourseLinkId.length > 0) {
            //////// check day off//////////
            var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.data.sectionCourseLinkId + '?'  + helper.formateDate(new Date(this.data.examDate));

            this.repository.GetCoursesbyTimetablee(key).then((r) => {
                this.courseList = r as Array<GetCourseListByTimetable>;


                if (this.courseList.length > 0) {
                    this.msgShow = this.courseList[0].response;

                    this.activeDayoff = true;

                    //return (checkdayoff=true)
                }
                else {

                    this.activeDayoff = false;
                    //return (checkdayoff=false);
                    this.pushToListCourseName();

                }

            });
        }
        else { ///////////check dayyof for all sections
            var key = this.sessionId + '?' + this.campusid + '?' + this.programDetailId + '?' + this.data.classId + '?' + this.forAllSectionId + '?' +  helper.formateDate(new Date(this.data.examDate))

            this.repository.GetCoursesbyTimetablee(key).then((r) => {
                this.courseList = r as Array<GetCourseListByTimetable>;


                if (this.courseList.length > 0) {
                    this.msgShow = this.courseList[0].response;

                    this.activeDayoff = true;
                }
                else {

                    this.activeDayoff = false;
                    this.pushToListCourseName();

                }

            });
        }

    }


    saveModel() {
 debugger
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                //INSERT FOR ALL SECTIONS



                if (this.forAllSection) {


                    this.sectionCourseLinkList.forEach(sectionCourseLink => {
                        if (sectionCourseLink.sectionCourseLinkId.length > 10) {
                            for (var i = 0; i < this.examScheduleListCourseName.length; i++) {
                                this.examScheduleListCourseName[i].examScheduleId = helper.newGuid();
                                this.examScheduleListCourseName[i].statusId = 1;
                                this.examScheduleListCourseName[i].sectionCourseLinkId = sectionCourseLink.sectionCourseLinkId;

                                if (this.examScheduleListCourseName[i].courseId.length == 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Please select course",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (this.examScheduleListCourseName[i].examDate.toString().length == 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Date is mandatory",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (this.examScheduleListCourseName[i].totalMarks < 1) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Total Marks should by greater than 0",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (
                                    this.examScheduleListCourseName.filter((s) => s.fullName == this.examScheduleListCourseName[i].fullName && s.courseId == this.examScheduleListCourseName[i].courseId).length > 1) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Duplicate Course",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }

                                this.examScheduleListCourseName[i].examTypeId = this.data.examTypeId;

                                this.examScheduleListCourseName[i].fullName = this.esNameList.find(e => e.examTypeId == sectionCourseLink.sectionCourseLinkId).fullName;
                                this.examScheduleListCourseName[i].failMasterId = this.data.failMasterId;
                                this.examScheduleListCourseName[i].gradingMasterId = this.data.gradingMasterId;
                                this.examScheduleListCourseName[i].examDate =  new Date(helper.formateDate(new Date(this.examScheduleListCourseName[i].examDate)));
                                this.examScheduleListCourseName[i].month = this.data.month;

                                this.repository.AddOne(this.examScheduleListCourseName[i]).then(() => {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Record has been inserted successfully",
                                        title: "Success",
                                        messageTypeId: PayloadMessageTypes.success,
                                    });
                                    this.$emit("submit");
                                    this.cancel();
                                });
                            }
                        }
                    });




                } //INSERT FOR SINGLE SECTION
                else {
                   // debugger;
                    this.SectionCourseLinkIdleng = this.data.sectionCourseLinkId.length;
                    this.SectionCourseLinkIdListarray = this.data.sectionCourseLinkId.toString().replace("[", "").replace("]", "").split(",");

                    this.SectionCourseLinkIdListarray.forEach(sectionCourseLinkId => {
                        if (sectionCourseLinkId.length > 10) {
                            for (var i = 0; i < this.examScheduleListCourseName.length; i++) {
                                this.examScheduleListCourseName[i].examScheduleId = helper.newGuid();
                                this.examScheduleListCourseName[i].statusId = 1;
                                this.examScheduleListCourseName[i].sectionCourseLinkId = sectionCourseLinkId;

                                if (this.examScheduleListCourseName[i].courseId.length == 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Please select course",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (this.examScheduleListCourseName[i].examDate.toString().length == 0) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Date is mandatory",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (this.examScheduleListCourseName[i].totalMarks < 1) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Total Marks should by greater than 0",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (
                                    this.examScheduleListCourseName.filter((s) => s.fullName == this.examScheduleListCourseName[i].fullName && s.courseId == this.examScheduleListCourseName[i].courseId).length > 1) {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Duplicate Course",
                                        title: "Error",
                                        messageTypeId: PayloadMessageTypes.error,
                                    });
                                    return 0;
                                }
                                if (!this.isExistingNew) {
                                    debugger;
                                    this.examScheduleListCourseName[i].examTypeId = this.data.examTypeId;
                                    this.examScheduleListCourseName[i].fullName = this.esNameList.find(e => e.examTypeId == sectionCourseLinkId).fullName;

                                    this.examScheduleListCourseName[i].failMasterId = this.data.failMasterId;
                                    this.examScheduleListCourseName[i].gradingMasterId = this.data.gradingMasterId;
                                    this.examScheduleListCourseName[i].examDate = new Date(helper.formateDate(new Date(this.examScheduleListCourseName[i].examDate)));

                                    // this.examScheduleListCourseName[i].examDate =new Date(moment(this.examScheduleListCourseName[i].examDate).format("YYYY-MM-DD")).toDateString();
                                    //(this.examScheduleListCourseName[i].examDate);
                                    //new Date(moment(this.examScheduleListCourseName[i].examDate).format("YYYY-MM-DD")).toDateString();
                                    this.examScheduleListCourseName[i].month = this.data.month;
                                }
                                else {
                                    debugger;
                                    this.examScheduleListCourseName[i].examTypeId = this.data.examTypeId;
                                    this.examScheduleListCourseName[i].fullName = this.data.fullName;

                                    this.examScheduleListCourseName[i].failMasterId = this.data.failMasterId;
                                    this.examScheduleListCourseName[i].gradingMasterId = this.data.gradingMasterId;
                                    this.examScheduleListCourseName[i].examDate = new Date(helper.formateDate(new Date(this.examScheduleListCourseName[i].examDate)));

                                   // this.examScheduleListCourseName[i].examDate = new Date(moment(this.examScheduleListCourseName[i].examDate).format("YYYY-MM-DD")).toDateString();
                                    //(this.examScheduleListCourseName[i].examDate);
                                    // new Date(moment(this.examScheduleListCourseName[i].examDate).format("YYYY-MM-DD")).toDateString();
                                    this.examScheduleListCourseName[i].month = this.data.month;

                                }
                                this.repository.AddOne(this.examScheduleListCourseName[i]).then(() => {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: "Record has been inserted successfully",
                                        title: "Success",
                                        messageTypeId: PayloadMessageTypes.success,
                                    });
                                    this.$emit("submit");
                                    this.cancel();
                                });
                            }
                        }
                    });


                }
            }

            else {
            

                if (this.isActive == true) {
                    this.data.statusId = 1;
                } else {
                    this.data.statusId = 0;
                }
                this.data.examDate = new Date(helper.formateDate(new Date(this.data.examDate)));

                var key = this.data.examScheduleId + '?' + this.data.totalMarks
                this.repository.UpdateExamMasterwithExamschedul(key).then((r) => {

                    this.updatemarks = r as Array<UpdatemarksResponse>;

                    if (this.updatemarks[0].pg_catalog == 0) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Total Marks are Less than from Obtained Marks",
                            title: "Error",
                            messageTypeId: PayloadMessageTypes.error,
                        });

                    }
                    else {

                        this.repository.Update(this.data)
                            .then(() => {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: "Record has been updated successfully",
                                    title: "Success",
                                    messageTypeId: PayloadMessageTypes.success,
                                });
                                this.$emit("submit");
                                this.cancel();
                            });

                    }
                });


            }
            this.cancel();
        }
    }
    get allowSubmit() {
        return true;
    }
    $v: any;
}