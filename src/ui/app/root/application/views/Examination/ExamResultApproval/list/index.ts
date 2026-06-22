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

import { IFeeConcessionDetail, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceData, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, IAttendanceApprovalDataVM, ISetupClass } from '../../../../models';
import { FeeConcessionDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, ExaminationExamMasterService, ExaminationExamDetailService, RegistrationSectionCourseLinkService, SetupClassService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import { IExamResultApproval } from '../../../../models/Examination/ExamResultApproval';


@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class ExamResultApproval extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private sectionId =''
    private scholarshipCriteriaId = ''
    private classId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private datestring = ''
    private sectionCourseid = '';
    private fullDayAbsent = false;

    private campusList: Array<ISetupCampus> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
     private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    private attendanceMaster: IAttendanceAttendenceMaster;
    private attendanceDetailList: Array<IAttendanceAttendanceDetail> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private classList: Array<ISetupClass> = []
    private campusCityList: Array<ICampusCityVM> = []
    // private sectionId: Array<IRegistrationSectionCourseLinkVM> = []

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private data: Array<IExamResultApproval> = [];


    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private examDetailRepo: ExaminationExamDetailService = new ExaminationExamDetailService(this.$store)
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    private examMasterRepo: ExaminationExamMasterService = new ExaminationExamMasterService(this.$store)



    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private columns = [ 
        { key: 'studentName', caption: 'Student Name' }, 
        { key: 'rollNo', caption: 'Roll No' },
        { key: 'courseName', caption: 'Course' },
        { key: "dated", caption: 'Date' },
        { key: 'dayname', caption: 'Day' },
        { key: 'obtainMarks', caption: 'Obtained Marks' },
        { key: 'totalMarks', caption: 'Total Marks' },
        { key: 'isApproved', caption: 'Approve' }
    ];
    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        // this.loadCampus();
        this.loadCityCampus();
        this.loadSession();
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

    }


    mounted() {
        this.validatePage();
        this.refreshData();
    }
    loadProgramsOfCampus() {
        this.programDetailId = ''
        this.data = []
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        if (this.sessionId.length > 0 && this.campusId.length > 0) {
            var key = this.sessionId + '?' + this.campusId
            this.campusProgramLinkRepo.GetAllVM(key)
                .then(r => {
                    this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>

                    oldObj = this.campusProgramLinkList[0]
                    this.campusProgramLinkList.forEach(e => {

                        if (e.programId == oldObj.programId) {

                            this.ddl.push({ id: e.programDetailId, text: e.description })
                        }
                        else {

                            this.programDDL.push({ title: this.campusProgramLinkList[this.campusProgramLinkList.indexOf(e) - 1].programName, group: this.ddl })
                            this.ddl = []
                            this.ddl.push({ id: e.programDetailId, text: e.description })
                        }
                        oldObj = e;
                    })
                    this.programDDL.push({ title: oldObj.programName, group: this.ddl })

                    // console.log(JSON.stringify(this.programDDL))
                })
        }
    }

    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM()
            .then(r => {
                this.campusCityList = r as Array<ICampusCityVM>

                oldObj = this.campusCityList[0]
                this.campusCityList.forEach(e => {

                    if (e.cityName == oldObj.cityName) {

                        this.campusddl.push({ id: e.campusId, text: e.campusName })
                    }
                    else {

                        this.cityDDL.push({ title: this.campusCityList[this.campusCityList.indexOf(e) - 1].cityName, group: this.campusddl })
                        this.campusddl = []
                        this.campusddl.push({ id: e.campusId, text: e.campusName })
                    }
                    oldObj = e;
                })
                this.cityDDL.push({ title: oldObj.cityName, group: this.campusddl })
                //  console.log(JSON.stringify(this.programDDL))



            })
    }

    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }
    loadSection() {
        this.campusProgramId = '';
        this.sectionCourseLinkList = [];
        this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId
        var key = this.campusId + "?" + this.campusProgramId  + "?" + this.classId
        this.SectionCourserepository.GetSectionData(key)
            .then(response => {
                this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
            });
    }
    // loadSections(key: string) {
    //     this.enrollmentRepo.GetSectionList(key)
    //         .then(r => {
    //             this.courseList = r as Array<ICourseSection>

    //             // console.log(this.sectionList==null)
    //             //alert(this.courseList.length)
    //             if (this.courseList.length == 0) {
    //                 this.$store.dispatch(StoreTypes.updateStatusBar, {
    //                     text: 'Section not Defined',
    //                     title: 'warning',
    //                     messageTypeId: PayloadMessageTypes.warning
    //                 });
    //             }
    //         })
    // }



    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('examResultApproval' in this.user.claims) == true) {
                if (this.user.claims['examResultApproval'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examResultApproval'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examResultApproval'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examResultApproval'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    // loadCourses() {
    //     this.date = new Date();
    //     if (this.campusProgramId.length > 0 && this.date != null) {
    //         var key = this.campusProgramId + '?' + this.datestring
    //         this.attendanceDetailRepo.GetCourseSection(key)
    //             .then(response => {
    //                 this.courseList = (response as Array<ICourseSection>);
    //                 if (this.courseList.length == 0) {
    //                     this.$store.dispatch(StoreTypes.updateStatusBar, {
    //                         text: 'Courses not Defined',
    //                         title: 'warning',
    //                         messageTypeId: PayloadMessageTypes.warning
    //                     });
    //                 }
    //             });
    //     }
    // }
    refreshData() {

        this.data = [];
        // this.date=new Date(this.date);
        if (this.campusId.length > 0  && this.sessionId.length > 0) {
            var key = this.campusId + '?' + this.sessionId + '?' +this.programDetailId + "?" + this.classId + '?' +this.sectionId
            this.examMasterRepo.GetExamResultApprovalData(key)
                .then(response => {
                    this.data = (response as Array<IExamResultApproval>)
                    //console.log(JSON.stringify(this.data))
                });
        }
    }

    insertModel() {
        var list = this.data.filter(s => s.isApproved)
        // this.attendanceMasterRepo.UpdateBulk(list)
        //     .then(r => {
        //         this.$store.dispatch(StoreTypes.updateStatusBar, {
        //             text: 'Approved Successfully',
        //             title: 'success',
        //             messageTypeId: PayloadMessageTypes.success
        //         });
        //     })

        let ides = '';
        this.data.forEach(e=>{
            if(e.isApproved){
                ides+= `'` +e.examMasterId+`',`
            }
        })

        ides=ides.substring(0,ides.length-1);
        if(ides.length>0){
            this.examMasterRepo.UpdateBulkVM(ides)
            .then(r=>{
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Approved Successfully',
                    title: 'success',
                    messageTypeId: PayloadMessageTypes.success
                });
            })
        }
        this.refreshData();
    }

    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }


}