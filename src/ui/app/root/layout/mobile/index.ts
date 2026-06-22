import Vue from 'vue';
import Component from 'vue-class-component';
import { bus } from '../../root';
import { State } from 'vuex-class';
import { RootStoreTypes, IRootStoreState } from '../../store';
import { IUser } from '../../../model';
import { AuthenticationService } from '../../../services';
import { GlobalConfig } from '../../../common';
@Component({
    template: require('./index.html')
})
export class MobileArea extends Vue {
    
    value: boolean = false;
    @State((state: IRootStoreState) => state.common.user) user: IUser;
    private auth: AuthenticationService;

    toggleSideBar() {
        this.value = !this.value;
        bus.$emit('updated', this.value);
    }

    created() {
        this.auth = new AuthenticationService(this.$store);
    }

    logout(e: Event) {
        this.auth.logout()
            .then(user => {
                this.$store.dispatch(RootStoreTypes.common.updateUser, user);
            })
            .then(() => {
                let back = window.history.length;
                window.history.go(back);
                window.location.replace(GlobalConfig.uri.site);
            });
    }


}