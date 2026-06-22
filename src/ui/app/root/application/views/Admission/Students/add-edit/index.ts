/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import moment from "moment";

import { IVWStudentsProfile, IVWStudentFeeProfile, StudentChallanINfoData, AttendenceMonthWise,AttendencePercentages,IAttendanceAttendanceStudentInfo, ExamMonthWise, IExamMonthlyReport, IVWStudentsProfileEx, PreviousAcademicRecord, ProgramCourseList, IAcademicMarks, IExamMonthlyReportExx ,IStudentProfileApproved,IStudentProfileUnApproved,IStudentProfileCourseView,IStudentProfileCourseViewUnApproved } from '../../../../models';
//import { AdmissionStudentEdit } from '../edit';
import { AdmissionStudentsService, AttendanceAttendenceMasterService } from '../../../../service';
import { AdmissionStudentEdit } from '../edit-student';
import { AdmissionStudentsDelete } from '../delete';
import { ExaminationReportsService } from '../../../../service/Reports/ExaminationReports';
import { ExamStudents } from '../examination-info';
import { AssessmentInfo } from '../assessment-info';

import { StruckoffReinstateService } from '../../../../service/Admission/StruckoffReinstate';
import { StruckoffReinstate } from '../../StruckoffReinstate/list';
import { MessageDetailStud,migrationtransferlist} from '../../../../models/Message/message';
import { Console } from 'console';
import { RootStoreTypes } from '../../../../../store/types';
import { lowerCase } from 'lodash';
import { datePropsToTimestamps } from 'highcharts';
import { convertCompilerOptionsFromJson } from 'typescript';
import { AssessmentSchemeMasterService } from "../../../../service/Assessment/AssesmentMaster";
import { MessageService } from '../../../../service/Message/message-service';

import { PayloadMessageTypes } from '../../../../../../model';
import { StoreTypes } from '../../../../../../store';
type ValidateAdmissionStudents = { model: IVWStudentsProfile, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateAdmissionStudents> = {
    model: {
        fullName: { required },
        fatherName: { required },
        studentCNIC: { required },
        parentCNIC: { required },
        genderId: { required },
        dateOfBirth: { required },
        studentContactNo: { required },
        parentContactNo: { required },
        bloodGroupId: { required },
        religionId: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'edit-model': AdmissionStudentEdit,
        'delete-model': AdmissionStudentsDelete,
        'exam-model': ExamStudents,
        'assessment-model':AssessmentInfo

    }
})
export class AdmissionStudentsAddEdit extends Vue {


    private isActive: boolean = true;

    private admissionFormId: string = "";
    private data: Array<StudentChallanINfoData> = []
    private data2: Array<StudentChallanINfoData> = []

    private attedata: Array<AttendenceMonthWise> = [];
    private attedataperc: Array<AttendencePercentages> = [];
    private Data: any = [];
    private examdata: Array<ExamMonthWise> = [];
    private examdataUn: Array<ExamMonthWise> = [];
    private msgdetaillist: Array<MessageDetailStud> = [];
    private studentProfileApproved: Array<IStudentProfileApproved> = [];
    private studentProfileApprovedEx: Array<IStudentProfileApproved> = [];

    private studentProfileUnApproved: Array<IStudentProfileUnApproved> = [];
    private studentProfileCourseView: any = [];
    private studentProfileCourseViewUnApproved: any = [];
        private selectedAttachments: any = [];

        private showAttachmentPopup: boolean = false;

private showPopup :boolean = false;
    private migraiontransferlist: Array<migrationtransferlist>= [];
    private Struckofflist: Array<StruckoffReinstate> = [];
    private RollNo: string = '';
    private transferprogrec = '';
    private classname = '';
    messagesend = 0;
    private dated:any=[];
    private Showattendence=false;
    private migratedrec = '';
    private classid = '';
    private subjectlist: any = [];
    private subjectlist2: any = []; 
    private ExamData: any = [];
    private reportData: any;
    private preacademicInfo = [];
    private programCourse: Array<ProgramCourseList> = [];
    private academicMarks: Array<IAcademicMarks> = [];
    private report: String = "";
    private repository: AdmissionStudentsService;
    private datas: IVWStudentsProfileEx = {
        guardianName: '', image: '', shouldAbsent: false,
        admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
        academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
        studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
        bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "", sessionName: ""
    };

    private dataE: any;
    private IsNewRecord: boolean = true;
    private title: string = 'View Information';
    private reposstudent: AdmissionStudentsService;
    private attendenceMasterrepo: AttendanceAttendenceMasterService = null;
    private examrepository: ExaminationReportsService = new ExaminationReportsService(this.$store);
    private struckoffservice: StruckoffReinstateService = new StruckoffReinstateService(this.$store)
    private assessmentmasterrepository: AssessmentSchemeMasterService = new AssessmentSchemeMasterService(this.$store);

    private displayAttendance: boolean = false;
    private displayExamination: boolean = false;
    private displayAssessment: boolean = false;
    private messageDate: Date = new Date();
    private messageDate2: Date = new Date();
    private listDate: Date ;
    private deta: any = [];

    private paidCount: number = 0;
    private startRow: number = 0;
    private rowsPerPage: number = 3;
    private pageSizeMenu = [10, 20, 50, 100];



