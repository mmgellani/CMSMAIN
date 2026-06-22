/*
*   Auther: H.Muhammad Kamran
*   email: hmuhdkamran@gmail.com
*   contact: +92 (313 / 333) 9112 845
*/

import * as helper from '../../../../helper';

import { DDLGroupModel, DDLModel, ICampusBank, IFeeBank, IFeeCampusBankLink, ISetupCampus, ISetupCampusProgramVM, ISetupGender } from '../../../../models';
import { FeeBankService, FeeCampusBankLinkService, SetupCampusProgramLinkService, SetupCampusService, SetupGenderService } from '../../../../service';
import { ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { maxLength, required } from 'vuelidate/lib/validators';

import Component from 'vue-class-component';
import { FeeBankAddEdit } from '../../Bank/add-edit';
import { PayloadMessageTypes } from '../../../../../../model';
import { SetupCampusAddEdit } from '../../../Setup/Campus/add-edit';
import { StoreTypes } from '../../../../../../store';
import Vue from 'vue';

type ValidateFeeCampusBankLink = { data: IFeeCampusBankLink, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeCampusBankLink> = {
    data: {
        programDetailId: { required },
        bankId: { required }
        // genderId: { required }

    }
};

export interface SelectedGender {
    genderId: string,
    name: string,
    isChecked: boolean
}

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'Bank': FeeBankAddEdit,
        'Campus': SetupCampusAddEdit
    }
})
export class FeeCampusBankLinkAddEdit extends Vue {
    private repository: FeeCampusBankLinkService;
    private Bankrepository: FeeBankService = null;
    private Campusrepository: SetupCampusService = null;
    private GenderRepo: SetupGenderService = new SetupGenderService(this.$store);
    BankList: Array<IFeeBank> = [];
    GenderSelectedList: Array<SelectedGender> = [];
    GenderList: Array<ISetupGender> = [];
    CampusList: Array<ISetupCampus> = [];
    private isActive: boolean = true;
    private campusId = '';
    private cityId = '';
    private data: IFeeCampusBankLink = {
        campusBankLinkId: '', campusId: '', programDetailId: '', bankId: '', statusId: 0, loggerId: '',
        genderId: '',showInChallan:true
    };
    //new FeeBankService
    private IsNewRecord: boolean = true;
    private title: string = '';
    private sessionId: string = '';
    private ddl: Array<DDLModel> = [];
    private programDDL: Array<DDLGroupModel> = [];
    private campusProgramLinkRepo: SetupCampusProgramLinkService = new SetupCampusProgramLinkService(
        this.$store
    );
    private campusProgramLinkList: Array<ISetupCampusProgramVM> = [];
    ids: any = [];
    private campusbankRepo: FeeCampusBankLinkService = new FeeCampusBankLinkService(this.$store);
    created() {
        this.GenderSelectedList = [];
        this.repository = new FeeCampusBankLinkService(this.$store);
        this.Bankrepository = new FeeBankService(this.$store);
        // this.Bankrepository.GetFindBy('e=>e.StatusId!=2').then(res => {
        //     this.BankList = res as Array<IFeeBank>

        // });

        this.GenderRepo.GetFindBy('e=>e.StatusId==1').then(r => {
            this.GenderList = r as Array<ISetupGender>
            this.GenderList.forEach(e => {
                this.GenderSelectedList.push({
                    genderId: e.genderId,
                    name: e.description,
                    isChecked: false
                })
            });
        })
    }

    beforeModalOpen(event) {
       
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        this.campusId = event.params.campusid
        this.cityId = event.params.cityId
        this.loadBank(this.cityId)
        var key = this.campusId + "?" + this.data.programDetailId
        // this.campusbankRepo.GetBank(key)
        //     .then(r => {
        //         this.BankList = r as Array<ICampusBank>
        //     })
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }
        if (this.data.genderId != '' && this.data.genderId != null) {
            var list = JSON.parse(this.data.genderId)
            this.GenderSelectedList.forEach(e => {
                if (list.find(s => s.genderId == e.genderId) != null) {
                    e.isChecked = true
                }
                else {
                    e.isChecked = false;
                }
            })

        }
        this.sessionId = event.params.sessionId;
        this.loadProgramsOfCampus();
        if (!this.IsNewRecord) {
           // this.loadBank();
            // if (this.data.statusId == 1) {
            //     this.isActive = true;

            // } else {
            //     this.isActive = false;
            // }
        }
    }

    loadProgramsOfCampus() {
        this.ddl = [];
        this.programDDL = [];
        let oldObj: ISetupCampusProgramVM;
        var key = this.sessionId + "?" + this.data.campusId;
        this.campusProgramLinkRepo.GetAllVM(key).then(r => {
            this.campusProgramLinkList = r as Array<ISetupCampusProgramVM>;
        });
    }

    addNewBank() {
        this.$modal.show('Bank-add-edit-model', { IsNewRecord: true });

    }
    loadBank(key) {
        // if (this.campusId.length > 0 && this.data.programDetailId.length > 0) {
        //     var key = this.campusId + "?" + this.data.programDetailId

            this.Bankrepository.GetFindBy('s=>s.CityId.ToString()=="' + key +  '" && s.StatusId == 1')
                .then(r => {
                    this.BankList = r as Array<IFeeBank>
                    this.BankList.forEach(e=>{
                        e.fullName=e.fullName+" "+ e.accountNo
                    })
                })
        // }

    }

    addNewCampus() {
        this.$modal.show('Campus-add-edit-model', { IsNewRecord: true });

    }

    cancel() {
        this.$emit("submit");
        this.$modal.hide('add-edit-model');
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            this.ids = [];
            if (this.IsNewRecord) {
                this.data.campusBankLinkId = helper.newGuid();
                this.data.statusId = 1;
                this.data.loggerId = helper.newGuid();
                this.GenderSelectedList.forEach(ele => {
                    if (ele.isChecked == true) {
                        this.ids.push({
                            genderId: ele.genderId
                        })
                    }
                });
                this.data.genderId = JSON.stringify(this.ids);
                if(this.ids.length>0)
                {
                    var z=JSON.stringify(this.data);
                   
                    this.repository.AddOne(z)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    })
                }
                else

                {

                    this.$store.dispatch(StoreTypes.updateStatusBar, {
                        text: 'Please Select Gender',
                        title: 'Success',
                        messageTypeId: PayloadMessageTypes.warning
                    })



                }
             ;
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1;
                }
                else {
                    this.data.statusId = 0;
                }
                this.ids = [];
                this.GenderSelectedList.forEach(ele => {
                    if (ele.isChecked == true) {
                        this.ids.push({
                            genderId: ele.genderId
                        })
                    }
                });
                this.data.genderId = JSON.stringify(this.ids);
                // alert(JSON.stringify(this.data))

                this.repository.Update(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been updated successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            }
        }
    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any
}