/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import Vue from 'vue';
import Component from 'vue-class-component';
import { required, maxLength } from 'vuelidate/lib/validators';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';

import { StoreTypes } from '../../../../../../store';
import { PayloadMessageTypes } from '../../../../../../model';
import { IFeeFeeStructure, ISetupZone, IFeeFeeHead, ISetupClass, ISetupProgram, ISetupSession, ISetupZoneCityLink, ISetupZoneCityLinkVM, IFeeFeeHeadCheckBox, ISetupShift, ISetupCity, IFeeFeeStructureDetailVM } from '../../../../models';
import { FeeFeeStructureService, SetupZoneService, FeeFeeHeadService, SetupClassService, SetupProgramService, SetupSessionService, SetupZoneCityLinkService, SetupShiftService, SetupCityService, FeeFeeStructureDetailService } from '../../../../service';

import * as helper from '../../../../helper';
import { FeeDetail } from './FeeDetail';

import { SetupSessionAddEdit } from '../../../Setup/Session/add-edit';
import { SetupZoneAddEdit } from '../../../Setup/Zone/add-edit';
import { homedir } from 'os';

type ValidateFeeFeeStructure = { model: IFeeFeeStructure, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeFeeStructure> = {
    model: {


    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'feeStructure-edit',
    template: require('./edit.html'),
    components: {
        'fee-detail': FeeDetail,
        'Zone': SetupZoneAddEdit,
        'Session': SetupSessionAddEdit
    }
})
export class FeeStructureEdit extends Vue {
    private isSave: boolean = false;
    private zoneList: Array<ISetupZone> = []
    private feeHeadList: Array<IFeeFeeHead> = []
    private feeHeadListCB: Array<IFeeFeeHeadCheckBox> = []
    private feeHeadDataListCB: Array<IFeeFeeHeadCheckBox> = []
    private classList: Array<ISetupClass> = []
    private programList: Array<ISetupProgram> = []
    private sessionList: Array<ISetupSession> = []
    private zoneCityList: Array<ISetupZoneCityLinkVM> = []
    private shiftList: Array<ISetupShift> = []
    private cityList: Array<ISetupCity> = [];

    private zoneRepo: SetupZoneService = new SetupZoneService(this.$store)
    private feeHeadRepo: FeeFeeHeadService = new FeeFeeHeadService(this.$store)
    private classRepo: SetupClassService = new SetupClassService(this.$store)
    private programRepo: SetupProgramService = new SetupProgramService(this.$store)
    private sessionRepo: SetupSessionService = new SetupSessionService(this.$store)
    private zoneCityRepo: SetupZoneCityLinkService = new SetupZoneCityLinkService(this.$store)
    private shiftRepo: SetupShiftService = new SetupShiftService(this.$store)
    private cityRepo: SetupCityService = new SetupCityService(this.$store)

    private installdata: Array<IFeeFeeStructureDetailVM> = []
    private repository: FeeFeeStructureService;
    private Installmentsrepository: FeeFeeStructureDetailService;
    private Installmentsdata: Array<IFeeFeeStructureDetailVM> = [];
    private data: IFeeFeeStructure = {
        feeStructureId: '', zoneId: '', sessionId: '', programId: '', shiftId: '', classId: '', feeHeadId: '', feeAmount: 0, statusId: 0, loggerId: '', isApproved: false,
    };
    private FeeHeadrepository: FeeFeeHeadService = null;
    HeadList: Array<IFeeFeeHead> = [];
    feeHeadName: IFeeFeeHead = { description: '', feeHeadId: '', feeType: 0, fullName: '', loggerId: '', orderBy: 1, statusId: 1, challanTypeId:'', }
    private IsNewRecord: boolean = true;
    private title: string = '';
    zoneId = ''
    sessionId = ''
    feeHeadId = ''
    classId = ''
    programId = ''
    installmentNo = 3
    tempCheckStatus: number = 0;
    tempFeeHead: IFeeFeeHead = null;


    created() {
        this.repository = new FeeFeeStructureService(this.$store);
        this.FeeHeadrepository = new FeeFeeHeadService(this.$store);
        this.Installmentsrepository = new FeeFeeStructureDetailService(this.$store);
        this.loadFeeHead();

    }

    mounted() {


    }

    refreshdata() {
        this.installdata = [];

    }

    loadInstallmentsdata() {
        this.Installmentsdata = [];
        this.Installmentsrepository.GetAllVM('e=>e.StatusId!=2')
            .then(response => {
            this.Installmentsdata = response as Array<IFeeFeeStructureDetailVM>

                this.installdata = this.Installmentsdata.filter(e => e.feeStructureId == this.data.feeStructureId)
                //console.log(JSON.stringify(this.installdata))
            }


            );
    }


    addNewFeeHead() {
        this.$modal.show('FeeHead-add-edit-model', { IsNewRecord: true });

    }
    loadFeeHead() {
        this.FeeHeadrepository.GetFindBy('e=>e.StatusId!=2').then(res => {
            this.HeadList = res as Array<IFeeFeeHead>



        });

    }


    beforeModalOpen(event) {
        Object.assign(this.data, event.params.model);
        this.loadInstallmentsdata();
        this.feeHeadName = this.HeadList.find(e => e.feeHeadId == this.data.feeHeadId)

    }


    reloadAmount() {
        var instLength = this.installdata.length;
        var newAmount = this.data.feeAmount / instLength
        var d = this.installdata[0].feeHeadName.toLowerCase();
        if (this.installdata[0].feeHeadName.toString().toLowerCase().search('admission') == 0) {
            var index = this.installdata.indexOf(this.installdata.find(s => s.installmentNo == 1))
            this.installdata[index].feeAmount = this.data.feeAmount
        }
        else {


            this.installdata.forEach(s => {
                s.feeAmount = Math.round(newAmount)
            })
        }
    }

    cancel() {
        this.refreshdata();
        this.$modal.hide('edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.repository.Update(this.data)
            .then(r => {
                this.installdata.forEach(e => {
                    this.Installmentsrepository.Update(e).then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: "Record has been updated successfully",
                            title: "Success",
                            messageTypeId: PayloadMessageTypes.success
                        });
                    })

                });


                this.cancel();

            });
    }
    $v: Vuelidate<any>;
}

