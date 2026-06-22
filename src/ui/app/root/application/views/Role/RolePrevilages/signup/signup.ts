import Vue from 'vue';
import { Store } from 'vuex';
import { State } from 'vuex-class';
import { default as Component } from 'vue-class-component';
import { IVuelidate, ValidationRuleset, Vuelidate, validationMixin } from 'vuelidate';
import { validations, TSignup } from './signup-validate';

//import { AuthenticationService } from '../../../services';
//import { ICommonState, StoreTypes } from '../../../store';
//import { IUser, ISignupOptions } from '../../../model';
//import { IRouterMixinData } from '../../../mixins/mixin-router';
import { AuthenticationService } from '../../../../../../services';
import { ICommonState } from '../../../../../../store';
import { IUser, ISignupOptions } from '../../../../../../model';
import { IRouterMixinData } from '../../../../../../mixins/mixin-router';

@Component({
    mixins: [validationMixin],
    name: 'Signup',
    template: require('./signup.html'),
    validations: validations
})
export class SignupU extends Vue {

    private auth: AuthenticationService;

    private enablepass:boolean=false;

    @State((state: { common: ICommonState }) => state.common.user) user: IUser;

    constructor() {
        super();
    }

    beforeModalOpen() { }

    beforeModalClose() { }

    created() {
        this.auth = new AuthenticationService(this.$store);
    }

    get allowSubmit() {

        let error = this.$v.signup.$error || this.$v.signup.$invalid;
        return !error;
    }

    cancel() {
        this.$modal.hide('add-edit-model-user');
    }

    submit(): void {
     
        // if (this.allowSubmit) {

            let signup = Object.assign({}, this.signup);

            let onSignup = (value: IUser) => {
                //this.$store.dispatch(StoreTypes.updateUser, value);
            }

            let onStoreDispatch = (o) => {
                this.$modal.hide('add-edit-model-user');
                this.$emit('submit');
               // this.$router.push({ name: 'home' });
            };

            signup.cultureName = 'en';
            signup.timeZoneId = 'Asia/Karachi';

            if (this.enablepass == true)
            {
                signup.password="P@kht00nKhw@h";
                signup.confirmPassword="P@kht00nKhw@h"

            }
           

            this.auth.signup(signup)
                .then(onSignup as any)
                .then(onStoreDispatch);
        //}
    }

    signup: ISignupOptions = {
        confirmPassword: null,
        displayName: null,
        userName: null,
        password: null
    };

    $router: IRouterMixinData;

    $store: Store<{}>;

    $v: any
}