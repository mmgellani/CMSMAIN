/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import { State } from 'vuex-class';
import Component from 'vue-class-component';

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState, RootStoreTypes } from '../../../../../store';

import { IFeeConcessionDetail, IFeeConcessionDetailVM, ISetupSession, ISetupShift, ISetupCampus, IStudentModel, ISetupProgramDetails, DDLGroupModel, DDLModel, ISetupProgramDetailsVM, IFeeConcession, IFeeScholarshipCriteriaVM, ISetupAdmissionType, ISetupCampusProgramVM, IScholarshipStudentModel, IScholarshipApplyVM, IStudentToEnrollVM, IRegistrationSectionCourseLinkVM, ISetupClass, ICampusCityVM, ISetupGender, IStudentEnrolledVM, IFeeChallanType, IFeeFeeHead, ChallanBReport, IReNewConcessionVM, IReNewConcessionVMEx } from '../../../../models';
import { FeeConcessionDetailService, SetupCampusService, SetupSessionService, SetupShiftService, FeeConcessionService, SetupProgramDetailsService, FeeScholarshipCriteriaService, SetupAdmissionTypeService, SetupCampusProgramLinkService, RegistrationEnrollmentsService, SetupClassService, SetupGenderService, RegistrationSectionCourseLinkService, FeeChallanTypeService, FeeFeeHeadService, FeeStudentChallanService, FeeChallanValidityService } from '../../../../service';


import { StoreTypes } from '../../../../../../store';
import { Helper } from '../../../Fee/Helper';
import * as helper from '../../../../helper';
import { IStudentEnrolledVMEx } from '../../SectionFine/list';
import { SetupConcessionRemarksService } from '../../../../service/Setup/ConcessionRemarks';
import { IVWConcessionRemarksVM } from '../../../../models/Setup/ConcessionRemarks';
import { watch } from 'fs';
import moment from 'moment';

// export interface IStudentEnrolledVMEx extends IStudentEnrolledVM {

//     isChecked: boolean;

// }
@Component({
    name: 'models-form-list',
    template: require('./index.html'),
})

