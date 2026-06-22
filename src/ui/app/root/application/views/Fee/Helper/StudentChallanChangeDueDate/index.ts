/*
 *   Auther: H.Muhammad Kamran
 *   email: hmuhdkamran@gmail.com
 *   contact: +92 (313 / 333) 9112 845
 */

import Vue from "vue";
import Component from "vue-class-component";
import { ReportEngine } from "../../../../../../components";

import { IUser, PayloadMessageTypes } from '../../../../../../model';
import { IRootStoreState } from '../../../../../store';

import {
    IFeeStudentChallan,
    IFeeSubinstallmentVM,
    StudentReportData,
    StudentChallanReport,
    ICampusBank,
    IFeeCampusChallanNoteLinkVM,
    IFeeStudentChallanVM,
    IFeeChallanType,
    IFeeBulkModel,
    ISetupClass
} from "../../../../models";
import { FeeStudentChallanService, FeeCampusBankLinkService, FeeCampusChallanNoteLinkService, FeeChallanTypeService, SetupClassService } from "../../../../service";
import { State } from "vuex-class";
import { StoreTypes } from "../../../../../../store";


@Component({
    name: "student-challan-change-due-date-add-edit-model",
    template: require("./index.html")
})
export class FeeStudentChallanChangeDueDateAddEdit extends Vue {
    @State((state: IRootStoreState) => state.feeStudentInfo) studentInfo: any;

    @State((state: IRootStoreState) => state.common.user) user: IUser;

    //studentInfo: any = {};
    report: String = "";

    private repository: FeeStudentChallanService;
    private campusBankRepository: FeeCampusBankLinkService;
    private campusChallanRepository: FeeCampusChallanNoteLinkService;
    private concessionRepository: FeeStudentChallanService;
    private data: Array<IFeeSubinstallmentVM> = [];
    private campusBankList: Array<ICampusBank> = [];
    private campusChallanList: Array<IFeeCampusChallanNoteLinkVM> = [];
    private TempChallandata: Array<IFeeStudentChallan> = [];
    private StudentChallandata: Array<IFeeStudentChallan> = [];
    private installNo: number = 1;
    private StudentRecordReportList: Array<StudentReportData> = [];
    private feeChallanList: Array<StudentChallanReport> = [];
    private TempStudentRecordReportList: any = [];
    private nextChallan: any = [];
    private nextDuedate: any = [];
    private subAmount: any = [];
    private challanNote: string = '';
    private challanType: string = '';
    private datestring: string = "";
    private subinstallmentArray: any = [];
    private challanFooter: any = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
    private challanRData: any = [];
    private ChallanTypeList: Array<IFeeChallanType> = [];
    private FeeChallanTypeService: FeeChallanTypeService = null;




    private StudentFeedata: Array<IFeeStudentChallanVM> = [];
    private FeeChallanrepository: FeeStudentChallanService = null;
    private str = '';

    private classList: Array<ISetupClass> = []
    private classId = '';


    private classRepo: SetupClassService = new SetupClassService(this.$store)

    created() {
        this.repository = new FeeStudentChallanService(this.$store);
        this.concessionRepository = new FeeStudentChallanService(this.$store);
        this.campusBankRepository = new FeeCampusBankLinkService(this.$store);
        this.campusChallanRepository = new FeeCampusChallanNoteLinkService(this.$store);
        this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
        this.FeeChallanTypeService = new FeeChallanTypeService(this.$store);


    }
    private bulkModel: IFeeBulkModel = { feeStudentChallan: [], feeSubinstallmentVM: [] }

