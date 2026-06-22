import Vue from 'vue';
import Component from 'vue-class-component';
import './index.scss';
@Component({
    name: 'table-graph',
    template: require('./index.html'),
    props: ["tableVar", "graphVar"]
})
export default class tableGraph extends Vue {
    private visible = true;
    private bodyVisible = true;
     private tableVarTemp=false ;
     private graphVarTemp=false  ;
    tableVar = (<any>this).tableVar;
    graphVar = (<any>this).graphVar;
   // graphVarTemp = (<any>this).graphVarTemp;
   created(){
       this.$watch('tableVar',this.ReAssign)
       this.$watch('graphVar',this.ReAssign)
   }
    mounted() {
        this.ReAssign();
    }

    ReAssign(){
        this.tableVarTemp = this.tableVar;
        this.graphVarTemp = this.graphVar;
    }


    collapseBody() {
        this.bodyVisible = false;
    }

    openBody() {
        this.bodyVisible = true;
    }
    leftSide() {
        this.tableVarTemp = true;
        this.graphVarTemp = false;
    }
    rightSide() {

        this.tableVarTemp = false;
        this.graphVarTemp = true; 
    }


}
