import Vue from 'vue';
import Component from 'vue-class-component';

import { Messages } from './extension/messages';
import { Progress } from './extension/progress';

@Component({
    template: require('./notifications.html'),
    components: { Messages, Progress }
})
export class Notifications extends Vue {
    notificationsTabSelected = 1;
    newNotifications = null;
    isLoad = false;

    changeNotificationsTab(tab) {
        Vue.set(this, 'notificationsTabSelected', tab);
        Vue.set(this, 'newNotifications', null);
    }

    loadNotifications() {
        Vue.set(this, 'isLoad', true);

        setTimeout(() => {
            Vue.set(this, 'newNotifications', 'new notifications component');
            Vue.set(this, 'isLoad', false);
        }, 1500);
    }
}