import Vue from 'vue';
import Component from 'vue-class-component';
import './loader.scss';

@Component({
  template: `<section class="loaders loaders-bg-1  "  ><span class="loader loader-double"> </span> Loading...</section>`
})
export class Loader extends Vue {
}

