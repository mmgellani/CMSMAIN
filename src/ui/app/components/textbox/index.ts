import Vue from "vue";
import Component from "vue-class-component";

import * as helper from '../../root/application/helper';

@Component({
  name: "text-box",
  template: require("./index.html"),
  props: {
    value: null,
    fieldClass: { type: String, default: 'form-control form-control-sm' },
    fieldType: { type: String, default: 'T' },
    fieldFormat: { type: String, default: 'N' },    
    fieldMask: { type: String, default: '' }
  }
})
export class TextBox extends Vue {

  myPropertyValue(value) {
    if (this.condition === "TN") {
      return value;
    } else if (this.condition === "TU") {
      return value.toUpperCase();
    } else if (this.condition === "TL") {
      return value.toLowerCase();
    } else if (this.condition === "TNM") {
      return value;
    } else if (this.condition === "TUM") {
      return value.toUpperCase();
    } else if (this.condition === "TLM") {
      return value.toLowerCase();
    } else if (this.condition === "DU") {
      return value;
    } else if (this.condition === "DUM") {
      return value;
    }
  }

  updateValue(e) {
    this.$emit("input", this.myPropertyValue(e));
  }

  get inputTyped() : string {
      return (<any>this).fieldType.concat((<any>this).fieldMask !== '' ? 'M' : '');
  }

  get condition() : string {
      return (<any>this).fieldType.concat((<any>this).fieldFormat).concat((<any>this).fieldMask !== '' ? 'M' : '');
  }
}
