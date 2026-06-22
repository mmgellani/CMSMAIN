import Vue from 'vue';
import Component from 'vue-class-component';

import $ from 'jquery';

import { State } from 'vuex-class';
import { AuthenticationService } from '../../../services';
import { RootStoreTypes, IRootStoreState } from '../../store';
import { GlobalConfig } from '../../../common';

import { Notifications } from '../notifications/notifications';
import { IUser } from '../../../model';
import { SupportedLocales } from '../../../locales';

@Component({
    template: require('./index.html'),
    components: { Notifications }
})
export class AreaHeader extends Vue {

    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private auth: AuthenticationService;

    private showNotification: boolean = false;
    private quickAction: boolean = false;
    private languateBar: boolean = false;
    private userBar: boolean = false;

    created() {

        this.auth = new AuthenticationService(this.$store);

    }

    get activeCulture() {
        return this.user.cultureName;
    }

    get locales() {
        return SupportedLocales;
    }

    changeLocale(locale: string, e: Event) {

        if (locale !== this.$i18n.locale) {
            // user-options-plugin mixin watches for locale changes, and will invoke logic to load resource strings
            this.$store.dispatch(RootStoreTypes.common.updateLocale, locale);
        }
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

    private get initials() {
        var initValue: string = '';
        this.user.displayName.split(' ').forEach(element => {
            initValue += element.substr(0, 1);
        });

        return initValue;
    }

    private get displayName() {
        var displayNme: string = '';
        var index: number = 0;

        this.user.displayName.split(' ').forEach(element => {
            if (index == 0) {
                displayNme = '<strong>' + element + '</strong>'
                index++;
            } else {
                displayNme += (' ' + element);
            }
        });

        return displayNme;
    }
}