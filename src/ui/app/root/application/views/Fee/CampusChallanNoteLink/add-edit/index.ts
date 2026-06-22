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

import { IFeeCampusChallanNoteLink, ISetupCampus, IFeeChallanNote, IFeeChallanType, DDLGroupModel, DDLModel, ICampusCityVM } from '../../../../models';
import { FeeCampusChallanNoteLinkService, SetupCampusService, FeeChallanNoteService, FeeChallanTypeService } from '../../../../service';

import * as helper from '../../../../helper';

import { FeeChallanNoteAddEdit } from '../../ChallanNote/add-edit';
import { FeeChallanTypeAddEdit } from '../../ChallanType/add-edit';
import { SetupCampusAddEdit } from '../../../Setup/Campus/add-edit';

type ValidateFeeCampusChallanNoteLink = { data: IFeeCampusChallanNoteLink, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateFeeCampusChallanNoteLink> = {
    data: {
        campusId: { required },
        challanNoteId: { required },
        installmentNo: { required },
        challanTypeId: { required }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
    components: {
        'ChallanNote': FeeChallanNoteAddEdit,
        'ChallanType': FeeChallanTypeAddEdit,
        'Campus': SetupCampusAddEdit
    }
})
export class FeeCampusChallanNoteLinkAddEdit extends Vue {
    private repository: FeeCampusChallanNoteLinkService;
    private Campusrepository: SetupCampusService = null;
    CampusList: Array<ISetupCampus> = [];
    private FeeChallanNoterepository: FeeChallanNoteService = null;
    FeechallanNoteList: Array<IFeeChallanNote> = [];
    private ChallanTyperepository: FeeChallanTypeService = null;
    FeeChallanTypeList: Array<IFeeChallanType> = [];

    private cityDDL: Array<DDLGroupModel> = []
    private campusddl: Array<DDLModel> = []
    private campusCityList: Array<ICampusCityVM> = []
    private campusId: string = '';


    private campusRepo: SetupCampusService = new SetupCampusService(this.$store)

    private data: IFeeCampusChallanNoteLink = {
        campusChallanNoteLinkId: '', campusId: '', challanNoteId: '', installmentNo: 0, challanTypeId: '', statusId: 0, loggerId: '',
    };
    private IsNewRecord: boolean = true;
    private title: string = '';
    isActive: boolean = true;

    created() {
        this.repository = new FeeCampusChallanNoteLinkService(this.$store);
    }

    beforeModalOpen(event) {
        this.$v.$reset();
        this.IsNewRecord = event.params.IsNewRecord;
        this.title = this.IsNewRecord ? 'Add Record' : 'Edit Record';
        Object.assign(this.data, event.params.model);
        if (this.data.statusId == 1) {
            this.isActive = true;
        }
        else {
            this.isActive = false;
        }

        this.Campusrepository = new SetupCampusService(this.$store);
        this.Campusrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.CampusList = res as Array<ISetupCampus>

        });
        this.ChallanTyperepository = new FeeChallanTypeService(this.$store);
        this.ChallanTyperepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.FeeChallanTypeList = res as Array<IFeeChallanType>

        });
        this.FeeChallanNoterepository = new FeeChallanNoteService(this.$store);
        this.FeeChallanNoterepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.FeechallanNoteList = res as Array<IFeeChallanNote>

        });
        this.loadCityCampus();
    }
    loadCityCampus() {
        this.campusddl = [];
        this.cityDDL = [];
        let oldObj: ICampusCityVM;
        this.campusRepo.GetCityVM().then(r => {
            this.campusCityList = r as Array<ICampusCityVM>;
        });
    }

    addNewChallanNote() {
        this.$modal.show('ChallanNote-add-edit-model', { IsNewRecord: true });

    }
    loadChallanNote() {
        this.FeeChallanNoterepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.FeechallanNoteList = res as Array<IFeeChallanNote>

        });

    }

    addNewChallanType() {
        this.$modal.show('ChallanType-add-edit-model', { IsNewRecord: true });

    }
    loadChallanType() {
        this.ChallanTyperepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.FeeChallanTypeList = res as Array<IFeeChallanType>

        });

    }

    addNewCampus() {
        this.$modal.show('Campus-add-edit-model', { IsNewRecord: true });

    }
    loadCampus() {
        this.Campusrepository.GetFindBy('e=>e.StatusId==1').then(res => {
            this.CampusList = res as Array<ISetupCampus>

        });

    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }

    saveModel() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
            if (this.IsNewRecord) {
                this.data.campusChallanNoteLinkId = helper.newGuid();
                this.data.loggerId = helper.newGuid();
                this.data.statusId = 1;
                this.repository.AddOne(this.data)
                    .then(() => {
                        this.$store.dispatch(StoreTypes.updateStatusBar, {
                            text: 'Record has been inserted successfully',
                            title: 'Success',
                            messageTypeId: PayloadMessageTypes.success
                        })
                        this.cancel();
                    });
            } else {
                if (this.isActive == true) {
                    this.data.statusId = 1
                }
                else {
                    this.data.statusId = 0
                }
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