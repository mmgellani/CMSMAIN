import Vue from "vue";
import Component from "vue-class-component";

import './index.scss';

@Component({
  template: require("./index.html"),
  components: { 
  }
})
export default class WidgetBox extends Vue {
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