    get shouldDisplay() {
        return !this.displayAttendance && !this.displayExamination && !this.displayAssessment;
    }

    created() {
        this.repository = new AdmissionStudentsService(this.$store);
        this.reposstudent = new AdmissionStudentsService(this.$store);
        this.attendenceMasterrepo = new AttendanceAttendenceMasterService(this.$store);
        this.assessmentmasterrepository = new AssessmentSchemeMasterService(this.$store);
        this.Struckofflist = [];
        //this.migraiontransferlist = [];

    }

    // editModel(model: IVWStudentsProfile,models: IVWStudentFeeProfile) {
    //     this.$modal.show('edit-model', { model: model, IsNewRecord: false });
    // }

    navItems = [
        {
            name: 'Personal Info',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                height="24px" viewBox="0 0 24 24" version="1.1"
                class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none"
                    fill-rule="evenodd">
                    <polygon points="0 0 24 0 24 24 0 24"></polygon>
                    <path
                        d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z"
                        fill="#ffffff" fill-rule="nonzero" opacity="0.3">
                    </path>
                    <path
                        d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z"
                        fill="#ffffff" fill-rule="nonzero"></path>
                </g>
                </svg>
                `

        },
        {
            name: 'Fee Info',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="11.5" y="2" width="2" height="4" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="11.5" y="16" width="2" height="5" rx="1"></rect>
                    <path d="M15.493,8.044 C15.2143319,7.68933156 14.8501689,7.40750104 14.4005,7.1985 C13.9508311,6.98949895 13.5170021,6.885 13.099,6.885 C12.8836656,6.885 12.6651678,6.90399981 12.4435,6.942 C12.2218322,6.98000019 12.0223342,7.05283279 11.845,7.1605 C11.6676658,7.2681672 11.5188339,7.40749914 11.3985,7.5785 C11.2781661,7.74950085 11.218,7.96799867 11.218,8.234 C11.218,8.46200114 11.2654995,8.65199924 11.3605,8.804 C11.4555005,8.95600076 11.5948324,9.08899943 11.7785,9.203 C11.9621676,9.31700057 12.1806654,9.42149952 12.434,9.5165 C12.6873346,9.61150047 12.9723317,9.70966616 13.289,9.811 C13.7450023,9.96300076 14.2199975,10.1308324 14.714,10.3145 C15.2080025,10.4981676 15.6576646,10.7419985 16.063,11.046 C16.4683354,11.3500015 16.8039987,11.7268311 17.07,12.1765 C17.3360013,12.6261689 17.469,13.1866633 17.469,13.858 C17.469,14.6306705 17.3265014,15.2988305 17.0415,15.8625 C16.7564986,16.4261695 16.3733357,16.8916648 15.892,17.259 C15.4106643,17.6263352 14.8596698,17.8986658 14.239,18.076 C13.6183302,18.2533342 12.97867,18.342 12.32,18.342 C11.3573285,18.342 10.4263378,18.1741683 9.527,17.8385 C8.62766217,17.5028317 7.88033631,17.0246698 7.285,16.404 L9.413,14.238 C9.74233498,14.6433354 10.176164,14.9821653 10.7145,15.2545 C11.252836,15.5268347 11.7879973,15.663 12.32,15.663 C12.5606679,15.663 12.7949989,15.6376669 13.023,15.587 C13.2510011,15.5363331 13.4504991,15.4540006 13.6215,15.34 C13.7925009,15.2259994 13.9286662,15.0740009 14.03,14.884 C14.1313338,14.693999 14.182,14.4660013 14.182,14.2 C14.182,13.9466654 14.1186673,13.7313342 13.992,13.554 C13.8653327,13.3766658 13.6848345,13.2151674 13.4505,13.0695 C13.2161655,12.9238326 12.9248351,12.7908339 12.5765,12.6705 C12.2281649,12.5501661 11.8323355,12.420334 11.389,12.281 C10.9583312,12.141666 10.5371687,11.9770009 10.1255,11.787 C9.71383127,11.596999 9.34650161,11.3531682 9.0235,11.0555 C8.70049838,10.7578318 8.44083431,10.3968355 8.2445,9.9725 C8.04816568,9.54816454 7.95,9.03200304 7.95,8.424 C7.95,7.67666293 8.10199848,7.03700266 8.406,6.505 C8.71000152,5.97299734 9.10899753,5.53600171 9.603,5.194 C10.0970025,4.85199829 10.6543302,4.60183412 11.275,4.4435 C11.8956698,4.28516587 12.5226635,4.206 13.156,4.206 C13.9160038,4.206 14.6918294,4.34533194 15.4835,4.624 C16.2751706,4.90266806 16.9686637,5.31433061 17.564,5.859 L15.493,8.044 Z" fill="#ffffff"></path>
                </g>
                </svg>
                `

        },
        {
            name: ' Academic Info',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24"></rect>
                    <path d="M8,3 L8,3.5 C8,4.32842712 8.67157288,5 9.5,5 L14.5,5 C15.3284271,5 16,4.32842712 16,3.5 L16,3 L18,3 C19.1045695,3 20,3.8954305 20,5 L20,21 C20,22.1045695 19.1045695,23 18,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,5 C4,3.8954305 4.8954305,3 6,3 L8,3 Z" fill="#ffffff" opacity="0.3"></path>
                    <path d="M11,2 C11,1.44771525 11.4477153,1 12,1 C12.5522847,1 13,1.44771525 13,2 L14.5,2 C14.7761424,2 15,2.22385763 15,2.5 L15,3.5 C15,3.77614237 14.7761424,4 14.5,4 L9.5,4 C9.22385763,4 9,3.77614237 9,3.5 L9,2.5 C9,2.22385763 9.22385763,2 9.5,2 L11,2 Z" fill="#ffffff"></path>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="9" width="7" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="9" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="13" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="13" width="7" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="17" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="17" width="7" height="2" rx="1"></rect>
                </g>
            </svg>
                `

        },
        {
            name: ' Attendance Info',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24"></rect>
                    <path d="M8,3 L8,3.5 C8,4.32842712 8.67157288,5 9.5,5 L14.5,5 C15.3284271,5 16,4.32842712 16,3.5 L16,3 L18,3 C19.1045695,3 20,3.8954305 20,5 L20,21 C20,22.1045695 19.1045695,23 18,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,5 C4,3.8954305 4.8954305,3 6,3 L8,3 Z" fill="#ffffff" opacity="0.3"></path>
                    <path d="M11,2 C11,1.44771525 11.4477153,1 12,1 C12.5522847,1 13,1.44771525 13,2 L14.5,2 C14.7761424,2 15,2.22385763 15,2.5 L15,3.5 C15,3.77614237 14.7761424,4 14.5,4 L9.5,4 C9.22385763,4 9,3.77614237 9,3.5 L9,2.5 C9,2.22385763 9.22385763,2 9.5,2 L11,2 Z" fill="#ffffff"></path>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="9" width="7" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="9" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="13" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="13" width="7" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="17" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="17" width="7" height="2" rx="1"></rect>
                </g>
            </svg>
                `

        },
        {
            name: 'Assessment Info',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24"></rect>
                    <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#ffffff" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "></path>
                    <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#ffffff" fill-rule="nonzero" opacity="0.3"></path>
                </g>
                </svg>
                `
        },
        {
            name: 'Exam Info',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24"></rect>
                    <path d="M12.2674799,18.2323597 L12.0084872,5.45852451 C12.0004303,5.06114792 12.1504154,4.6768183 12.4255037,4.38993949 L15.0030167,1.70195304 L17.5910752,4.40093695 C17.8599071,4.6812911 18.0095067,5.05499603 18.0083938,5.44341307 L17.9718262,18.2062508 C17.9694575,19.0329966 17.2985816,19.701953 16.4718324,19.701953 L13.7671717,19.701953 C12.9505952,19.701953 12.2840328,19.0487684 12.2674799,18.2323597 Z" fill="#ffffff" fill-rule="nonzero" transform="translate(14.701953, 10.701953) rotate(-135.000000) translate(-14.701953, -10.701953) "></path>
                    <path d="M12.9,2 C13.4522847,2 13.9,2.44771525 13.9,3 C13.9,3.55228475 13.4522847,4 12.9,4 L6,4 C4.8954305,4 4,4.8954305 4,6 L4,18 C4,19.1045695 4.8954305,20 6,20 L18,20 C19.1045695,20 20,19.1045695 20,18 L20,13 C20,12.4477153 20.4477153,12 21,12 C21.5522847,12 22,12.4477153 22,13 L22,18 C22,20.209139 20.209139,22 18,22 L6,22 C3.790861,22 2,20.209139 2,18 L2,6 C2,3.790861 3.790861,2 6,2 L12.9,2 Z" fill="#ffffff" fill-rule="nonzero" opacity="0.3"></path>
                </g>
                </svg>
                `
        },
        {
            name: 'Struck Off Info',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <polygon points="0 0 24 0 24 24 0 24"/>
                    <path d="M3.52270623,14.028695 C2.82576459,13.3275941 2.82576459,12.19529 3.52270623,11.4941891 L11.6127629,3.54050571 C11.9489429,3.20999263 12.401513,3.0247814 12.8729533,3.0247814 L19.3274172,3.0247814 C20.3201611,3.0247814 21.124939,3.82955935 21.124939,4.82230326 L21.124939,11.2583059 C21.124939,11.7406659 20.9310733,12.2027862 20.5869271,12.5407722 L12.5103155,20.4728108 C12.1731575,20.8103442 11.7156477,21 11.2385688,21 C10.7614899,21 10.3039801,20.8103442 9.9668221,20.4728108 L3.52270623,14.028695 Z M16.9307214,9.01652093 C17.9234653,9.01652093 18.7282432,8.21174298 18.7282432,7.21899907 C18.7282432,6.22625516 17.9234653,5.42147721 16.9307214,5.42147721 C15.9379775,5.42147721 15.1331995,6.22625516 15.1331995,7.21899907 C15.1331995,8.21174298 15.9379775,9.01652093 16.9307214,9.01652093 Z" fill="#ffffff" fill-rule="nonzero" opacity="0.3"/>
                </g>
            </svg>
                `
        }, {
            name: 'Transfer/ Migration Info',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <polygon points="0 0 24 0 24 24 0 24"/>
                   <path d="M14,13.381038 L14,3.47213595 L7.99460483,15.4829263 L14,13.381038 Z M4.88230018,17.2353996 L13.2844582,0.431083506 C13.4820496,0.0359007077 13.9625881,-0.12427877 14.3577709,0.0733126292 C14.5125928,0.15072359 14.6381308,0.276261584 14.7155418,0.431083506 L23.1176998,17.2353996 C23.3152912,17.6305824 23.1551117,18.1111209 22.7599289,18.3087123 C22.5664522,18.4054506 22.3420471,18.4197165 22.1378777,18.3482572 L14,15.5 L5.86212227,18.3482572 C5.44509941,18.4942152 4.98871325,18.2744737 4.84275525,17.8574509 C4.77129597,17.6532815 4.78556182,17.4288764 4.88230018,17.2353996 Z" fill="#ffffff" fill-rule="nonzero" transform="translate(14.000087, 9.191034) rotate(-315.000000) translate(-14.000087, -9.191034) "/>
                </g>
                </svg> `
        },
        {
            name: 'SMS Info',
            icon:
                `
               <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                     <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                       <rect x="0" y="0" width="24" height="24"/>
                       <path d="M5,6 L19,6 C20.1045695,6 21,6.8954305 21,8 L21,17 C21,18.1045695 20.1045695,19 19,19 L5,19 C3.8954305,19 3,18.1045695 3,17 L3,8 C3,6.8954305 3.8954305,6 5,6 Z M18.1444251,7.83964668 L12,11.1481833 L5.85557487,7.83964668 C5.4908718,7.6432681 5.03602525,7.77972206 4.83964668,8.14442513 C4.6432681,8.5091282 4.77972206,8.96397475 5.14442513,9.16035332 L11.6444251,12.6603533 C11.8664074,12.7798822 12.1335926,12.7798822 12.3555749,12.6603533 L18.8555749,9.16035332 C19.2202779,8.96397475 19.3567319,8.5091282 19.1603533,8.14442513 C18.9639747,7.77972206 18.5091282,7.6432681 18.1444251,7.83964668 Z" fill="#ffffff"/>
                      </g>
                </svg>
               `
        }
        ,
        {
            name: 'Certificates & Letters',
            icon:
                `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <rect x="0" y="0" width="24" height="24"></rect>
                    <path d="M8,3 L8,3.5 C8,4.32842712 8.67157288,5 9.5,5 L14.5,5 C15.3284271,5 16,4.32842712 16,3.5 L16,3 L18,3 C19.1045695,3 20,3.8954305 20,5 L20,21 C20,22.1045695 19.1045695,23 18,23 L6,23 C4.8954305,23 4,22.1045695 4,21 L4,5 C4,3.8954305 4.8954305,3 6,3 L8,3 Z" fill="#ffffff" opacity="0.3"></path>
                    <path d="M11,2 C11,1.44771525 11.4477153,1 12,1 C12.5522847,1 13,1.44771525 13,2 L14.5,2 C14.7761424,2 15,2.22385763 15,2.5 L15,3.5 C15,3.77614237 14.7761424,4 14.5,4 L9.5,4 C9.22385763,4 9,3.77614237 9,3.5 L9,2.5 C9,2.22385763 9.22385763,2 9.5,2 L11,2 Z" fill="#ffffff"></path>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="9" width="7" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="9" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="13" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="13" width="7" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="7" y="17" width="2" height="2" rx="1"></rect>
                    <rect fill="#ffffff" opacity="0.3" x="10" y="17" width="7" height="2" rx="1"></rect>
                </g>
            </svg> `
        }
    ]




