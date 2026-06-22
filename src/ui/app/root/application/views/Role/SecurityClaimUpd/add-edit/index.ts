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
import { PayloadMessageTypes, IUser } from '../../../../../../model';

import { IRolePrevilages, ISetupZone, ISetupSession, DDLGroupModel, DDLModel, ICampusCityVM, ISetupCampus, ISetupCampusProgramVM, ISetupProgram, IRoles, ISetupShift, ISetupClass, IRoleAssignedList, IUserList, PrevilagesData, ISetupSubCity, ISetupCity, ISecurityClaimUpd } from '../../../../models';
import { RolePrevilagesService, SetupZoneService, SetupSessionService, SetupCampusService, SetupCampusProgramLinkService, SetupProgramService, SetupShiftService, SetupClassService, SetupSubCityService, SetupCityService, SecurityClaimUpdService } from '../../../../service';

import * as helper from '../../../../helper';

import { TreeItem } from '../../../../../../components';
import { IRootStoreState } from '../../../../../store/state';
import { State } from 'vuex-class';

type ValidateSecurityClaimUpd = {
    data: ISecurityClaimUpd;
    validationGroup: string[];
};
let customValidation: ValidationRuleset<ValidateSecurityClaimUpd> = {
    data: {
        securityClaimId: {
            required
        },
        description: {
            required
        }
    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html'),
})
export class SecurityClaimsAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: SecurityClaimUpdService = null
    private IsNewRecord: boolean = true;
    private editSecurityClaim = false;
    private title: string = '';
    private data: ISecurityClaimUpd =
        { securityClaimId: '', description: '', enabled: true, origin: '', validationPattern: '', createdBy: -1, createdOn: new Date(), lastUpdatedBy: -1, lastUpdatedOn: new Date() }

    created() {
        this.repository = new SecurityClaimUpdService(this.$store);
    }

    beforeModalOpen(event) {

        this.IsNewRecord = true;

        this.IsNewRecord = event.params.IsNewRecord;

        if (this.IsNewRecord == false) {
            this.editSecurityClaim = true;
            Object.assign(this.data, event.params.model)

        }
        else {
            this.editSecurityClaim = false;
        }

        this.title = this.IsNewRecord ? "Add Record" : "Edit Record";

    }

    beforeModalClose() {
    }

    cancel() {

        this.data = { securityClaimId: '', description: '', enabled: true, origin: '', validationPattern: '', createdBy: -1, createdOn: new Date(), lastUpdatedBy: -1, lastUpdatedOn: new Date() }
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }



    saveModel() {

        this.$v.$touch();
        if (!this.$v.$invalid) {

            if (this.IsNewRecord) {
                this.data.enabled = true;
                this.data.origin = "System";
                this.data.validationPattern = "^([X]|([CRUD]{1,4}))$";
                this.data.createdBy = this.user.userId;
                this.data.lastUpdatedBy = this.user.userId;
                var z = JSON.stringify(this.data) + '?' + '0';
            }

            else {


                this.data.lastUpdatedBy = this.user.userId;
                var z = JSON.stringify(this.data) + '?' + '1';

            }

            this.repository.InsertSecurityClaims(z).then(() => {
                this.$store.dispatch(StoreTypes.updateStatusBar, {
                    text: 'Record has been inserted successfully',
                    title: 'Success',
                    messageTypeId: PayloadMessageTypes.success
                })
                this.cancel();
            });
        }

    }
    get allowSubmit() {
        let error = this.$v.data.$error || this.$v.data.$invalid;
        return !error;
    }
    $v: any;
}