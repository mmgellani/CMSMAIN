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

import { IFeeConcessionDetail, IAttendanceAttendanceDetail, IAttendanceAttendenceStatus, ICourseSection, IAttendenceData, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, IAttendanceAttendenceMaster, ICampusCityVM, IAttendanceApprovalDataVM, IOperationAttendanceMaster, IAttendanceApprovalDataExVM, IFinanceData } from '../../../../models';
import { FeeConcessionDetailService, AttendanceAttendenceMasterService, AttendanceAttendenceStatusService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, AttendanceAttendanceDetailService, FeeStudentChallanService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import * as helper from '../../../../helper';
import moment from "moment";

@Component({
    name: 'models-form-list',
    template: require('./index.html')
    // components: {
    //     'add-edit-model': FeeApplyScholarshipAddEdit
    // }
})

export class FinanceData extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    // private repository: FeeConcessionDetailService;

    private datestring: Date = new Date();




    private datas: Array<IFinanceData> = [];
    // private updateList: Array<IUpdateAttendanceMaster> = []




    private repository: FeeStudentChallanService;



    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []
    private columns = [
        { key: "payDate", caption: 'PayDate' },
        { key: 'activity', caption: 'Activity' },
        { key: 'activity_DateTime', caption: 'Activity_DateTime' },
        { key: 'status_ID', caption: 'Status_ID' },
        { key: 'payable_Date', caption: 'Payable_Date' },
        { key: 'challan_Number', caption: 'Challan_Number' },
        { key: 'student_Name', caption: 'Student_Name' },
        { key: 'father_Name', caption: 'Father_Name' },
        { key: 'class', caption: 'Class' },
        { key: 'ref_No', caption: 'Ref_No' },
        { key: 'reg_No', caption: 'Reg_No' },
        { key: 'section', caption: 'Section' },
        { key: 'fee_For', caption: 'Fee_For' },
        { key: 'legal_Entity', caption: 'Legal_Entity' },
        { key: 'cluster', caption: 'Cluster' },
        { key: 'campus', caption: 'Campus' },
        { key: 'city', caption: 'City' },
        { key: 'program', caption: 'Program' },
        { key: 'description', caption: 'Description' },
        { key: 'session', caption: 'Session' },
        { key: 'academic_Year', caption: 'Academic_Year' },
        { key: 'bank_Name', caption: 'Bank_Name' },
        { key: 'admission', caption: 'Admission' },
        { key: 'discountOnAdmission', caption: 'DiscountOnAdmission' },
        { key: 'tuition', caption: 'Tuition' },
        { key: 'discountOnTuition', caption: 'DiscountOnTuition' },
        { key: 'misc_Charges', caption: 'Misc_Charges' },
        { key: 'discountOnBoardRegistration_Exam_Sport_CollegeCard_Building_Mis', caption: 'DiscountOnBoardRegistration' },
        { key: 'discountOnOtherFeeHeads', caption: 'DiscountOnOtherFeeHeads' },
        { key: 'discount', caption: 'Discount' },
        { key: 'fine', caption: 'Fine' },
        { key: 'late_Fee_Fine', caption: 'Late_Fee_Fine' },
        { key: 'total_Payable', caption: 'Total_Payable' },
        { key: 'due_Date', caption: 'Due_Date' },
        { key: 'over_Due_Amount', caption: 'Over_Due_Amount' },
        { key: 'print_Date', caption: 'Print_Date' },
        { key: 'bank_Account', caption: 'Bank_Account' },
        { key: 'modeOfPayment', caption: 'ModeOfPayment' },
        { key: 'campus_ID', caption: 'Campus_ID' },
        { key: 'generationDate', caption: 'GenerationDate' },
        { key: 'boardRegistrationSportsHouseCollegeExam', caption: 'BoardRegistrationSports' },
        { key: 'collegeFee', caption: 'CollegeFee' },
        { key: 'boardRegistrationFee', caption: 'BoardRegistrationFee' },
        { key: 'universityRegistrationFee', caption: 'UniversityRegistrationFee' },
        { key: 'boardExamFee', caption: 'BoardExamFee' },
        { key: 'universityExamFee', caption: 'UniversityExamFee' },
        { key: 'entryTestFee', caption: 'EntryTestFee' }
    ];
    created() {
        this.repository = new FeeStudentChallanService(this.$store);
        // this.loadCampus();
        // this.loadCityCampus();
        // this.loadSession();

        this.datestring = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    }


    mounted() {
        this.validatePage();
        // this.refreshData();
    }

    activated() {

    }

    loadcsv() {

        if (this.datas.length > 0) {

            helper.exportToCsv('FinanceData.csv', this.datas);
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'No Data Found',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
    }



    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('financeData' in this.user.claims) == true) {
                if (this.user.claims['financeData'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['financeData'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['financeData'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['financeData'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }


    refreshData() {
        this.datas = [];
        // this.date=new Date(this.date);
        var convert = moment(this.datestring).format('YYYY-MM-DD')
        if (convert != null) {
            var key = convert + '?' + this.user.userId;
            this.repository.GetFinanceData(key)
                .then(response => {
                    this.datas = (response as Array<IFinanceData>)
                });
        }
    }

    formatDateEx(value) {
        return moment(value).format('DD/MM/YYYY hh:mm a')
    
      }


    // editModel(model: IScholarshipApplyVM) {
    // }

    // deleteModel(model: IFeeConcessionDetail) {
    //     this.$modal.show('delete-model', { model: model });
    // }


}

