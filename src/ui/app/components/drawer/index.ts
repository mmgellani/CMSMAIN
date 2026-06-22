import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
    name: 'drawer-area',
    template: require('./index.html'),
    // props: ["title", "action"]
})
export class DrawerArea extends Vue {
    // title: string = (<any>this).title;
    // action: number = (<any>this).action;

    private closeDrawer: boolean = false;

    created() {
        //$('[data-toggle="tooltip"]').tooltip();
    }
}