    mounted() {
        //this.studentInfo = this.$parent.$parent.$props['studentInfo'];
        this.FeeChallanTypeService.GetFindBy('e=>e.StatusId==1').then(r => {
            this.ChallanTypeList = r as Array<IFeeChallanType>
            if (this.ChallanTypeList.length > 0) {
                this.challanType = this.ChallanTypeList.find(s => s.fullName.toLowerCase().startsWith('edu')).challanTypeId;
            }
        })

        this.classRepo.GetFindBy('s=>s.StatusId==1')
            .then(r => {
                this.classList = r as Array<ISetupClass>
                this.classId = this.classList.find(s => s.fullName == 'Part-I').classId;

                this.data = [];
                this.StudentChallandata = [];
                if (this.studentInfo) {
                    if (this.studentInfo.admissionFormId) {
                        if (this.studentInfo.refferenceNo) {
                            var key = this.studentInfo.refferenceNo + "?" + this.studentInfo.admissionFormId + "?" + this.classId
                            this.repository.GetBulkModel(key)
                                .then(r => {
                                    this.bulkModel = r as IFeeBulkModel;
                                    this.StudentChallandata = this.bulkModel.feeStudentChallan;
                                    this.data = this.bulkModel.feeSubinstallmentVM;

                                })
                        }
                    }
                }
            })
        // if (this.studentInfo) {
        //     if (this.studentInfo.admissionFormId) {
        //         this.repository.GetFindBy(`e => (e.AdmissionFormId.ToString() == "` + this.studentInfo.admissionFormId + `") && (e.StatusId==1)`)
        //             .then(res => this.StudentChallandata = res as Array<IFeeStudentChallan>);
        //     }

        //     if (this.studentInfo.refferenceNo) {
        //         this.concessionRepository.GetFeeByRefrenceNo(this.studentInfo.refferenceNo)
        //             .then(res => this.data = res as Array<IFeeSubinstallmentVM>);
        //     }
        // }
    }

