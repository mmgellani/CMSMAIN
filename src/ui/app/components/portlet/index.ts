import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    name: 'portlet-area',
    template: require('./index.html'),
    props: ["title", "action"]
})
export class PortletArea extends Vue {
    title: string = (<any>this).title;
    action: number = (<any>this).action;

    private toggle: boolean = false;

    created() {
        //$('[data-toggle="tooltip"]').tooltip();
    }
}