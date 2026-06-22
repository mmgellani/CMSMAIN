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
import { IFeeFeeStructure, ISetupZone, IFeeFeeHead, ISetupClass, ISetupProgram, ISetupSession, ISetupZoneCityLink, ISetupZoneCityLinkVM, IFeeFeeHeadCheckBox, ISetupShift, ISetupCity, ISetupClassCheckBox } from '../../../../models';
import { FeeFeeStructureService, SetupZoneService, FeeFeeHeadService, SetupClassService, SetupProgramService, SetupSessionService, SetupZoneCityLinkService, SetupShiftService, SetupCityService } from '../../../../service';

import * as helper from '../../../../helper';
import { FeeDetail } from './FeeDetail';

import { SetupSessionAddEdit } from '../../../Setup/Session/add-edit';
import { SetupZoneAddEdit } from '../../../Setup/Zone/add-edit';

type ValidateFeeFeeStructure = { model: IFeeFeeStructure, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeFeeStructure> = {
    model: {
        feeStructureId: { required },
        zoneId: { required },
        sessionId: { required },
        programId: { required },
        shiftId: { required },
        classId: { required },
        feeHeadId: { required },
        feeAmount: { required },
        statusId: { required },
        loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'fee-detail': FeeDetail,
        'Zone': SetupZoneAddEdit,
        'Session': SetupSessionAddEdit
    }
})
export class FeeFeeStructureAddEdit extends Vue {
    private isSave: boolean = false;
    private zoneList: Array<ISetupZone> = []
    private feeHeadList: Array<IFeeFeeHead> = []
    private feeHeadListCB: Array<IFeeFeeHeadCheckBox> = []
    private feeHeadDataListCB: Array<IFeeFeeHeadCheckBox> = []

    private ClassDataListCB: Array<ISetupClassCheckBox> = []
    private TempClassDataListCB: Array<ISetupClassCheckBox> = []

    private classList: Array<ISetupClass> = []
    private programList: Array<ISetupProgram> = []
    private programListTb: Array<ISetupProgram> = []
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


    private repository: FeeFeeStructureService;
    private data: IFeeFeeStructure = {
        feeStructureId: '', zoneId: '', sessionId: '', programId: '', shiftId: '', classId: '', feeHeadId: '', feeAmount: 0, statusId: 0, loggerId: '', isApproved: false,
    };
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
    model: ISetupClassCheckBox = null;

    created() {
        this.repository = new FeeFeeStructureService(this.$store);


    }

    loadCity() {
        this.cityRepo.GetFindBy("s=>s.StatusId!=2 && s.ZoneId.ToString()==\"" + this.zoneId + "\"")
            .then(r => {
                this.cityList = r as Array<ISetupCity>
            })
    }
    reloadClassList(model: ISetupClassCheckBox) {
        this.TempClassDataListCB = this.ClassDataListCB.filter(s => s.isChecked)
    }
    reloadFeaHead(feehead: IFeeFeeHead) {
        var oldLength = this.feeHeadDataListCB.length
        this.feeHeadDataListCB = this.feeHeadListCB.filter(s => s.isChecked)
        var newLength = this.feeHeadDataListCB.length
        this.tempCheckStatus = newLength > oldLength ? 1 : 0
        this.tempFeeHead = feehead;
    }

    // FeeHeadChange(value: any, obj: IFeeFeeHead) {
    //     var element = <HTMLInputElement>document.getElementById(value);
    //     if (element.checked == true) {
    //         // this.selectedFeeHeads.push(obj);
    //         // this.tempCheckStatus = 1;
    //     }
    //     else {
    //         var index = this.selectedFeeHeads.indexOf(obj);
    //         this.selectedFeeHeads.splice(index, 1);
    //         this.tempCheckStatus = 0;
    //     }
    //     this.tempFeeHead = obj;
    // }
    loadZoneCity() {
        this.zoneCityRepo.GetAllVMByZone(this.zoneId)
            .then(r => {
                this.zoneCityList = r as Array<ISetupZoneCityLinkVM>
            })
    }

