import Vue from 'vue';
import Component from 'vue-class-component';

import $ from 'jquery';

import { State } from 'vuex-class';
import { AuthenticationService } from '../../../services';
import { RootStoreTypes, IRootStoreState } from '../../store';
import { GlobalConfig } from '../../../common';

import { Notifications } from '../notifications/notifications';
import { IUser } from '../../../model';

@Component({
    template: require('./index.html'),
    components: { Notifications }
})
export class AreaHeader extends Vue {
    @State((state: IRootStoreState) => state.sidebarClose) sidebarClose: boolean;
    @State((state: IRootStoreState) => state.sidebarStatic) sidebarStatic: boolean;
    @State((state: IRootStoreState) => state.common.user) user: IUser;

    private auth: AuthenticationService;

    created() {
        this.auth = new AuthenticationService(this.$store);

        // if (window.innerWidth > 576) {
        //     setTimeout(() => {
        //         const $chatNotification = $('#chat-notification');
        //         $chatNotification.removeClass('hide').addClass('animated fadeIn')
        //             .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        //                 $chatNotification.removeClass('animated fadeIn');
        //                 setTimeout(() => {
        //                     $chatNotification.addClass('animated fadeOut')
        //                         .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
        //                             $chatNotification.addClass('hide');
        //                         });
        //                 }, 6000);
        //             });
        //         $chatNotification.siblings('#toggle-chat')
        //             .append('<i class="chat-notification-sing animated bounceIn"></i>');
        //     }, 4000);
        // }
    }

    get initials() {
        if(this.user) {
            if(this.user.displayName.split(' ').length > 1) {
                return this.user.displayName.split(' ')[0] + '<strong>' + this.user.displayName.split(' ')[1] + '</strong>';
            } else {
                return '<strong>' + this.user.displayName + '</strong>';
            }
        }
    }

    switchSidebarMethod() {
        if (!this.sidebarClose) {
            this.$store.dispatch(RootStoreTypes.switchSidebar, true);
            this.$store.dispatch(RootStoreTypes.changeSidebarActive, null);
        } else {
            this.$store.dispatch(RootStoreTypes.switchSidebar, false);
            const paths = this.$route.fullPath.split('/');
            paths.pop();
            this.$store.dispatch(RootStoreTypes.changeSidebarActive, paths.join('/'));
        }
    }

    toggleSidebarMethod() {
        console.log(this.sidebarStatic);
        if (this.sidebarStatic) {
            this.$store.dispatch(RootStoreTypes.toggleSidebar);
            this.$store.dispatch(RootStoreTypes.changeSidebarActive, null);
        } else {
            this.$store.dispatch(RootStoreTypes.toggleSidebar);
            const paths = this.$route.fullPath.split('/');
            paths.pop();
            this.$store.dispatch(RootStoreTypes.changeSidebarActive, paths.join('/'));
        }
    }

    toggleChat() {
        this.$store.dispatch(RootStoreTypes.toggleChat);
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