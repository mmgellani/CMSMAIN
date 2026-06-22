import Vue from "vue";
import Component from "vue-class-component";

@Component({
  template: require("./index.html"),
  props: {
      header: { type: String, default: '' }
  }
})
export class AreaWidget extends Vue {
}
