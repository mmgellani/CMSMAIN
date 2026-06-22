/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { ExaminationExamScheduleAddEdit } from '../add-edit';
import { ExaminationExamScheduleDelete } from '../delete';

import { StoreTypes } from '../../../../../../store';
import { ExaminationExamScheduleService } from '../../../../service/Examination/ExamSchedule';
import { IExaminationExamSchedule, IExaminationExamScheduleCourseName, IExaminationExamScheduleVWEx } from '../../../../models/Examination/ExamSchedule';
import { SetupSessionService, SetupCampusService, SetupCampusProgramLinkService, SetupClassService, RegistrationSectionCourseLinkService, ExaminationExamTypeService, RegistrationCourseService, RegistrationProgramCourseLinkService } from '../../../../service';
import { ISetupSession, ISetupCampus, DDLModel, DDLGroupModel, ISetupCampusProgramVM, ISetupClass, IRegistrationSectionCourseLinkVM, IExaminationExamType, IRegistrationCourse, ICampusCityVM, RegistrationProgramCourseLinkVM } from '../../../../models';
import { SetupMonthService } from '../../../../service/Setup/Month';
import { ISetupMonth } from '../../../../models/Setup/Month';
import { IExaminationExamScheduleVM } from '../../../../models/Examination/ExamScheduleVM';
import { ExaminationGradingMasterService } from '../../../../service/Examination/GradingMaster';
import { GradingMasterDetailData } from '../../../../models/Examination/GradingCriteria';
import { IExaminationFailMasterCriteria, IExaminationVWFailMasterCriteria } from '../../../../models/Examination/FailCriteria';
import { ExaminationFailCriteriaService } from '../../../../service/Examination/FailCriteria';
import { ExaminationExamSchedulePreview } from '../preview';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'ExamSchedule-add-edit-model': ExaminationExamScheduleAddEdit,
        'delete-model': ExaminationExamScheduleDelete,
        'preview-model': ExaminationExamSchedulePreview
    }
})

