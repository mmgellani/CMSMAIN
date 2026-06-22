/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { DDLGroupModel, DDLModel, ICampusCityVM, IFeeConcession, IFeeConcessionDetail, IFeeConcessionDetailVM, IFeeScholarshipCriteriaVM, IRegistrationSectionCourseLinkVM, IScholarshipApplyVM, IScholarshipStudentModel, ISetupAdmissionType, ISetupCampus, ISetupCampusProgramVM, ISetupClass, ISetupGender, ISetupProgramDetails, ISetupProgramDetailsVM, ISetupSession, ISetupShift, IStudentEnrolledVM, IStudentModel, IStudentToEnrollVM } from '../../../../models';
import { FeeConcessionDetailService, FeeConcessionService, FeeScholarshipCriteriaService, RegistrationEnrollmentsService, SetupAdmissionTypeService, SetupCampusProgramLinkService, SetupCampusService, SetupClassService, SetupGenderService, SetupProgramDetailsService, SetupSessionService, SetupShiftService } from '../../../../service';
import { IUser, PayloadMessageTypes } from '../../../../../../model';

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class EnrollmentReverse extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;

    private datas: Array<IStudentEnrolledVM> = [];
    private filterString: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    //private shiftId = ''
    private percentageFrom = 1
    private percentageTo = 99
    private scholarshipCriteriaId = ''
    //private selected:any;
    private campusProgramId = '';
    private classid: string = '';
    private repoClass = new SetupClassService(this.$store);
    private title = 'Confirmation';

    //private scholarhipList: Array<IScholarshipApplyVM> = []
    private campusList: Array<ISetupCampus> = []
    classList: Array<ISetupClass> = []
    private sessionList: Array<ISetupSession> = []
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = []
    private shiftList: Array<ISetupShift> = []
    private programDDL: Array<DDLGroupModel> = []
    private ddl: Array<DDLModel> = []
    private scholarshipCriteriaList: Array<IFeeScholarshipCriteriaVM> = []
    private sectionList: Array<IRegistrationSectionCourseLinkVM> = [];
    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private genderRepo: SetupGenderService;
    private genderModel: Array<ISetupGender> = [];
    private idGender: string = "";
    admissionTypeId: string = "";
    private admissionTypeList: Array<ISetupAdmissionType> = [];

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private admisisonTypeRepo: SetupAdmissionTypeService;



    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private searchText = ''
    private admissionformid = ''

    private columns = [
        { key: 'refferenceNo', caption: 'Refference No' },
        { key: 'fullName', caption: `Student's Name` },
        { key: 'sectionName', caption: 'Section' },
        { key: 'rollNo', caption: 'Roll No.' },
        { key: 'className', caption: 'Class Name' },
        { key: 'action', caption: 'Action', width: 120 }
    ];


    loadData() {
        if (this.searchText.length > 0) {
            this.enrollmentRepo.GetEnrolledStudent(this.searchText + '?' + this.user.userId)
                .then(r => {
                    this.datas = r as Array<IStudentEnrolledVM>
                })
        }

    }
    mounted() {
        this.validatePage();
        //this.loadData();

    }


    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('enrollmentReverse' in this.user.claims) == true) {
                if (this.user.claims['enrollmentReverse'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['enrollmentReverse'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['enrollmentReverse'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['enrollmentReverse'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {

        this.loadData();

    }

    shwbutn(admissioid:any)
    {
        var z=this.datas.filter(e=>e.admissionFormId==admissioid && e.classId=='8931d744-acc9-4776-a03a-2b705038ea48')
        if(z.length>0)
        return false;
        return true;



    }


    save() {

        this.enrollmentRepo.ReverseEnrollment(this.admissionformid)
            .then(r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: r,
                    title: '',
                    messageTypeId: PayloadMessageTypes.success
                });
                this.loadData()
            })
    }

    insertModel(admformid: string) {
        this.admissionformid = admformid;
    }



}