    //     <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/keen/releases/2020-10-07-041015/theme/demo1/dist/../src/media/svg/icons/Map/Direction2.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
    //     <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    //         <rect x="0" y="0" width="24" height="24"/>
    //         <path d="M14,13.381038 L14,3.47213595 L7.99460483,15.4829263 L14,13.381038 Z M4.88230018,17.2353996 L13.2844582,0.431083506 C13.4820496,0.0359007077 13.9625881,-0.12427877 14.3577709,0.0733126292 C14.5125928,0.15072359 14.6381308,0.276261584 14.7155418,0.431083506 L23.1176998,17.2353996 C23.3152912,17.6305824 23.1551117,18.1111209 22.7599289,18.3087123 C22.5664522,18.4054506 22.3420471,18.4197165 22.1378777,18.3482572 L14,15.5 L5.86212227,18.3482572 C5.44509941,18.4942152 4.98871325,18.2744737 4.84275525,17.8574509 C4.77129597,17.6532815 4.78556182,17.4288764 4.88230018,17.2353996 Z" fill="#ffffff" fill-rule="nonzero" transform="translate(14.000087, 9.191034) rotate(-315.000000) translate(-14.000087, -9.191034) "/>
    //     </g>
    // </svg><!--end::Svg Icon--></span>

    // selectedTab = []
    activeIndex = 0;
    setActive(item, index) {
        this.displayAttendance = false;
        this.displayExamination = false;
        this.displayAssessment=false;
        this.activeIndex = index;

    }