export class ExaminationExamScheduleList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ExaminationExamScheduleService;
    private data: Array<IExaminationExamScheduleVM> = [];

    private sessionRepo: SetupSessionService;
    private sessionList: Array<ISetupSession> = [];

    private campusRepo: SetupCampusService;
    private campusList: Array<ISetupCampus> = [];
    private campusProgramId: string = "";
    private sectionCourseLinkId = "";
    totalMarks = 0;


    private ddl: Array<DDLModel> = [];
    private programDDL: Array<DDLGroupModel> = [];
    private campusProgramLinkRepo: SetupCampusProgramLinkService;
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private sessionId: string = "";
    private campusId: string = "";
    private sci = '';

    private classRepo: SetupClassService;
    private classList: Array<ISetupClass> = [];
    private classId: string = "";

    private courseRepo: RegistrationCourseService;
    private courseList: Array<IRegistrationCourse> = [];

    private monthRepo: SetupMonthService;
    private monthList: Array<ISetupMonth> = [];
    programCourseLinkId = '';
    private GradingMasterDetailData: Array<GradingMasterDetailData> = [];



    private GradingMasterrepository: ExaminationGradingMasterService = null;



    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];

    private examTypeId: string = "";
    sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    private SectionCourserepository: RegistrationSectionCourseLinkService = new RegistrationSectionCourseLinkService(this.$store);
    private courseLists: Array<RegistrationProgramCourseLinkVM> = [];
    datestring = new Date();
    private failCriteriaList: Array<IExaminationVWFailMasterCriteria> = [];
    private failCriteriaRepo: ExaminationFailCriteriaService = new ExaminationFailCriteriaService(this.$store);

    private examScheduleListCourseName: IExaminationExamScheduleCourseName[] = [];



    private courseId: string = "";

    private datas: Array<IExaminationExamScheduleVWEx> = [];
    private forAllSection = false;

    private forAllSectionId = "";
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store);
    private dataProp: IExaminationExamSchedule = {
        month: '', examScheduleId: '', examDate: new Date(), statusId: 0, examTypeId: '', courseId: '', campusProgramId: '', classId: '', failMasterId: '', gradingMasterId: '', sectionCourseLinkId: '', totalMarks: 0, fullName: ''
    };

    private columns = [
        { key: 'fullName', caption: 'Schedule Name' },
        { key: 'examTypeName', caption: 'Exam Type' },
        { key: 'failMasterName', caption: 'Fail Criteria' },
        { key: 'name', caption: 'Grading Criteria' },

        { key: 'courseName', caption: 'Course Name' },
        { key: 'month', caption: 'Month' },
        //{ key: 'statusId', caption: 'Status' },

        { key: 'action', caption: 'Action', width: 120 }
    ];
    programDetailId: string = '';
    created() {
        this.repository = new ExaminationExamScheduleService(this.$store);
        this.sessionRepo = new SetupSessionService(this.$store);
        this.campusRepo = new SetupCampusService(this.$store);
        this.campusProgramLinkRepo = new SetupCampusProgramLinkService(this.$store);
        this.classRepo = new SetupClassService(this.$store);
        this.courseRepo = new RegistrationCourseService(this.$store);
        this.GradingMasterrepository = new ExaminationGradingMasterService(this.$store);
        this.loadFailCriteria();
        this.$watch('programDetailId', this.loadSectionCourse)
        this.$watch('classId', this.loadSectionCourse)

        this.GradingMasterrepository.GetGradingMasterDetail().then(r => {
            this.GradingMasterDetailData = r as Array<GradingMasterDetailData>
        });
    }

    jsonPipe(item) {
        return JSON.parse(item)
    }

    mounted() {
        this.validatePage();
        this.loadSession();
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    failMasterid: string = '';
    gradingMasterid: string = '';
    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }
    loadSectionCourse() {
        this.courseLists = [];


        this.programDetailId = this.campusProgramLinkList.find(e => e.campusProgramId == this.campusProgramId).programDetailId;
        if (this.programDetailId.length > 0 && this.classId.length > 0) {
            var key = this.programDetailId + "?" + this.classId
            this.programCourseRepo.GetAllFilterData(key)
                .then(r => {
                    this.courseLists = r as Array<RegistrationProgramCourseLinkVM>
                    this.refreshData()

                });
        }

    }
    loadFailCriteria() {
        this.failCriteriaList = [];
        this.failCriteriaRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.failCriteriaList = r as Array<IExaminationFailMasterCriteria>
                this.failCriteriaList.forEach(element => {

                    element.fullName = element.fullName + '-' + element.fail_In + '-' + element.failMarks + '-' + element.absentConsiderFail

                });
            })
    }


    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    loadCourse() {
        this.courseRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.courseList = r as Array<IRegistrationCourse>
            })
    }


    loadSection() {

        this.sectionCourseLinkId = '';
        this.sectionCourseLinkList = [];
        if (this.campusId.length > 0 && this.campusProgramId.length > 0 && this.sessionId.length > 0 && this.classId.length > 0) {
            var key = this.campusId + "?" + this.campusProgramId + "?" + this.classId
            this.SectionCourserepository.GetSectionData(key)
                .then(response => {
                    this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
                    this.datas = []
                });
        }

    }


    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('examinationExamSchedule' in this.user.claims) == true) {
                if (this.user.claims['examinationExamSchedule'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examinationExamSchedule'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examinationExamSchedule'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examinationExamSchedule'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    courseArr = [];
    coursename = '';
    refreshData() {
        this.coursename = ''
        this.datas = [];

        if (this.campusProgramId.length > 0 && this.classId.length > 0 && this.sectionCourseLinkId.length > 0) {
            var key = this.campusProgramId + "?" + this.classId + "?" + this.sectionCourseLinkId;
            var count = 1;
            this.repository.GetFindByVM(key)
                .then(response => {
                    this.datas = response as Array<IExaminationExamScheduleVWEx>;
                    this.datas.forEach((item) => {
                        var json = JSON.parse(item.courseName);
                        json.unshift({ ExamScheduleId: count++, CourseName: "New" })
                        item.courseName = json
                    })
                });
        }
    }
    preview(model: IExaminationExamSchedule) {

        this.$modal.show('preview-model', {
            examScheduleId: model.examScheduleId,
            sessionId: this.sessionId,
            campusId: this.campusId,
            programDetailId: this.campusProgramLinkList.find(s => s.campusProgramId == this.campusProgramId).programDetailId,
            classId: this.classId,
            sectionId: this.sectionCourseLinkList.find(s => s.sectionCourseLinkId == this.sectionCourseLinkId).sectionId,
            courseId: this.courseLists.find(s => s.programCourseLinkId == s.programCourseLinkId).courseId,
            sectionCourseLinkId: this.sectionCourseLinkId,
            programCourseLinkId: this.programCourseLinkId,
            examTypeId: model.examTypeId,
            totalMarks: model.totalMarks

        });
    }
    enableCheckbox() {


        if (this.forAllSection == true) {

            this.sectionCourseLinkId = "";
            this.forAllSectionId = "";
            this.sectionCourseLinkList.forEach(e => {
                this.forAllSectionId = this.forAllSectionId + e.sectionCourseLinkId + ',';

            });
            if (this.forAllSectionId.length > 0) {
                this.forAllSectionId = this.forAllSectionId.substring(0, this.forAllSectionId.length - 1);
            }
        }
        else {
            this.forAllSectionId = "";
        }
    }

    insertModel() {

        this.$modal.show('ExamSchedule-add-edit-model', {

            model: {
                examScheduleId: '', examDate: new Date(), statusId: 1, examTypeId: '', courseId: this.programCourseLinkId, campusProgramId: this.campusProgramId, classId: this.classId, failMasterId: '', gradingMasterId: '', sectionCourseLinkId: this.sectionCourseLinkId, totalMarks: 0, fullName: '', month: '', courseName: ''
            }, IsNewRecord: true, sectionList: this.sectionCourseLinkId, sectionCourseLinkList: this.sectionCourseLinkList, forAllSection: this.forAllSection, programdetailid: this.programDetailId, sessionid: this.sessionId, campusId: this.campusId, forAllSectionId: this.forAllSectionId,
        });
    }

    editModel(model: IExaminationExamScheduleCourseName) {

        if (this.coursename.length > 0) {

      

            this.datas = [];
            if (+this.coursename) {
                this.$modal.show('ExamSchedule-add-edit-model', {
                    model: model, IsNewRecord: true, coursename: this.coursename, isExistingNew: true,
                    sectionList: this.sectionCourseLinkId, sectionCourseLinkList: this.sectionCourseLinkList, forAllSection: this.forAllSection, programdetailid: this.programDetailId, sessionid: this.sessionId, campusId: this.campusId,
                });

            } else {
                this.repository.GetExamSched(this.coursename)
                    .then(response => {
                        this.examScheduleListCourseName = response as Array<IExaminationExamScheduleCourseName>;
                        console.log('show list', this.examScheduleListCourseName);
                        this.$modal.show('ExamSchedule-add-edit-model', {
                            model: this.examScheduleListCourseName[0], IsNewRecord: false, isExistingNew: false, sectionList: this.sectionCourseLinkId, sectionCourseLinkList: this.sectionCourseLinkList, forAllSection: this.forAllSection, programdetailid: this.programDetailId,
                            sessionid: this.sessionId, campusId: this.campusId, forAllSectionId: this.forAllSectionId,
                        });

                    });
            }

        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select course",
                title: "Error",
                messageTypeId: PayloadMessageTypes.error,
            });
        }
    }

    deleteModel(model: IExaminationExamSchedule) {

        if (this.coursename.length > 0) {
            if (this.coursename == '00000000-0000-0000-0000-000000000000') {

            } else {
                this.$modal.show('delete-model', { model: model, id: this.coursename });
            }

        } else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: "Please select course",
                title: "Error",
                messageTypeId: PayloadMessageTypes.error,
            });
        }
    }
}