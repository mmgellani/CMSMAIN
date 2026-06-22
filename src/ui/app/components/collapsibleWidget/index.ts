import Vue from 'vue';
import Component from 'vue-class-component';
import './index.scss';
@Component({
    name: 'collapsible-widget',
    template: require('./index.html'),
    // props: ["title", "action"]
})
export default class collapsibleWidget extends Vue {
    private visible = true;
    private bodyVisible = true;

    mounted() {

    }

    closeWindow() {
        this.visible = false;
    }

    collapseBody() {
        this.bodyVisible = false;
    }

    openBody() {
        this.bodyVisible = true;
    }
}