    loadClassData() {
        this.data = [];
        this.StudentChallandata = [];
        if (this.studentInfo) {
            if (this.studentInfo.admissionFormId) {
                if (this.studentInfo.refferenceNo) {
                    var key = this.studentInfo.refferenceNo + "?" + this.studentInfo.admissionFormId + "?" + this.classId
                    this.repository.GetBulkModel(key)
                        .then(r => {
                            this.bulkModel = r as IFeeBulkModel;
                            this.StudentChallandata = this.bulkModel.feeStudentChallan;
                            this.data = this.bulkModel.feeSubinstallmentVM;

                        })
                }
            }
        }

    }

    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 },{ item: 5 },  { item: 6 }]
    getProperty(propertyName) {
        if (this.data) {
            if (this.data.length > 0) {
                return this.data[0][propertyName];
            }
        }
    }

    sumFeeHead(propertyName) {
        if (this.feeHeadData) {
            return this.feeHeadData.reduce((a, b) => a + b[propertyName], 0);
        }
        return 0;
    }

    sumFee(propertyName) {
        if (this.feeDetail) {
            return this.feeDetail.reduce((a, b) => a + b[propertyName], 0);
        }
        return 0;
    }

    // get maxInstallments() {
    //     if (this.data) {
    //         if (this.data.length > 0) {
    //             return this.data.reduce((a, b) => Number(a.installmentNo) > Number(b.installmentNo) ? a : b).installmentNo;
    //         }
    //     }

    //     return 0;
    // }

    get feeHeadData() {
        if (this.data) {
            if (this.data.length > 0) {
                return this.data.filter(e => e.installmentNo == this.installNo && e.challanTypeId == this.challanType).sort((n1, n2) => {
                    if (n1.feeHead > n2.feeHead) { return 1; }
                    if (n1.feeHead < n2.feeHead) { return -1; }
                    return 0;
                });
            }
        }
    }

    get feeDetail() {
        if (this.StudentChallandata) {
            if (this.StudentChallandata.length > 0) {
                return this.StudentChallandata.filter(e => e.installmentNo == this.installNo && e.challanTypeId == this.challanType).sort((n1, n2) => {
                    if (n1.challanNo > n2.challanNo) { return 1; }
                    if (n1.challanNo < n2.challanNo) { return -1; }
                    return 0;
                });
            }
        }
    }

    isPaid(paidDate) {
        return new Date(paidDate).getFullYear() > 1900;
    }

    changeDueDate(item) {
        var dated = new Date(item.dueDate);

        this.str = dated.getFullYear() + '/' + (dated.getMonth() + 1) + '/' + dated.getDate();

        var key = item.studentChallanId + "?" + this.str
        this.FeeChallanrepository.updateDueDate(key)
            .then(r => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Due Date Updated Successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                });
            })
    }

    generateChallanReport(challanNo: any) {
        this.feeChallanList = [];
        this.campusBankList = [];
        this.campusChallanList = [];
        this.challanNote = '';
        this.challanFooter = [{ challanNote: '', customerCode: '', challanNo: '', userName: '' }];
        this.challanRData = [];
        this.repository.GetFeeRData(challanNo)
            .then(res => {
                this.feeChallanList = res as Array<StudentChallanReport>
                // console.log(JSON.stringify(this.feeChallanList));


                this.campusBankRepository.GetBank(this.feeChallanList[0].campusId)
                    .then(res => {
                        this.campusBankList = res as Array<ICampusBank>
                        // console.log(JSON.stringify(this.campusBankList));

                        this.campusChallanRepository.GetData(this.feeChallanList[0].campusId)
                            .then(res => {
                                this.campusChallanList = res as Array<IFeeCampusChallanNoteLinkVM>
                                // console.log(JSON.stringify(this.campusChallanList));


                                var i = 0;
                                this.campusChallanList.forEach(e => {
                                    this.challanNote = this.challanNote + '<li>' + this.campusChallanList[i].description + '</li>';
                                    i++;
                                }

                                );
                                // alert(JSON.stringify(this.challanNote));

                                this.challanFooter = [{ challanNote: this.challanNote, customerCode: this.feeChallanList[0].customerCode, challanNo: this.feeChallanList[0].challanNo, userName: this.user.email }];

                                // console.log(JSON.stringify(this.challanFooter));

                                this.challanRData = '[' + JSON.stringify(this.challanFooter) + ',' + JSON.stringify(this.feeChallanList) + ',' + JSON.stringify(this.campusBankList) + ']';
                                // console.log(this.challanRData);

                                this.challanRData = JSON.parse(this.challanRData);


                                this.report = "/assets/Reports/Resource/Admission/Report1.xml";

                                this.$parent.$parent.$emit('fire_report', { report: this.report, data: this.challanRData });

                                // this.$modal.show("report-viewer-eng");

                            });

                    });
            });




    }

    getStudentReportData(challlanNo: any) {
        var l = 0;
        this.nextChallan = [];
        this.nextDuedate = [];
        this.subAmount = [];
        for (var k = 0; k < this.TempChallandata.length; k++) {
            if (
                this.TempChallandata[k].challanNo != challlanNo &&
                this.TempChallandata[k].challanNo > challlanNo
            ) {
                this.nextChallan[l] = this.TempChallandata[k].challanNo;
                this.nextDuedate[l] = this.TempChallandata[k].dueDate;
                this.subAmount[l] = this.TempChallandata[k].feeAmount;
                l++;
            }
        }

        this.TempStudentRecordReportList = [];
        this.repository.GetStudentReportData().then(res => {
            this.StudentRecordReportList = res as Array<StudentReportData>;
            this.TempStudentRecordReportList = this.StudentRecordReportList.filter(
                e => e.challanNo == challlanNo && e.statusId == 1
            );

            if (this.nextChallan != 0) {
                var o = 0;
                for (var u = 0; u < this.nextChallan.length; u++) {
                    this.subinstallmentArray = {
                        nextChallan: this.nextChallan[o],
                        nextDuedate: this.nextDuedate[o],
                        subAmount: this.subAmount[o]
                    };

                    this.TempStudentRecordReportList.push(this.subinstallmentArray);
                    o++;
                }
            }
            console.log(JSON.stringify(this.TempStudentRecordReportList));

            this.report = "assets/Reports/Resource/Admission/Report1.xml";

            this.$parent.$parent.$emit('fire_report', { report: this.report, data: this.TempStudentRecordReportList });
            // this.$modal.show("report-viewer-eng");
        });
    }
}
