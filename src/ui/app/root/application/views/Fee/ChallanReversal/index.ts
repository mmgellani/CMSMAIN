/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import { FeeCampusBankLinkService, FeeFeeHeadService, FeeStudentChallanService, SetupCollectorService } from '../../../service';
import { ICampusBank, IFeeCampusBankAccountVM, IFeeFeeHead, IFeeStudentChallan, IFeeStudentChallanVM, IFeeStudentFeeStructureVM, IFilterString, ISetupCollector } from '../../../models';
import { IUser, PayloadMessageTypes } from '../../../../../model';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, minLength, required } from "vuelidate/lib/validators";

import Component from 'vue-class-component';
import { IRootStoreState } from '../../../../store';
import { State } from 'vuex-class';
import { StoreTypes } from '../../../../../store';
import Vue from 'vue';
import WidgetBox from '../../../../home/widget-box/index';
import { MessageService } from '../../../service/Message/message-service';
import { default as Axios } from 'axios';
import moment from 'moment';
type ValidateChallanNumber = { data: IFilterString; validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateChallanNumber> = {
    data: {
        filterString: {
            required,
            minLength: minLength(12),
            maxLength: maxLength(14)
        }
    }
};

//notification code start
export interface INotificationTypes {
    notificationtype: string;
}
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
    mixins: [validationMixin],
    validations: customValidation,
    name: 'feeConfirmation',
    template: require('./index.html'),
    components: {
        WidgetBox
    }
})

export class ChallanReversal extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: FeeFeeHeadService;
    private dataEx: Array<IFeeFeeHead> = [];
    private data: IFilterString = {
        filterString: ''
    };


    private Collectorrepository: SetupCollectorService = null;
    CollectorList: Array<ISetupCollector> = [];
    private RefrenceNo: string = '';
    private Name: string = '';
    private fatherName: string = '';
    private campusName: string = '';
    private description: string = '';
    private className: string = '';
    private accountNo: string = '';
    private bankName: string = '';
    private branch: string = '';
    private code: string = '';
    private documentNo: string = '';
    private dueDate: string = '';
    private recievedDate: string = '';
    private feeHead: string = '';
    private stfeeamount: number = 0;
    private payableAmount: number = 0;
    private collectorName: string = '';
    private sectionName: string = '';
    private filterString: string = '';
    private FeeChallanrepository: FeeStudentChallanService = null;
    private CampusBankrepository: FeeCampusBankLinkService;
    private campusBankList: Array<ICampusBank> = [];
    private canRead: boolean = false;
    private canAdd: boolean = false;
    private canEdit: boolean = false;
    private canDelete: boolean = false;
    private nodata: boolean = false;
