/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import { IExaminationExamDetail, IExaminationExamDetailVM, IExamDataVM, ISetupSession, ICampusCityVM, DDLGroupModel, DDLModel, ISetupCampusProgramVM, ISetupClass, IRegistrationSectionCourseLinkVM, RegistrationProgramCourseLinkVM } from '../../../../models';
import { ExaminationExamDetailService, SetupSessionService, SetupCampusService, SetupCampusProgramLinkService, SetupClassService, RegistrationSectionCourseLinkService, RegistrationProgramCourseLinkService } from '../../../../service';

import { ExaminationExamDetailAddEdit } from '../add-edit';
import { ExaminationExamDetailDelete } from '../delete';

@Component({
    name: 'models-form-list',
    template: require('./index.html'),
    components: {
        'add-edit-model': ExaminationExamDetailAddEdit,
        'delete-model': ExaminationExamDetailDelete
    }
})

export class ExaminationExamDetailList extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: ExaminationExamDetailService;
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store);
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store);
    private classRepo: SetupClassService = new SetupClassService(this.$store);
    private programCourseRepo: RegistrationProgramCourseLinkService = new RegistrationProgramCourseLinkService(this.$store);
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);
    private SectionCourserepository: RegistrationSectionCourseLinkService;
    private data: Array<IExamDataVM> = [];
    private sessionList: Array<ISetupSession> = [];
    private cityDDL: Array<DDLGroupModel> = [];
    private campusddl: Array<DDLModel> = [];
    private campusCityList: Array<ICampusCityVM> = [];
    private programDDL: Array<DDLGroupModel> = [];
    private ddl: Array<DDLModel> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    private sectionCourseLinkList: Array<IRegistrationSectionCourseLinkVM> = [];
    private courseLists: Array<RegistrationProgramCourseLinkVM> = [];
    private classList: Array<ISetupClass> = [];
    private filterString: string = '';
    private programDetailId = '';
    private campusId = '';
    private sessionId = '';
    private campusProgramId = '';
    private sectionCourseLinkId = '';
    private classId = '';
    private sectionId = '';
    private courseId = "";

    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;


    private columns = [ 
        { key: 'fullName', caption: 'Student' },
        { key: 'code', caption: 'AttendanceStatus' },
        { key: 'dated', caption: "Date" },
        { key: 'courseName', caption: 'Course Name' },
        { key: 'totalMarks', caption: 'Total Marks' },
        { key: 'obtainMarks', caption: 'ObtainMarks' }, 
        { key: 'gradeName', caption: "GradeName" },
        { key: 'statusId', caption: 'Status'  },
        { key: 'action', caption: 'Action', width: 120 }
    ];

    created() {
        this.repository = new ExaminationExamDetailService(this.$store);
        this.SectionCourserepository = new RegistrationSectionCourseLinkService(this.$store);
        this.loadSession();
    }

    mounted() {
        this.validatePage();
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('examinationExamDetail' in this.user.claims) == true) {
                if (this.user.claims['examinationExamDetail'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['examinationExamDetail'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['examinationExamDetail'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['examinationExamDetail'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }            
            } else {
                this.$router.push('Home');
            }
        }
    }
    

    loadSession() {
        this.sessionRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
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
                this.cityDDL.push({ title: oldObj.cityName, group: this.campusddl });
            })
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

    loadClass() {
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => { this.classList = r as Array<ISetupClass> });
    }

    loadSection() {
        this.campusProgramId = '';
        this.sectionCourseLinkList = [];
        this.campusProgramId = this.campusProgramLinkList.find(e => e.campusId == this.campusId && e.programDetailId == this.programDetailId).campusProgramId
        var key = this.campusId + "?" + this.campusProgramId + "?" + this.classId
        this.SectionCourserepository.GetSectionData(key)
            .then(response => {
                this.sectionCourseLinkList = response as Array<IRegistrationSectionCourseLinkVM>
            });
    }
    loadSectionCourse() {
        this.courseLists = [];
        var key = this.programDetailId + "?" + this.classId
        this.programCourseRepo.GetAllFilterData(key)
            .then(r => {
                this.courseLists = r as Array<RegistrationProgramCourseLinkVM>
            });
    }

    refreshData() {
        this.data = [];
        var key = this.sessionId + "?" + this.campusId + "?" + this.programDetailId + "?" + this.classId + "?" + this.sectionId + "?" + this.courseId
        this.repository.GetFindByVM(key)
            .then(response => this.data = (response as Array<IExamDataVM>));
}
    insertModel () {
        this.$modal.show('add-edit-model', { model: { admissionFormId: '', rollNo: '', fullName: '', examDetailId: '', examMasterId: '', attendanceStatusId: '', obtainMarks: 0 ,statusId: 0, gradingPolicyId: '', totalMarks: 0, campusId: '', programDetailId: '', campusProgramId: '',sessionId: '', dated: '', courseId: '', courseName: '', gradeName: '', code: '' }, IsNewRecord: true });
    }

    editModel (model : IExamDataVM) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel (model : IExamDataVM) {
        this.$modal.show('delete-model', { model: model });
    }
}