    movePages(amount) {
        if (this.msgdetaillist !== undefined) {
            let newStartRow = this.startRow + (amount * this.rowsPerPage);
            if (newStartRow >= 0 && newStartRow < this.msgdetaillist.length) {
                this.startRow = newStartRow;
            }
        }
    }


    moveFirtst() {
        if (this.msgdetaillist !== undefined) {
            this.startRow = 1;
        }
    }

    moveLast() {
        if (this.msgdetaillist !== undefined) {
            this.startRow = Math.round(this.msgdetaillist.length / this.rowsPerPage);
        }
    }

    get dataPerPage() {
        return this.msgdetaillist !== undefined ? this.msgdetaillist.filter((item, index) => index >= this.startRow && index < (this.startRow + this.rowsPerPage)) : '';
    }


    getPhone(item) {
        return JSON.parse(item);
    }
    getAddress(item) {
        return JSON.parse(item);
    }

    beforeModalOpen(event) {

        // this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.datas, event.params.model);
        console.log(JSON.stringify(this.datas))
        this.IsNewRecord = event.params.IsNewRecord;
        this.admissionFormId = this.datas.admissionFormId;
        this.classname = event.params.CLASSNAME;
        this.classid = event.params.CLASSID;
        this.RollNo = this.datas.rollNo;
        // alert(this.admissionFormId);
        this.getstudentFee();
        this.getstudentAttendence();
        this.getstudentExam();
        this.getstudentExamUnApproved();
        this.getstudentAssessment();
        this.getstudentAssessmentUnApproved();
        this.getStudentStruckoffList();
        this.GetProgramTransferRecord();
        this. GetProgramMigrationTransferRecord();
        this.GetMigratedRecord();
        this.GetMessageCount();
        this.loadAcademicInfo();
        this.loadCourse();
        this.getstudentFeeInfo();
        this.getstudentFeeUnpiad();
        this.activeIndex = 0
        this.displayAttendance = false;
        this.displayExamination = false;
        this.displayAssessment=false;

    }