private isDisabled : boolean = false;
    private Reversaldata : boolean = false;
    private ReversalChallanData: any = [];
    private StudentFeedata: Array<IFeeStudentChallanVM> = [];
    private TotalAmount: number = 0;
    private collectorId: string = '';
    private campusId: string = '';
    private programDetailId: string = '';
    private admissionFormId: string = '';
    private campusBankLinkId: string = '';
    // campusId: string = "";
    private modelchallanData: Array<IFeeStudentChallan> = [];
    private paidDate: Date = new Date();
    private currentDate: Date = new Date();
    service: MessageService = new MessageService(this.$store);
    private notificationRepo: MessageService = new MessageService(this.$store);
    ChallanAmount: number = 0;
        challanAmount: number = 0;

    installmentNO: number = 0;

    isAlreadyPaid: boolean = false;

    private session: string = '0';
    private campus: string = '0';
    private CampusProgramId: string = '0';
    private cclassid: string = '0';
    private sectionCourseLink: string = '0';
    private srollno: string = '0';

    private Messaage: string = '0';
    private titletxt: string = '0';
    private imagetxt: string = '0';
    private notifType: string = '0';



    created() {
        this.CampusBankrepository = new FeeCampusBankLinkService(this.$store);
        this.repository = new FeeFeeHeadService(this.$store);
        this.FeeChallanrepository = new FeeStudentChallanService(this.$store);
        this.Collectorrepository = new SetupCollectorService(this.$store);
        this.StudentFeedata = null;

    }

    mounted() {
        this.validatePage();
        this.refreshData();

    }
    GetReversalChallanList() {
        debugger;
        this.FeeChallanrepository.GetReversalChallan(this.data.filterString).then(r => {
            if (r.length > 0) {
                this.ReversalChallanData = r
this.Reversaldata=true;
            }
            else {
                // this.nodata = true
this.Reversaldata=false;

            }



        })
    }

    challanReversal() {

        debugger;
this.isDisabled=true;
        
        var key = this.StudentFeedata[0].studentChallanId + "?" + this.user.userId + "?" + JSON.stringify(this.StudentFeedata);

        this.FeeChallanrepository.InsertPaidStudenChallan(key).then(r => {
            if (r.returnValue == 1) {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Challan Reversal Successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                });
                this.StudentFeedata = [];
                this.GetReversalChallanList();
                                this.SearchFeeConfirmation();


            }



        })

    }

    SearchFeeConfirmation() {

        // this.$v.data.filterString.$touch()

        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.CollectorList = [];
            this.TotalAmount = 0;
            this.isAlreadyPaid = false;
            this.StudentFeedata = null;
            // this.paidDate = new Date();





            debugger;

this. GetReversalChallanList();
                                                   this. isDisabled =false;




            this.RefrenceNo = this.Name = this.fatherName = this.campusName = this.description =
                this.className = this.bankName = this.accountNo = this.branch = this.code = this.documentNo = this.dueDate =
                this.recievedDate = this.feeHead = '';
            this.installmentNO = this.stfeeamount = this.payableAmount = 0;
            var key = this.data.filterString + "?" + this.user.userId;
            this.FeeChallanrepository.GetFeeByChallanNoPaid(key).then(res => {
                this.StudentFeedata = res as Array<IFeeStudentChallanVM>;
                ///alert(JSON.stringify(this.StudentFeedata))

                if (this.StudentFeedata) {
                    if (this.StudentFeedata.length > 0) {
                                                    this.nodata=false;
                                                   this. isDisabled =false;

                        if(this.StudentFeedata[0].paidDate ==null)
                        {
                            this.StudentFeedata=[];                         
                             return;
                        }
                        this.nodata = false;
                        this.campusId = this.StudentFeedata[0].campusId;
                        this.programDetailId = this.StudentFeedata[0].programDetailId;
                        this.admissionFormId = this.StudentFeedata[0].admissionFormId;
                        this.StudentFeedata = Array.from(new Set(this.StudentFeedata.map(a => a.feeHead)))
                            .map(id => {
                                return this.StudentFeedata.find(a => a.feeHead === id)
                            });

                        this.RefrenceNo = this.StudentFeedata[0].refferenceNo;
                        this.Name = this.StudentFeedata[0].fullName;
                        this.installmentNO = this.StudentFeedata[0].installmentNo;
                        this.fatherName = this.StudentFeedata[0].fatherName;
                        this.campusName = this.StudentFeedata[0].campusName;
                        this.description = this.StudentFeedata[0].description;
                        this.className = this.StudentFeedata[0].className;
                        this.bankName = this.StudentFeedata[0].bankName;
                        this.accountNo = this.StudentFeedata[0].accountNo;
                        this.branch = this.StudentFeedata[0].branch;
                        this.code = this.StudentFeedata[0].code;
                        this.documentNo = this.StudentFeedata[0].documentNo;
                        this.dueDate = this.StudentFeedata[0].dueDate;
                        this.recievedDate = this.StudentFeedata[0].paidDate;
                        this.feeHead = this.StudentFeedata[0].feeHead;
                        this.stfeeamount = this.StudentFeedata[0].stfeeamount;
                        this.payableAmount = this.StudentFeedata[0].payableAmount;
                        this.collectorName = this.StudentFeedata[0].collectorName;

                        this.session = "" + this.StudentFeedata[0].sessionId + "";
                        this.campus = "" + this.StudentFeedata[0].campusId + "";
                        this.CampusProgramId = "" + this.StudentFeedata[0].campusProgramId + "";
                        this.cclassid = "" + this.StudentFeedata[0].classId + "";
                        this.sectionCourseLink = "" + this.StudentFeedata[0].sectionCourseLinkId + "";
                        this.srollno = "" + this.StudentFeedata[0].rollNo; + "";
                        //this.notifType = "" + notifType2 + "";





                        this.FeeChallanrepository.GetFeeByChallandataReversal(this.data.filterString).then(
                            res => {

                                this.Collectorrepository.GetFindBy('e=>e.CampusId.ToString()=="' + this.campusId + '" && e.StatusId == 1').then(
                                    res => {
                                        this.CollectorList = res as Array<ISetupCollector>


                                        this.CampusBankrepository.GetBankAll(this.campusId + "?" + this.programDetailId + "?" + this.admissionFormId)
                                            .then(response => {
                                                this.campusBankList = response as Array<ICampusBank>
                                                this.campusBankList.forEach(element => {
                                                    element.bankName = element.bankName + ' - (' + element.accountNo + ')';

                                                });
                                            }
                                            )

                                    }
                                )
                                this.modelchallanData = res as Array<IFeeStudentChallan>
                                debugger;
                                if( this.modelchallanData[0].paidDate==null)
                                {
                                    this.modelchallanData=[];
                        
return;
                                }
                                this.ChallanAmount = this.modelchallanData[0].feeAmount;
                                this.challanAmount = this.modelchallanData[0].feeAmount;

                                if (this.modelchallanData) {
                                    if (this.modelchallanData.length > 0) {
                                        if (this.modelchallanData[0].paidDate != null) {
                                            this.isAlreadyPaid = true;
                                        }

                                        this.TotalAmount = this.modelchallanData[0].feeAmount;
                                    }
                                }
                            }
                        )
                // this.GetReversalChallanList();

                    }
                    else {
                        this.nodata = true
                    }

                    // for (var i = 0; i < this.StudentFeedata.length; i++) {
                    //     this.TotalAmount = this.TotalAmount + this.StudentFeedata[i].payableAmount
                    // }
                }

            });


        }
    }

    InsertPaidDate() {


        this.FeeChallanrepository.GetFindBy3(this.data.filterString).then(
            res => {
                this.modelchallanData = res as Array<IFeeStudentChallan>;
                //alert(JSON.stringify(this.modelchallanData))
                var dated = this.paidDate.getFullYear() + '/' + (this.paidDate.getMonth() + 1) + '/' + this.paidDate.getDate();

                var key = this.StudentFeedata[0].challanNo + '?' + dated + '?' + this.collectorId + '?' + this.modelchallanData[0].studentChallanId + '?' + this.campusBankLinkId
                if (this.StudentFeedata[0].installmentNo == 1) {


                    if (new Date(this.paidDate) <= new Date(this.currentDate)) {
                        this.FeeChallanrepository.InsertPaidDate(key).then(r => {
                            if (r.returnValue == 0) {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Paid date cannot be greater than due Date',
                                    title: 'Failed',
                                    messageTypeId: PayloadMessageTypes.error
                                });

                            }
                            else if (r.returnValue == 10) {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Privious Challan Not Paid',
                                    title: 'Failed',
                                    messageTypeId: PayloadMessageTypes.error
                                });


                            }
                            else if (r.returnValue == 11) {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'The challan is not due yet.',
                                    title: 'Failed',
                                    messageTypeId: PayloadMessageTypes.error
                                });


                            }

                            else if (r.returnValue == 5) {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Paid date cannot be less than minimum Paid Date Restriction',
                                    title: 'Failed',
                                    messageTypeId: PayloadMessageTypes.error
                                });


                            }
                            else {
                                this.Notificaiton();

                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Fee Confirm Successfully',
                                    title: 'Success',
                                    messageTypeId: PayloadMessageTypes.success


                                });
                                this.StudentFeedata = [];

                                this.SearchFeeConfirmation();

                            }

                        })
                        // this.FeeChallanrepository.InsertPaidDate(key).then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {

                        //     text: 'Fee Confirm Successfully',
                        //     title: 'Success',
                        //     messageTypeId: PayloadMessageTypes.success
                        // }));

                    }

                    else {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Paid date cannot be greater than Current Date',
                            title: 'Failed',
                            messageTypeId: PayloadMessageTypes.error
                        });
                    }
                }

                else {
                    if (this.StudentFeedata.length > 0) {
                        var filterkey = this.StudentFeedata[0].admissionFormId + '?' + (this.StudentFeedata[0].installmentNo - 1) + '?' + this.modelchallanData[0].challanTypeId + '?' + this.modelchallanData[0].classId;
                    }
                    this.FeeChallanrepository.CheckPaidInstallment(filterkey).then(
                        r => {
                            if (r.returnValue > 0) {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'Please Pay Previous Challan',
                                    title: 'error',
                                    messageTypeId: PayloadMessageTypes.error
                                })
                            }
                            else {

                                if (new Date(this.paidDate) <= new Date(this.currentDate)) {

                                    this.FeeChallanrepository.InsertPaidDate(key).then(r => {
                                        if (r.returnValue == 0) {
                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                text: 'Paid date cannot be greater than due Date',
                                                title: 'Failed',
                                                messageTypeId: PayloadMessageTypes.error
                                            });

                                        }
                                        else if (r.returnValue == 10) {
                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                text: 'Privious Challan Not Paid',
                                                title: 'Failed',
                                                messageTypeId: PayloadMessageTypes.error
                                            });


                                        }
                                        else if (r.returnValue == 11) {
                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                text: 'The challan is not due yet.',
                                                title: 'Failed',
                                                messageTypeId: PayloadMessageTypes.error
                                            });


                                        }
                                        else if (r.returnValue == 5) {
                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                text: 'Paid date cannot be less than minimum Paid Date Restriction',
                                                title: 'Failed',
                                                messageTypeId: PayloadMessageTypes.error
                                            });


                                        }
                                        else {
                                            this.Notificaiton();

                                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                                text: 'Fee Confirm Successfully',
                                                title: 'Success',
                                                messageTypeId: PayloadMessageTypes.success


                                            });
                                            this.StudentFeedata = [];

                                            this.SearchFeeConfirmation();

                                        }

                                    })
                                    // this.FeeChallanrepository.InsertPaidDate(key).then(() => this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    //     text: 'Fee Confirm Successfully',
                                    //     title: 'Success',
                                    //     messageTypeId: PayloadMessageTypes.success
                                    // }));

                                    // this.Notificaiton();

                                    // this.StudentFeedata = [];
                                    // this.SearchFeeConfirmation();
                                }
                                else {
                                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                                        text: 'Paid date cannot be greater than Current Date',
                                        title: 'Failed',
                                        messageTypeId: PayloadMessageTypes.error
                                    });
                                }
                            }
                        }
                    )
                }
            })
    }

    Notificaiton() {
        var datedasc = this.paidDate.getDate() + '-' + (this.paidDate.getMonth() + 1) + '-' + this.paidDate.getFullYear();
        this.session = "" + this.StudentFeedata[0].sessionId + "";
        this.campus = "" + this.StudentFeedata[0].campusId + "";
        this.CampusProgramId = "" + this.StudentFeedata[0].campusProgramId + "";
        this.cclassid = "" + this.StudentFeedata[0].classId + "";
        this.sectionCourseLink = "" + this.StudentFeedata[0].sectionCourseLinkId + "";
        this.srollno = "" + this.StudentFeedata[0].rollNo; + "";
        //this.Messaage = 'Dear Parents, your child ' + this.Name + ' ,' + this.RefrenceNo + ' has paid Rs.' + this.TotalAmount + ' on ' + datedasc + '. Thank you for your cooperation';
        this.Messaage = 'A Fee of ' + ' Rs.' + this.TotalAmount + ' has been received on ' + datedasc + '. Thank you for your cooperation.';

        this.titletxt = 'Fee Confirmation';
        this.imagetxt = '0';
        this.notifType = 'Fee Confirmation';

        if (this.sectionCourseLink != '00000000-0000-0000-0000-000000000000') {
            var dataNotification: INotificationCredntials = {
                sesseion: this.session,
                campus: this.campus,
                program: this.CampusProgramId,
                classstudent: this.cclassid,
                section: this.sectionCourseLink,
                rollno: this.srollno,
                notificationObject: {
                    notification: this.Messaage,
                    type: this.notifType,
                    title: this.titletxt,
                    image: this.imagetxt
                }
            }

            var keysend = JSON.stringify(dataNotification) + '?' + this.user.userId + '?' + this.Messaage;
            this.notificationRepo.BulkNotificationSelectionEx(keysend)
                .then(r => {
                    var today = new Date();
                    var notificationIdd = r;

                    var keyapproval = notificationIdd + '?' + this.Messaage + '?' + moment(today).format("YYYY/MM/DD") + '?' + this.user.userId;
                    var convert = notificationIdd;
                    // alert(JSON.stringify(keyapproval))
                    this.service.NotificationApprove(keyapproval).then(r => {

                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Fee Confirm Successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })

                        // Axios.post('https://superapp.cms.edu/api/Notification/SendNotificationToUser', {
                        //     notify: {
                        //         notification: this.Messaage,
                        //         type: this.notifType
                        //         //,title: titles,
                        //         // image: images
                        //     },    
                        //     sesseion: this.session,
                        //     campus: this.campus,
                        //     program: this.CampusProgramId,
                        //     classstudent: this.cclassid,
                        //     section: this.sectionCourseLink,
                        //     rollno: this.srollno
                        // })
                        // .then(response => {})
                        // .catch(e => {

                        // })

                    })
                })
        }

    }

    validatePage() {
        if (this.user.roles.indexOf('admin') >= 0) {
            this.canAdd = this.canDelete = this.canEdit = this.canRead = true;
        }
        else {
            if (('challanReversal' in this.user.claims) == true) {
                if (this.user.claims['challanReversal'].indexOf('R') >= 0) {
                    this.canRead = true;
                }
                if (this.user.claims['challanReversal'].indexOf('C') >= 0) {
                    this.canAdd = true;
                }
                if (this.user.claims['challanReversal'].indexOf('U') >= 0) {
                    this.canEdit = true;
                }
                if (this.user.claims['challanReversal'].indexOf('D') >= 0) {
                    this.canDelete = true;
                }
            } else {
                this.$router.push('Home');
            }
        }
    }

    refreshData() {
        this.dataEx = [];
        this.repository.GetAll()
            .then(response => this.dataEx = (response as Array<IFeeFeeHead>));
    }

    insertModel() {
        this.$modal.show('add-edit-model', { model: { feeHeadId: '', fullName: '', description: '', feeType: 0, statusId: 0, loggerId: '', orderBy: 0, }, IsNewRecord: true });
    }

    editModel(model: IFeeFeeHead) {
        this.$modal.show('add-edit-model', { model: model, IsNewRecord: false });
    }

    deleteModel(model: IFeeFeeHead) {
        this.$modal.show('delete-model', { model: model });
    }
    $v: any;
}