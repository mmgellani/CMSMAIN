import { Store, MutationTree } from 'vuex';
import { IRootStoreState } from './state';
import isScreen from './sing/screenHelper';

export const Mutations: MutationTree<IRootStoreState> = {

    apiCallContent: (state: IRootStoreState, content: string) => {

        state.apiCallContent = content;
    },

    toggleChat: (state: IRootStoreState) => {

        state.chatOpen = !state.chatOpen;

        if (state.chatOpen) {
            document.body.className = document.body.className.replace('chat-sidebar-opened', '');
        } else {
            document.body.className = document.body.className + ' chat-sidebar-opened';
        }
    },

    toggleSidebar(state: IRootStoreState) {
        const nextState = !state.sidebarStatic;

        localStorage.sidebarStatic = nextState;
        state.sidebarStatic = nextState;

        if (!nextState && (isScreen('lg') || isScreen('xl'))) {
            state.sidebarClose = true;
        }

        if (state.sidebarStatic) {
            document.body.className = document.body.className + ' nav-static';
        } else {
            document.body.className = document.body.className.replace('nav-static', '');
        }
    },

    switchSidebar(state: IRootStoreState, value) {
        if (value) {
            state.sidebarClose = value;
        } else {
            state.sidebarClose = !state.sidebarClose;
        }

        if(!state.sidebarClose) {
            document.body.className = document.body.className.replace('nav-collapsed', '');
        } else {
            document.body.className = document.body.className + ' nav-collapsed';
        }
    },

    setSidebarState(state: IRootStoreState, value) {
        state.sidebarClose = value;
    },

    handleSwipe(state: IRootStoreState, e) {
        if (e.direction === 4 && !state.chatOpen) {
            state.sidebarClose = false;
        }

        if (e.direction === 2 && !state.sidebarClose) {
            state.sidebarClose = true;
            return;
        }

        state.chatOpen = e.direction === 2;
    },

    changeSidebarActive(state: IRootStoreState, index) {
        state.sidebarActiveElement = index;
    },

    changeFeeStudentInfo(state: IRootStoreState, value) {
        state.feeStudentInfo = value;
    },

    reportOperation(state: IRootStoreState, value) {
        state.reportOperation = value;
    }
};