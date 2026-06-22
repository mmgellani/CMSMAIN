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

import { IFeeConcessionDetail, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceData, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, IAttendanceApprovalDataVM, IExaminationExamType, ISetupClass } from '../../../../models';
import { FeeConcessionDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, ExaminationExamMasterService, ExaminationExamDetailService, RegistrationSectionCourseLinkService, ExaminationExamTypeService, SetupClassService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import { IExamApproval } from '../../../../models/Examination/ExamApproval';

export interface INotificationCredntials {

    sesseion: string;
    campus: string;
    program: string;
    classstudent: string;
    section: string;
    rollno: string;
    notificationObject: {
        notification: string;
        type: string;
        title: string;
        image: string;
    }

    //notification code end

}
@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class ExamApproval extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private sectionId = ''
    private sectionCourseLinkId = ''
    private classId = ''
    private programDetailId = ''
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private date: Date = new Date();
    private datestring = ''
    private sectionCourseid = '';
    private fullDayAbsent = false;
    private dateMonth: string = "";
    private title = "Confirmation";
    private campus='';
    private CampusProgramId='';
    private cclassid='';
    private sectionCourseLink='';
    private srollno='';
    private Messaage='';
    private titletxt='';
    private imagetxt='';
    private notifType='';
    private session='';
    private campusList: Array<ISetupCampus> = []
   
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private attendanceStatusList: Array<IAttendanceAttendenceStatus> = []
    private attendanceMaster: IAttendanceAttendenceMaster;
    private attendanceDetailList: Array<IAttendanceAttendanceDetail> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private examTypeList: Array<IExaminationExamType> = [];


    private sectionRepo: RegistrationSectionCourseLinkService;
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    // private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseList: Array<ICourseSection> = [];
    private data: Array<IExamApproval> = [];//
    private examTypeId = '';




    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private examTypeRepo: ExaminationExamTypeService = new ExaminationExamTypeService(this.$store)

    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    //private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private examDetailRepo: ExaminationExamDetailService = new ExaminationExamDetailService(this.$store)
    private attendanceStatusRepo: AttendanceAttendenceStatusService = new AttendanceAttendenceStatusService(this.$store)
    private examMasterRepo: ExaminationExamMasterService = new ExaminationExamMasterService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private classList: Array<ISetupClass> = []


    private isCheckedAll: boolean = false;

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private columns = [
        { key: 'courseName', caption: 'Course' },
        { key: 'dayname', caption: 'Day' },
        { key: "dated", caption: 'Date' },
        { key: 'totalMarks', caption: 'Total Marks' },
        { key: 'isApproved', caption: 'Approve' }
    ];
    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.sectionRepo = new RegistrationSectionCourseLinkService(this.$store);
        // this.loadCampus();
        // this.loadCityCampus();
        // this.loadExamType();
        this.loadSession();
        this.datestring = this.date.getFullYear() + '-' + ("0" + (this.date.getMonth() + 1)).slice(-2) + '-' + ("0" + (this.date.getDate())).slice(-2);

    }


    mounted() {
        this.validatePage();
        // this.refreshData();
    }
   get canSave(){
        for(let i=0;i <this.data.length; i++){
            if(this.data[i].isApproved){
                return true;
                break;
            }
        }
        return false;
        
    }
    checkAll() {
        if (this.isCheckedAll) {
            this.data.forEach(e => {
                e.isApproved = true;
            })
        }
        else {
            this.data.forEach(e => {
                e.isApproved = false;
            })
        }

    }
    loadProgramsOfCampus() {
        if (this.campusId.length > 0) {
            this.ddl = [];
            this.programDDL = [];
            let oldObj: ISetupCampusProgramVM;
            var key = this.sessionId + "?" + this.campusId;
            this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }
    }

    loadCityCampus() {
        if (this.sessionId.length > 0) {
            this.campusddl = [];
            this.cityDDL = [];
            let oldObj: ICampusCityVM;
            this.campusRepo.GetCityVM().then(r => {
                this.campusCityList = r as Array<ICampusCityVM>;
            });
        }
    }

    loadCampus() {
        this.campusRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.campusList = r as Array<ISetupCampus>

            })
    }

    loadClass() {
        if (this.programDetailId.length > 0) {
            this.classId = ''
            this.sectionCourseLinkId = ''
            this.classRepo.GetFindBy('s=>s.StatusId==1')
                .then(r => { this.classList = r as Array<ISetupClass> });
        }
    }
    loadSection() {
        if (this.classId.length > 0) {
            this.data = [];
            this.sectionCourseLinkId = ''
            var cmid = this.campusProgramLinkList.find(s => s.campusId == this.campusId && s.programDetailId == this.programDetailId && s.sessionId == this.sessionId).campusProgramId;
            var key = this.campusId + "?" + cmid + "?" + this.classId
            this.sectionRepo.GetSectionData(key)
                .then(response => (this.sectionList = response as Array<IRegistrationSectionCourseLinkVM>));
        }
    }

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }

    loadSections(key: string) {
        this.enrollmentRepo.GetSectionList(key)
            .then(r => {
                this.courseList = r as Array<ICourseSection>

                // console.log(this.sectionList==null)
                //alert(this.courseList.length)
                if (this.courseList.length == 0) {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Section not Defined',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.warning
                    });
                }
            })
    }



    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('examApproval' in this.user.claims) == true) {
                if (this.user.claims['examApproval'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examApproval'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examApproval'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examApproval'].indexOf('D') >= 0) {
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
        // console.log(this.dateMonth.toString().charAt(0))
        if (this.dateMonth.toString().length > 0) {
            if (this.sectionCourseLinkId.length > 0 && this.examTypeId.length > 0) {
                var key = this.sectionCourseLinkId + "?" + (new Date(this.dateMonth).getFullYear()) + '-' + (((new Date(this.dateMonth).getMonth()) + 1).toString().length == 1 ? '0' + ((new Date(this.dateMonth).getMonth()) + 1) : ((new Date(this.dateMonth).getMonth()) + 1)) + "?" + this.examTypeId
                this.examMasterRepo.GetExamApprovalDataExDel(key)
                    .then(response => {
                        this.data = (response as Array<IExamApproval>)
                        //console.log(JSON.stringify(this.data))
                    });
            }
            else {
                this.data = [];
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Section or ExamType Missing',
                    title: 'warning',
                    messageTypeId: PayloadMessageTypes.warning
                });
            }
        }
    }

    loadExamType() {
        if (this.sectionCourseLinkId.length > 0) {
            this.examTypeRepo.GetFindBy('s=>s.StatusId!=2')
                .then(r => {
                    this.examTypeList = r as Array<IExaminationExamType>
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
        let smsid = '';
        this.data.forEach(e => {
            if (e.isApproved) {
                ides += `'` + e.examMasterId + `',`;
                smsid += `''` + e.examMasterId + `'',`
            }
        })

        ides = ides.substring(0, ides.length - 1);
        smsid = smsid.substring(1, smsid.length - 2);
        console.log(smsid)
        if (ides.length > 0) {
            this.examMasterRepo.UpdateBulk(ides + "?" + smsid)
                .then(r => {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Approved Successfully',
                        title: 'success',
                        messageTypeId: PayloadMessageTypes.success
                    });
                    this.refreshData();
                })
        }

    }

    editModel(model: IScholarshipApplyVM) {
        // this.$modal.show('add-edit-model', { model: this.datas.filter(s=>s.scholarshipName==model.scholarshipName)});
    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }
    
}