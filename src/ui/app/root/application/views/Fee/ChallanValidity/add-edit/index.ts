/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/


import Vue from 'vue';
import Component from 'vue-class-component';
import { VueModelDate } from "vue-model-date/lib-esm";
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';

import { IFeeChallanValidity, ISetupCampus, DDLGroupModel, DDLModel, ICampusCityVM, ICampusChallanValidityVM, ISetupCampusProgramLink, ISetupCampusProgramLinkVM, ISetupClass } from '../../../../models';
import { FeeChallanValidityService, SetupCampusService, SetupCampusProgramLinkService, SetupClassService } from '../../../../service';

import * as helper from '../../../../helper';

import { SetupCampusAddEdit } from '../../../Setup/Campus/add-edit';
import moment from 'moment';

type ValidateFeeChallanValidity = { data: IFeeChallanValidity, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeChallanValidity> = {
    data: {
        campusProgramId: { required },
        installmentNo: { required },
        fromDate: { required },
        toDate: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'Campus': SetupCampusAddEdit
    }

})
export class FeeChallanValidityAddEdit extends Vue {
    private isActive: boolean = true;
    private repository: FeeChallanValidityService;
    private currentDate: Date = new Date();
    private campusId: string = '';
    private classId: string = '';
    private sessionid: string = '';
    // private Classrepository: SetupClassService = null;
    // private ClassList: Array<ISetupClass> = [];
    // private ClassId: string = '';
    private dataList: Array<ICampusChallanValidityVM> = [];
    private campusProgramLinkList: Array<ISetupCampusProgramLinkVM> = [];
    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)

    private data: IFeeChallanValidity = {
        challanValidityId: '', campusId: '', installmentNo: null, fromDate: new Date(), toDate: new Date(), statusId: 0, loggerId: '', campusProgramId: '', classId: ''
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    private CampusRepository: SetupCampusService = null;
    private CampusProgramRepository: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(this.$store);

    private CampusList: Array<ISetupCampus> = [];
    private cityDDL: Array<DDLGroupModel> = []
    private datas: Array<ICampusChallanValidityVM> = [];
    private campusddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []

    private currDate = new Date();
    // private installmentList: any = [];

    private fromDate: any = {};
    private toDate: any = {};
    // maxInstallmentList = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }]

    private installmentList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    created() {
        this.repository = new FeeChallanValidityService(this.$store);
        this.CampusRepository = new SetupCampusService(this.$store);
        this.campusRepo = new SetupCampusService(this.$store);
        // this.loadCityCampus();
        // this.Classrepository = new SetupClassService(this.$store);
    }

    // mounted(){
    //     this.Classrepository.GetFindBy('e=>e.StatusId==1').then(res => this.ClassList = res as Array<ISetupClass>);
    // }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        // this.campusId= event.params.model.campusId
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        // alert(this.data.campusId)
        this.sessionid = event.params.SESSIONID;
        this.campusId = event.params.campusid;
        this.classId = event.params.model.classId;
        this.installmentList = event.params.installmentList
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        if (this.data.statusId == 0) {
            this.isActive = false;
        }

        if (this.IsNewRecord) {
            this.data.installmentNo = 1;
        }
        this.loadCampusProgram();
    }

    loadCampusProgram() {
        this.campusProgramLinkList = [];
        this.CampusProgramRepository.GetAllVM(this.sessionid + '?' + this.campusId)
            .then(r => {
                this.campusProgramLinkList = r as Array<ISetupCampusProgramLinkVM>;
            });
    }
    reloadList() {
        this.installmentList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        if (this.IsNewRecord) {
            this.data.installmentNo = 1;
        }

        this.repository.GetFindBy('e => e.CampusId.ToString() == \"' + this.campusId + '\" && e.StatusId != 2')
            .then(response => {
                this.dataList = (response as Array<ICampusChallanValidityVM>)
            });
    }

    cancel() {
        this.$emit("submit");
        this.$modal.hide('add-edit-model');
    }


    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.datas = [];
                this.repository.GetFindBy('e => e.CampusId.ToString() == \"' + this.campusId + '\"&& e.ClassId.ToString() == \"' + this.classId + '\" && e.StatusId != 2')
                    .then(response => {
                        this.datas = (response as Array<ICampusChallanValidityVM>)
                        var dupData = 0;
                        dupData = this.datas.filter(s => s.installmentNo == this.data.installmentNo && s.campusProgramId == this.data.campusProgramId).length;
                        // && s.campusProgramId == this.data.campusProgramId
                        // debugger;
                        if (dupData > 0) {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: "Record Already Exists",
                                title: "Warning",
                                messageTypeId: PayloadMessageTypes.warning
                            });
                        } else {

                            this.data.challanValidityId = helper.newGuid();
                            this.data.statusId = 1;
                            this.data.loggerId = helper.newGuid();
                            this.data.fromDate = new Date(moment(this.data.fromDate).format('YYYY-MM-DD'));
                            this.data.toDate = new Date(moment(this.data.toDate).format('YYYY-MM-DD'));
                            this.data.campusId = this.campusId;

                            if (new Date(this.data.fromDate) <= new Date(this.data.toDate)) {
                                this.repository.AddOne(this.data)
                                    .then(() => {
                                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                                            text: 'Record has been inserted successfully',
                                            title: 'Success',
                                            messageTypeId: PayloadMessageTypes.success
                                        })
                                        this.cancel();
                                    });
                            }
                            else {
                                this.$store.dispatch(StoreTypes.updateStatusBar, {
                                    text: 'From Date should be less than To Date',
                                    title: 'Failed',
                                    messageTypeId: PayloadMessageTypes.error
                                });
                            }
                        }
                    });

            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1;
                } else {
                    this.data.statusId = 0;
                }
                this.data.fromDate = new Date(moment(this.data.fromDate).format('YYYY-MM-DD'));;
                this.data.toDate = new Date(moment(this.data.toDate).format('YYYY-MM-DD'));
                if (new Date(this.data.fromDate) <= new Date(this.data.toDate)) {

                    this.repository.Update(this.data)
                        .then(() => {
                            this.$store.dispatch(StoreTypes.updateStatusBar, {
                                text: 'Record has been updated successfully',
                                title: 'Success',
                                messageTypeId: PayloadMessageTypes.success
                            })
                            this.cancel();
                        });
                } else {
                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'From Date should be less than To Date',
                        title: 'Failed',
                        messageTypeId: PayloadMessageTypes.error
                    });
                }
            }
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }

    $v: any
}