    private matData: any = [];
    private intData: any = [];
    loadAcademicInfo() {
        this.academicMarks = [];
        this.matData = [];
        this.intData = [];
        this.repository.GetAcademicMarks(this.datas.studentId).then(r => {
            this.academicMarks = r as Array<IAcademicMarks>;

            this.academicMarks.forEach(element => {
                if (lowerCase(element.degree).match(/.*matric.*/)) {
                    this.matData.push({
                        courseName: element.courseName,
                        obtainedMarks: element.obtainedMarks,
                        totalMarks: element.totalMarks
                    });
                }

            });
            this.academicMarks.forEach(element => {
                if (element.degree == '1st-Year') {
                    this.intData.push({
                        courseName: element.courseName,
                        obtainedMarks: element.obtainedMarks,
                        totalMarks: element.totalMarks
                    });
                }

            });
        })

    }



    loadCourse() {
        this.repository.GetProgramCourse().then(r => {
            this.programCourse = r as Array<ProgramCourseList>;

        });
    }

    AttendencePercentage() {
        this.Showattendence=true
        this.attedataperc = [];
        // var key = this.admissionFormId 
        this.attendenceMasterrepo.GetAttendencePercentage(this.admissionFormId + '?' + this.classid+ '?'+   this.listDate.toDateString()  )
            .then(response => {
                this.attedataperc = response[0] as Array<AttendencePercentages>
                console.log( this.attedataperc);

            }
            );
        
    }

    getStudentStruckoffList() {
        this.Struckofflist = [];

        this.struckoffservice.GetStudentStruckoff(this.admissionFormId).then(r => {
            this.Struckofflist = r as Array<StruckoffReinstate>

        })
    }
    GetProgramTransferRecord() {
        this.transferprogrec = '';
        // var key = this.admissionFormId 
        this.reposstudent.GetStudentTransferRecord(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.transferprogrec = response;
            }
            );
    }

    GetProgramMigrationTransferRecord() {
        this.migraiontransferlist=[];
      
        // var key = this.admissionFormId 
        this.repository.GetTransferMigratedRecord(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.migraiontransferlist = response;
                this.migraiontransferlist.forEach(
e=>e.dateTime= moment(e.dateTime).format("YYYY/MM/DD") 
                )
            }
            );
    }
    GetMessageCount() {
        this.messagesend = 0;
        // var key = this.admissionFormId 
        this.reposstudent.GetMessageCount(this.admissionFormId)
            .then(response => {
                this.messagesend = response;
            }
            );
    }
    GetMigratedRecord() {
        this.migratedrec = '';
        // var key = this.admissionFormId 
        this.reposstudent.GetStudentMigratedRec(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.migratedrec = response;
            }
            );
    }




    
