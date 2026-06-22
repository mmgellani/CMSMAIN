import Vue from 'vue';
import Component from 'vue-class-component';
import collapsibleWidget from '../collapsibleWidget';
@Component({
    name: 'pre-admission-widget',
    template: require('./index.html'),
    components: {
        'collapsible-widget': collapsibleWidget
    }
})
export default class preAdmission extends Vue {



}