    loadShifts() {
        this.shiftRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.shiftList = r as Array<ISetupShift>
            })
    }
    addNewSession() {
        this.$modal.show('Session-add-edit-model', { IsNewRecord: true });

    }
    loadSession() {
        this.sessionRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.sessionList = r as Array<ISetupSession>
            })
    }
    addNewZone() {
        this.$modal.show('Zone-add-edit-model', { IsNewRecord: true });

    }

    loadZone() {
        this.zoneRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.zoneList = r as Array<ISetupZone>
            })
    }

    maxInstallments = [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11 }, { item: 12 }]

    loadFeeHead() {
        this.feeHeadRepo.GetFindBy('s=>s.StatusId != 2')
            .then(r => {
                this.feeHeadList = (r as Array<IFeeFeeHead>).sort((obj1, obj2) => {
                    if (obj1.orderBy > obj2.orderBy) {
                        return 1;
                    }

                    if (obj1.orderBy < obj2.orderBy) {
                        return -1;
                    }

                    return 0;
                })
                this.feeHeadList.forEach(r => {
                    if (r.feeHeadId.toString().substr(0, 7) != '0000000') {
                        this.feeHeadListCB.push({
                            feeHeadId: r.feeHeadId,
                            statusId: r.statusId,
                            loggerId: r.loggerId,
                            fullName: r.fullName,
                            description: r.description,
                            feeType: r.feeType,
                            isChecked: false,
                            orderBy: r.orderBy,
                            challanTypeId: r.challanTypeId,
                        });
                    }
                })
            })
    }
    loadClass() {
        this.ClassDataListCB = []
        this.classRepo.GetFindBy('s=>s.StatusId!=2')
            .then(r => {
                this.classList = r as Array<ISetupClass>
                this.classList.forEach(e => {
                    this.ClassDataListCB.push({
                        classCode: e.classCode, statusId: e.statusId,
                        isChecked: false, classId: e.classId, description: e.description, fullName: e.fullName
                        , isAdmissionTest: e.isAdmissionTest, isInterview: e.isInterview, loggerId: e.loggerId
                    })
                })
            })
    }

    loadPrograms() {
        this.programRepo.GetFindBy('e=>e.StatusId==1')
            .then(r => {
                this.programList = r as Array<ISetupProgram>
            })
    }

    insertIntoTab(item: ISetupProgram) {

        if (this.programListTb.find(s => s.programId == item.programId) == null) {
            this.programListTb.push({ code: item.code, description: item.description, fullName: item.fullName, loggerId: item.loggerId, programId: item.programId, statusId: item.statusId })
        } else {
            var index=this.programListTb.indexOf(this.programListTb.find(s => s.programId == item.programId))
            this.programListTb.splice(index,1)
        }
    }

    // reloadFeaHead(feehead: IFeeFeeHead) {
    //     var oldLength = this.feeHeadDataListCB.length
    //     this.feeHeadDataListCB = this.feeHeadListCB.filter(s => s.isChecked)
    //     var newLength = this.feeHeadDataListCB.length
    //     this.tempCheckStatus = newLength > oldLength ? 1 : 0
    //     this.tempFeeHead = feehead;
    // }


    // reloadPrograms(programs: ISetupProgram) {
    //     var oldLength = this.feeHeadDataListCB.length
    //     this.feeHeadDataListCB = this.feeHeadListCB.filter(s => s.isChecked)
    //     var newLength = this.feeHeadDataListCB.length
    //     this.tempCheckStatus = newLength > oldLength ? 1 : 0
    //     this.tempFeeHead = feehead;
    // }


    // loadProgram() {
    //     this.programRepo.GetFindBy('s=>s.StatusId!=2')
    //         .then(r => {
    //             this.programList = r as Array<ISetupProgram>
    //         })
    // }
    beforeModalOpen(event) {
        this.programListTb=[]
        this.classList = [];
        this.zoneCityList = [];
        this.zoneList = [];
        this.feeHeadList = [];
        this.programList = [];
        this.sessionList = []
        this.shiftList = [];
        this.feeHeadDataListCB = [];
        this.feeHeadListCB = [];
        this.loadClass();
        this.loadZone();
        this.loadFeeHead();
        this.loadPrograms();
        // this.loadProgram();
        this.loadSession();
        this.loadShifts();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.zoneId = this.data.zoneId;
        this.sessionId = this.data.sessionId;
        this.loadCity();
        this.TempClassDataListCB = [];
        this.ClassDataListCB = [];
    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }
changeIsSave(){
    this.isSave=false;
    console.log('value is changed now '+this.isSave)
}
    saveModel() {
        if (this.isSave == true) {
            this.isSave = false;
        }
        this.isSave = true;
        console.log(this.isSave+' from button')
    }
    $v: Vuelidate<any>;
}

