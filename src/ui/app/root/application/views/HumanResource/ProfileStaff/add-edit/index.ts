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
import { ISignupOptions, IUser } from '../../../../../../model';

import { IHumanResourceStaff, ISetupBloodGroup, ISetupCountry, IHumanResourceDepartments, IHumanResourceDesignations, ISetupGender, ISetupReligion } from '../../../../models';
import { HumanResourceStaffService, SetupBloodGroupService, SetupReligionService, SetupCountryService, HumanResourceDepartmentsService, SetupGenderService, HumanResourceDesignationsService } from '../../../../service';

import * as helper from '../../../../helper';
import { AuthenticationService } from '../../../../../../services';
import { State } from 'vuex-class';
import { IRootStoreState } from '../../../../../store';

type ValidateHumanResourceStaff = { model: IHumanResourceStaff, validationGroup: string[] };
let customValidation: ValidationRuleset<ValidateHumanResourceStaff> = {
    model: {
        // staffId: { required },
        departmentId: { required },
        designationId: { required },
        genderId: { required },
        fullName: { required },
        fatherName: { required },
        cNIC: { required },
        // dateOfBirth: { required },
        maritalStatus: { required },
        contactNo: { required },
        // statusId: { required },
        // loggerId: { required },

    }
};

@Component({
    mixins: [validationMixin],
    validations: customValidation,
    name: 'add-edit-model',
    template: require('./index.html')
})
export class HumanResourceStaffAddEdit extends Vue {
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private repository: HumanResourceStaffService;
    private oldPassword:string='';
    private newPassword:string='';
    private reEnterPassword:string='';
   
    
   

    created() {
        this.repository = new HumanResourceStaffService(this.$store);
       
    }

    beforeModalOpen(event) {
       

    }

    cancel() {
        this.$modal.hide('add-edit-model');
        this.$emit("submit");
    }
    

    saveModel() {
        //console.log(JSON.stringify(this.user))
        var key=this.user.name+"?"+this.oldPassword+"?"+this.newPassword;
        this.repository.ChangePassword(key)
        .then(r=>{
            var data=r as string;
            //console.log(data);
             this.$store.dispatch(StoreTypes.updateStatusBar, {
                text: data,
                title: 'Success',
                messageTypeId: PayloadMessageTypes.success
            })
            this.cancel();
        })
        this.cancel();
    }
    $v: Vuelidate<any>;

    get allowSubmit() {
     return  (this.newPassword==this.reEnterPassword && this.newPassword.length>0)
      }
   
}