export class AttendanceFineGenerate extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeConcessionDetailService;
    private BChallanrepository: FeeChallanValidityService;
    // private concessionRepo: FeeConcessionDetailService = new FeeConcessionDetailService(this.$store);



    private repositoryVM: RegistrationSectionCourseLinkService;


    private datas: Array<IStudentEnrolledVM> = [];
    private Selectdatas: Array<IStudentEnrolledVMEx> = [];
    private BulkChallanR: any = [];

    private Remarks: string = '';
    private campusId = ''
    private sessionId = ''
    private programDetailId = ''
    private amount = 0;
    private checkAllrec = false;
    private scholarshipCriteriaId = ''
    private campusProgramId = '';
    private classid: string = '';
    private repoClass = new SetupClassService(this.$store);
    private repoChallanType: FeeChallanTypeService = new FeeChallanTypeService(this.$store);
    private repoFeeHead: FeeFeeHeadService = new FeeFeeHeadService(this.$store)
    private feeHeadList: Array<IFeeFeeHead> = []
    private ChallanRList: Array<ChallanBReport> = [];
    private reportData: any = [];
    private report: String = "";
    private challanTypeList: Array<IFeeChallanType> = []
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
    private dueDate = new Date();
    private sectionCourseLinkId: string = "";

    admissionTypeId: string = "";
    private admissionTypeList: Array<ISetupAdmissionType> = [];

    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store)
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private studentchallanRepo: FeeStudentChallanService = new FeeStudentChallanService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private enrollmentRepo: RegistrationEnrollmentsService = new RegistrationEnrollmentsService(this.$store)
    private admisisonTypeRepo: SetupAdmissionTypeService;
    private data: any = [];
    challanTypeId: string = '';
    feeHeadId: string = '';

    private fromPercentage = 0;
    private toPercentage = 0;
    private fromDate = new Date();
    private toDate = new Date();

    private concessionremarksmarkslist: Array<IVWConcessionRemarksVM> = [];
    private concessionmarkrepository: SetupConcessionRemarksService = new SetupConcessionRemarksService(
        this.$store
    );

    private columns = [
        { key: 'rollNo', caption: "Roll No" },
        { key: 'fullName', caption: "Name" },
        { key: 'percentage', caption: "Percentage" },
        { key: 'isSelected', caption: "Select" },
    ];


    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private selected = []

    created() {
        this.repository = new FeeConcessionDetailService(this.$store);
        this.BChallanrepository = new FeeChallanValidityService(this.$store);
        this.genderRepo = new SetupGenderService(this.$store);
        this.admisisonTypeRepo = new SetupAdmissionTypeService(this.$store);
        this.repositoryVM = new RegistrationSectionCourseLinkService(this.$store);
        this.loadSession();
        this.loadChallanTypeList();
        this.$watch('campusId', this.getConcessionMarks);
    }

    mounted() {
        this.validatePage();
    }
    loadClass() {
        if (this.campusProgramId) {
            this.repoClass.GetFindBy('e=>e.StatusId==1').then(res => {
                this.classList = res as Array<ISetupClass>

            });
        }

    }

    allowsubmit() {
        return this.sessionId.length > 0 && this.campusId.length > 0 && this.campusProgramId.length > 0
            && this.classid.length > 0 && this.sectionCourseLinkId.length > 0
            && this.challanTypeId.length > 0 && this.feeHeadId.length > 0
            && this.amount > 0
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

    CheckIndividuals(option: any, option2: any) {
        this.data.forEach(element => {
            if (element.refferrenceNo == option) {
                element.isSelected = option2;
            }
        });
    }

    CheckAll() {
        if (this.checkAllrec == true) {
            this.data.forEach(element => {
                element.isSelected = true;

            });
        }
        else {
            this.data.forEach(element => {
                element.isSelected = false;

            });
        }

    }

    getConcessionMarks() {
        this.concessionmarkrepository.GetFindBy(`e=>e.StatusId==1 && (e.CampusId.ToString() == "` + this.campusId + `")`).then(res => {
            this.concessionremarksmarkslist = res as Array<IVWConcessionRemarksVM>;

        });
    }

    generateChallanReport() {

        this.BulkChallanR = [];
        var filterId = this.Selectdatas.filter(e => e.isChecked == true);
        if (filterId.length > 0 && this.challanTypeId.length > 0) {
            filterId.forEach(e => {
                this.BulkChallanR.push({
                    admissionFormId: e.admissionFormId
                })
            });

            this.programDetailId = this.campusProgramLinkList.find(e => e.campusProgramId == this.campusProgramId).programDetailId;

            this.ChallanRList = [];
            this.reportData = [];
            var key = this.campusId + "?" + this.programDetailId + "?" + this.sectionCourseLinkId + "?" + JSON.stringify(this.BulkChallanR) + "?" + this.user.displayName + "?" + this.challanTypeId
            this.BChallanrepository.get_challan_reportEx(key)
                .then(r => {
                    if (r != undefined) {
                        if (r.length > 0) {
                            this.$store.dispatch(RootStoreTypes.reportOperation, {
                                data: r as any,
                                path: '/assets/Reports/Resource/Admission/student-challan.xml',
                                show: true
                            });

                            return;
                        }
                        else {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'There is no data to display',
                                title: 'warning',
                                messageTypeId: PayloadMessageTypes.warning
                            });
                        }
                    }

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'There is no data to display',
                        title: 'warning',
                        messageTypeId: PayloadMessageTypes.warning
                    });
                })
        }
        else if (this.challanTypeId.length == 0) {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Select Challan Type first',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
        else {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Select Student first',
                title: 'warning',
                messageTypeId: PayloadMessageTypes.warning
            });
        }
    }


    loadSections() {
        if (this.classid.length > 0) {
            var key = this.campusProgramId + '?' + this.classid
            this.enrollmentRepo.GetSectionList(key)
                .then(r => {
                    this.sectionList = r as Array<IRegistrationSectionCourseLinkVM>
                    if (this.sectionList == null) {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Section not Defined',
                            title: 'warning',
                            messageTypeId: PayloadMessageTypes.warning
                        });
                    }
                })
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


    loadChallanTypeList() {
        this.repoChallanType.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.challanTypeList = r as Array<IFeeChallanType>
                var index1 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')))
                this.challanTypeList.splice(index1, 1);
                var index2 = this.challanTypeList.indexOf(this.challanTypeList.find(s => s.fullName.toLowerCase().startsWith('trans')))

                this.challanTypeList.splice(index2, 1);
            })

    }
    loadFeeHeads() {

        if (this.challanTypeId.length > 0) {
            this.repoFeeHead.GetFindBy('s=>s.ChallanTypeId.ToString()=="' + this.challanTypeId + '"')
                .then(r => {
                    this.feeHeadList = r as Array<IFeeFeeHead>
                })

        }
    }

    loadProgramsOfCampus() {
        if (this.campusId.length > 0) {
            this.campusProgramId = ''
            this.ddl = [];
            this.programDDL = [];
            let oldObj: ISetupCampusProgramVM;
            var key = this.sessionId + "?" + this.campusId;
            this.campusProgramLinkRepo.GetAllVM(key).then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
            });
        }
    }

    loadAdmissionType() {
        this.admisisonTypeRepo.GetFindBy("s=>s.StatusId==1").then(r => {
            this.admissionTypeList = r as Array<ISetupAdmissionType>;
            if (this.admissionTypeList.length > 0) {
                this.admissionTypeId = this.admissionTypeList[0].admissionTypeId
            }
        });
    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('sectionFine' in this.user.claims) == true) {
                if (this.user.claims['sectionFine'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['sectionFine'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['sectionFine'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['sectionFine'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        if (this.sectionCourseLinkId.length > 0) {
            this.data = []
            if (this.sectionCourseLinkId.length > 0 && this.classid.length > 0) {
                var key = this.sectionCourseLinkId + "?" + this.classid + "?" + moment(this.fromDate).format('YYYY-MM-DD') + "?" + moment(this.toDate).format('YYYY-MM-DD') + "?" + this.fromPercentage + "?" + this.toPercentage;
                console.log(JSON.stringify(key))
                this.repository.AttendancePercentageEx(key)
                    .then(r => {
                        this.data = r as Array<IReNewConcessionVMEx>
                    });
            }
        }
    }



    // refreshData() {
    //     if (this.campusProgramId.length > 0) {
    //         this.datas = [];
    //         this.Selectdatas = [];
    //         if (this.campusProgramId.length > 0 && this.classid.length > 0 && this.sectionCourseLinkId.length > 0) {
    //             var key = this.campusProgramId + '?' + this.classid + "?" + this.sectionCourseLinkId;
    //             this.enrollmentRepo.GetEnrolledStudentVM(key)
    //                 .then(response => {
    //                     this.datas = (response as Array<IStudentEnrolledVM>)
    //                     this.datas.forEach(e => {
    //                         this.Selectdatas.push({
    //                             admissionFormId: e.admissionFormId,
    //                             campusProgramId: e.campusProgramId,
    //                             classId: e.classId,
    //                             studentId: e.studentId,
    //                             admissionTypeId: e.admissionTypeId,
    //                             rollNo: e.rollNo,
    //                             refferenceNo: e.refferenceNo,
    //                             fullName: e.fullName,
    //                             fatherName: e.fatherName,
    //                             studentCNIC: e.studentCNIC,
    //                             sectionId: e.sectionId,
    //                             range: e.range,
    //                             isSelected: e.isSelected,
    //                             isDisabled: e.isDisabled,
    //                             genderId: e.genderId,
    //                             statusId: e.statusId,
    //                             sectionName: e.sectionName,
    //                             sessionId: e.sessionId,
    //                             campusId: e.campusId,
    //                             programDetailId: e.programDetailId,
    //                             sectionCourseLinkId: e.sectionCourseLinkId,
    //                             enrollmentId: e.enrollmentId,
    //                             loggerId: e.loggerId,
    //                             isChecked: false, programId: ''
    //                         })

    //                     });
    //                 });
    //         }
    //     }
    // }
    check(model: IStudentToEnrollVM) {
        if (model.rollNo.length == 0) {
            model.isSelected = false;
        }
    }
    check2(model: IStudentToEnrollVM) {
        if (model.rollNo.length > 0) {
            this.enableCheckBox(model);
        }

    }
    enableCheckBox(model: IStudentToEnrollVM) {
        var start = Number(model.range.split('-')[0].toString());
        var end = Number(model.range.split('-')[1].toString());
        var rollNo = Number(model.rollNo);

        if ((rollNo >= start) && (rollNo <= end)) {
            model.isDisabled = true;
            model.isDisabled = false;
        } else {
            model.isSelected = false;
            model.isDisabled = true;
        }
    }
    showRange(model: IStudentToEnrollVM) {
        var range = this.sectionList.find(s => s.sectionId == model.sectionId)
        model.range = range.fromSerial + '-' + range.toSerial;
        this.check2(model)

    }
    insertModel() {
        // console.log(JSON.stringify(this.data))
        var temp = this.data.filter(e => e.isSelected == true)
        console.log(JSON.stringify(temp))

        var z = (JSON.stringify(temp) + '?' + this.amount + '?' + this.dueDate.toDateString() + '?' + this.feeHeadId + '?' + this.challanTypeId + '?' + this.Remarks);
        console.log(z)
        this.studentchallanRepo.GenerateBulkCustomChallan(z).then(r => {
            this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: 'Data Updated Successfully',
                title: 'success',
                messageTypeId: PayloadMessageTypes.success
            });
        })
    }

    editModel(model: IScholarshipApplyVM) {

    }

    deleteModel(model: IFeeConcessionDetail) {
        this.$modal.show('delete-model', { model: model });
    }
    get allowSubmit() {
        return (
            this.sessionId.length > 0 && this.campusId.length > 0 && this.programDetailId.length > 0 &&
            this.classid.length > 0 && this.sectionCourseLinkId.length > 0
        )
    }

}