//   viewAttachment(item) {
//     this.selectedAttachments = item.attachments || [];
//     this.showAttachmentPopup = true;
//   }
//   downloadAttachment(item) {
//     console.log("Download attachments for:", item);
//   }
//   closeAttachmentModal() {
//     this.showAttachmentPopup = false;
//   }




  viewAttachment(item: any) {
    this.showAttachmentPopup = true;

    this.showPopup=true;
  const images = Array.isArray(item.image)
    ? item.image
    : item.image ? [item.image] : [];

  if (images.length > 0) {
    this.selectedAttachments = images;
    this.showAttachmentPopup = true; // popup open
  } else {
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: 'No attachments found for this record.',
      title: 'Info',
      messageTypeId: PayloadMessageTypes.info
    });
  }
}
async downloadAttachment(item: any) {
  const images = Array.isArray(item.image)
    ? item.image
    : item.image ? [item.image] : [];

  if (images.length === 0) {
    this.$store.dispatch(StoreTypes.updateStatusBar, {
      text: 'No attachments found for this record.',
      title: 'Info',
      messageTypeId: PayloadMessageTypes.info
    });
    return;
  }

  for (let index = 0; index < images.length; index++) {
    const imgUrl = images[index];
    
    try {
      // Fetch the image as a blob
      const response = await fetch(imgUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      const blob = await response.blob();

      // Determine extension
      const parts = imgUrl.split('.');
      let extension = 'jpg';
      if (parts.length > 1) {
        extension = parts[parts.length - 1].split('?')[0];
      }

      // Create temporary link
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `attachment_${item.challanNo}_${index + 1}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Release memory
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download failed for', imgUrl, error);
      this.$store.dispatch(StoreTypes.updateStatusBar, {
        text: `Failed to download attachment ${index + 1}`,
        title: 'Error',
        messageTypeId: PayloadMessageTypes.error
      });
    }
  }
}




closeAttachmentModal() {
  this.showAttachmentPopup = false; // popup close
  this.selectedAttachments = [];
}

    getstudentFee() {
        this.data = [];
        // var key = this.admissionFormId 
        this.reposstudent.GetStudentChallanInfo(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.data = response as Array<StudentChallanINfoData>


            }
            );
    }
    getstudentFeeUnpiad() {
        this.data = [];
        // var key = this.admissionFormId 
        this.reposstudent.GetStudentChallanInfoUnpaid(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.data2 = response as Array<StudentChallanINfoData>

            }
            );
    }

    getstudentFeeInfo() {
        this.data = [];
        // var key = this.admissionFormId 
        this.reposstudent.GetStudentChallanPaidInfo(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.paidCount = response[0].val;


            }
            );
    }

    getcomma(item) {
        let value = item.toLocaleString();
        return value;
    }

    getstudentAttendence() {
        this.attedata = [];
        // var key = this.admissionFormId 
        this.attendenceMasterrepo.GetMonthlyAttendence(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.attedata = response as Array<AttendenceMonthWise>



            }
            );
    }

    getstudentExam() {
        this.examdata = [];
        // var key = this.admissionFormId 
        this.attendenceMasterrepo.GetMonthlyExam(this.admissionFormId + '?' + this.classid)
            .then(response => this.examdata = response as Array<ExamMonthWise>);
    }
    
    getstudentAssessment() {
        debugger
        this.studentProfileApproved = [];
        // var key = this.admissionFormId 
        this.assessmentmasterrepository.StudentProfileApproved(this.admissionFormId + '?' + this.classid)
            .then(response => this.studentProfileApproved = response as Array<IStudentProfileApproved>);
    } 

    getstudentExamUnApproved() {
        this.examdataUn = [];
        // var key = this.admissionFormId 
        this.attendenceMasterrepo.GetMonthlyExamUn(this.admissionFormId + '?' + this.classid)
            .then(response => this.examdataUn = response as Array<ExamMonthWise>);
    }
    getstudentAssessmentUnApproved() {
        this.studentProfileUnApproved = [];
        // var key = this.admissionFormId 
        this.assessmentmasterrepository.StudentProfileUnApproved(this.admissionFormId + '?' + this.classid)
            .then(response => this.studentProfileUnApproved = response as Array<IStudentProfileUnApproved>);
    }
    Bonafide() {
        console.log(JSON.stringify(this.datas))
        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.datas,
            path: '/assets/Reports/Resource/Admission/concern.xml',
            show: true
        });
    }
    LetterofRecommendation() {
        console.log(JSON.stringify(this.datas))
        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.datas,
            path: '/assets/Reports/Resource/Admission/letter_of_recomendation.xml',
            show: true
        });
    }
    EnglishProficienyCertificate() {
        console.log(JSON.stringify(this.datas))
        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.datas,
            path: '/assets/Reports/Resource/Admission/english-proficiency.xml',
            show: true
        });

    }
    CollegeLeavingCertificate() {

        console.log(JSON.stringify(this.data))
        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.datas,
            path: '/assets/Reports/Resource/Admission/leaving-certificate.xml',
            show: true
        });

    }

    StruckOfLetter() {

        console.log(JSON.stringify(this.datas))

        this.dataE = {
            guardianName: '', image: '', shouldAbsent: false,
            admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
            academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
            studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
            bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "", sessionName: ""
        };


        this.dataE = this.datas;


        if ((this.dataE.guardians[0].section)) {


        }
        else {
            this.dataE.guardians = JSON.parse(this.dataE.guardians)

        }



        console.log(JSON.stringify(this.dataE))

        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.dataE,
            path: '/assets/Reports/Resource/Admission/struckoff.xml',
            show: true
        });

    }

    InternshipLetter() {

        console.log(JSON.stringify(this.datas))

        this.dataE = {
            guardianName: '', image: '', shouldAbsent: false,
            admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
            academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
            studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
            bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "", sessionName: ""
        };


        this.dataE = this.datas;


        if ((this.dataE.guardians[0].section)) {


        }
        else {
            this.dataE.guardians = JSON.parse(this.dataE.guardians)

        }



        console.log(JSON.stringify(this.dataE))

        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.dataE,
            path: '/assets/Reports/Resource/Admission/internship-certificate.xml',
            show: true
        });

    }

    characterLetter() {

        console.log(JSON.stringify(this.datas))

        this.dataE = {
            guardianName: '', image: '', shouldAbsent: false,
            admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
            academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
            studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
            bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "", sessionName: ""
        };


        this.dataE = this.datas;


        if ((this.dataE.guardians[0].section)) {


        }
        else {
            this.dataE.guardians = JSON.parse(this.dataE.guardians)

        }



        console.log(JSON.stringify(this.dataE))

        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.dataE,
            path: '/assets/Reports/Resource/Admission/character-certificate.xml',
            show: true
        });

    }

    hopeLetter() {

        console.log(JSON.stringify(this.datas))

        this.dataE = {
            guardianName: '', image: '', shouldAbsent: false,
            admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
            academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
            studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
            bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "", sessionName: ""
        };


        this.dataE = this.datas;


        if ((this.dataE.guardians[0].section)) {


        }
        else {
            this.dataE.guardians = JSON.parse(this.dataE.guardians)

        }



        console.log(JSON.stringify(this.dataE))

        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.dataE,
            path: '/assets/Reports/Resource/Admission/hope-certificate.xml',
            show: true
        });

    }

    poorattendance() {

        console.log(JSON.stringify(this.datas))

        this.dataE = {
            guardianName: '', image: '', shouldAbsent: false,
            admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
            academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
            studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
            bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "", sessionName: ""
        };


        this.dataE = this.datas;


        if ((this.dataE.guardians[0].section)) {


        }
        else {
            this.dataE.guardians = JSON.parse(this.dataE.guardians)

        }



        console.log(JSON.stringify(this.dataE))

        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.dataE,
            path: '/assets/Reports/Resource/Admission/poor-attendance.xml',
            show: true
        });

    }

    umc() {

        console.log(JSON.stringify(this.datas))

        this.dataE = {
            guardianName: '', image: '', shouldAbsent: false,
            admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
            academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
            studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
            bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "", sessionName: ""
        };


        this.dataE = this.datas;


        if ((this.dataE.guardians[0].section)) {


        }
        else {
            this.dataE.guardians = JSON.parse(this.dataE.guardians)

        }



        console.log(JSON.stringify(this.dataE))

        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.dataE,
            path: '/assets/Reports/Resource/Admission/umc.xml',
            show: true
        });

    }

    frequentlatearrival() {

        console.log(JSON.stringify(this.datas))

        this.dataE = {
            guardianName: '', image: '', shouldAbsent: false,
            admissionFormId: "", campusProgramId: "", studentId: "", admissionTypeId: "", rollNo: "", refferenceNo: "",
            academicInfo: "", statusId: 0, loggerId: "", fullName: "", fatherName: "", studentCNIC: "", parentCNIC: "",
            studentContactNo: "", parentContactNo: "", guardians: "", genderId: "", dateOfBirth: "", address: "",
            bloodGroupId: "", religionId: "", campusId: "", sessionId: "", programDetailId: "", shiftId: "", description: "", campusName: "", cityName: "", sessionName: ""
        };


        this.dataE = this.datas;


        if ((this.dataE.guardians[0].section)) {


        }
        else {
            this.dataE.guardians = JSON.parse(this.dataE.guardians)

        }



        console.log(JSON.stringify(this.dataE))

        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.dataE,
            path: '/assets/Reports/Resource/Admission/frequent-late-arrival.xml',
            show: true
        });

    }

    SuspensionLetter() {



        this.$store.dispatch(RootStoreTypes.reportOperation, {
            data: this.datas,
            path: '/assets/Reports/Resource/Admission/suspension.xml',
            show: true
        });

    }



    InterCampusMigrationTemporary() {

        //for classname
        console.log(this.classname)

        this.reposstudent.GetStudentChallanInfo(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.data = response as Array<StudentChallanINfoData>

                this.deta = [];

                this.data.forEach(element => {
                    this.deta.push({
                        challanNo: element.challanNo,
                        installmentNo: element.installmentNo,
                        fullName: element.fullName,
                        dueDate: element.dueDate,
                        paidDate: element.paidDate,
                        feeAmount: element.feeAmount,
                        concession: element.concession
                    })
                });

                // this.deta.push({challanInfo:{this.deta}})

                // this.datas.forEach(element => {
                this.deta.push({
                    studentinfo: {
                        guardianName: this.datas.guardianName, classname: this.classname,
                        image: this.datas.image, shouldAbsent: this.datas.shouldAbsent,
                        admissionFormId: this.datas.admissionFormId, campusProgramId: this.datas.campusProgramId, rollNo: this.datas.rollNo, refferenceNo: this.datas.refferenceNo,
                        fullName: this.datas.fullName, fatherName: this.datas.fatherName, description: this.datas.description, campusName: this.datas.campusName, cityName: this.datas.cityName, sessionName: this.datas.sessionName
                    }
                })
                // });

                console.log(JSON.stringify(this.deta))
                this.$store.dispatch(RootStoreTypes.reportOperation, {
                    data: this.deta,
                    path: '/assets/Reports/Resource/Admission/intercampustemporary.xml',
                    show: true
                });

            }
            );
        //for challan info
        console.log(JSON.stringify(this.data))

        //for general info 
        console.log(JSON.stringify(this.datas))





    }
    InterCampusMigrationPermanent() {

        //class name 
        console.log(this.classname)

        this.reposstudent.GetStudentChallanInfo(this.admissionFormId + '?' + this.classid)
            .then(response => {
                this.data = response as Array<StudentChallanINfoData>

                this.deta = [];

                this.data.forEach(element => {
                    this.deta.push({
                        challanNo: element.challanNo,
                        installmentNo: element.installmentNo,
                        fullName: element.fullName,
                        dueDate: element.dueDate,
                        paidDate: element.paidDate,
                        feeAmount: element.feeAmount,
                        concession: element.concession
                    })
                });

                this.deta.push({
                    studentinfo: {
                        guardianName: this.datas.guardianName, classname: this.classname,
                        image: this.datas.image, shouldAbsent: this.datas.shouldAbsent,
                        admissionFormId: this.datas.admissionFormId, campusProgramId: this.datas.campusProgramId, rollNo: this.datas.rollNo, refferenceNo: this.datas.refferenceNo,
                        fullName: this.datas.fullName, fatherName: this.datas.fatherName, description: this.datas.description, campusName: this.datas.campusName, cityName: this.datas.cityName, sessionName: this.datas.sessionName
                    }
                })

                console.log(JSON.stringify(this.deta))
                this.$store.dispatch(RootStoreTypes.reportOperation, {
                    data: this.deta,
                    path: '/assets/Reports/Resource/Admission/intercampuspermanent.xml',
                    show: true
                });


            }
            );
        // challan info 
        console.log(JSON.stringify(this.data))

        // for general info

        console.log(JSON.stringify(this.datas))





    }

    ShowDetailLeave(startDate: any, endDate: any) {

        this.attendenceMasterrepo.GetStudentDetailINfo(this.admissionFormId + '?' + startDate + '?' + endDate + '?' + this.classid)
            .then(response => {
                this.Data = response as Array<IAttendanceAttendanceStudentInfo>;
                this.displayAttendance = true;

                // this.$modal.show('delete-model', { model: this.Data });
            }
            );
    }
    GetMessageDetail(startDate: any, enddate: any) {

        this.msgdetaillist = [];
        this.reposstudent.GetMessageDetail(this.admissionFormId + '?' + moment(startDate).format("YYYY/MM/DD") + '?' + moment(enddate).format("YYYY/MM/DD"))
            .then(response => {
                this.msgdetaillist = response as Array<MessageDetailStud>;


                // this.$modal.show('delete-model', { model: this.Data });
            }
            );
    }
    ShowExamDetail(examtypeid: any, dated: any , examScheduleName: any) {
        //var datestring = (dated.getFullYear(), dated.getMonth(), 1);
        var key = this.RollNo + '?' + examtypeid + '?' + dated + '?' + this.classid+'?' +examScheduleName;
        this.examrepository.GetExamIndiviReport(key).then(r => {
            this.ExamData = r as Array<IExamMonthlyReportExx>

            this.displayExamination = true;
            // this.$modal.show('exam-model', { model: this.ExamData });
        })

    }

    ShowExamDetailUn(examtypeid: any, dated: any , examScheduleName: any) {
        //var datestring = (dated.getFullYear(), dated.getMonth(), 1);
        var key = this.RollNo + '?' + examtypeid + '?' + dated + '?' + this.classid+'?' +examScheduleName;
        this.examrepository.GetExamIndiviReportUn(key).then(r => {
            this.ExamData = r as Array<IExamMonthlyReportExx>

            this.displayExamination = true;
            // this.$modal.show('exam-model', { model: this.ExamData });
        })

    }
    StudentProfileCourseView(assessmentScheduleId: any) { 
        this.studentProfileCourseView=[];
        var key = this.admissionFormId + '?' + assessmentScheduleId + '?'  + this.classid;
        this.assessmentmasterrepository.StudentProfileCourseView(key).then(r => {
            this.studentProfileCourseView = r as Array<IStudentProfileCourseView> 
            this.displayAssessment = true; 
        }) 

    }
 
    StudentProfileCourseViewUnApproved(assessmentScheduleId: any) {
        this.studentProfileCourseViewUnApproved=[]; 
        this.studentProfileCourseViewUnApproved=[];
        var key = this.admissionFormId + '?' + assessmentScheduleId +  '?' + this.classid;
        this.assessmentmasterrepository.StudentProfileCourseViewUnApproved(key).then(r => {
            this.studentProfileCourseViewUnApproved = r as Array<IStudentProfileCourseViewUnApproved>
            this.studentProfileCourseView=this.studentProfileCourseViewUnApproved;
            this.displayAssessment = true; 
        })

    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
        this.messageDate = new Date();
        this.messageDate = new Date();
        this.msgdetaillist = [];


    }


    $v: Vuelidate<any>;
}
