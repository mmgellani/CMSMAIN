import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState, mapActions } from 'vuex';

import { AreaFooter } from './footer/footer';
import { TokenExpiry } from '../../components';

import { AreaSidebar } from './navigation/sidebar';
import { AreaHeader } from './header';
import { State, Action } from 'vuex-class';

import { RootStoreTypes, IRootStoreState } from '../store';

const namespace: string = 'sing';

@Component({
  components: { AreaSidebar, TokenExpiry, AreaHeader, AreaFooter },
  template: require('./layout.html')
})
export class AreaLayout extends Vue {

  @State((state: IRootStoreState) => state.sidebarStatic) sidebarStatic: boolean;
  @State((state: IRootStoreState) => state.sidebarClose) sidebarClose: boolean;
  @State((state: IRootStoreState) => state.chatOpen) chatOpen: boolean;

  handleSwipe(e) {
    this.$store.dispatch(RootStoreTypes.handleSwipe, e);
  }

  created() {
    document.body.className = 'chat-sidebar-container ';
    this.$store.dispatch(RootStoreTypes.switchSidebar, this.sidebarStatic);

    const staticSidebar = JSON.parse(localStorage.getItem('sidebarStatic'));

    if (staticSidebar) {
      this.$store.state.sidebarStatic = true;
    } else if (!this.sidebarClose) {
      setTimeout(() => {
        this.$store.dispatch(RootStoreTypes.switchSidebar, true);
        this.$store.dispatch(RootStoreTypes.changeSidebarActive, null);
      }, 2500);
    }
  }

}