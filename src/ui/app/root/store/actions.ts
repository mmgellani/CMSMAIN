import { Store, ActionContext, ActionTree } from 'vuex';
import { IRootStoreState } from './state';
import { RootStoreTypes } from './types';
import { Inject } from 'vue-property-decorator';

export const Actions: ActionTree<IRootStoreState,{}> = {

    apiCallContent: (injectee: ActionContext<IRootStoreState, any>, content: string ) => {
        injectee.commit(RootStoreTypes.apiCallContent, content);
    },

    toggleChat: (injectee: ActionContext<IRootStoreState, any>) => {
        injectee.commit(RootStoreTypes.toggleChat);
    },

    toggleSidebar: (injectee: ActionContext<IRootStoreState, any>) => {
        injectee.commit(RootStoreTypes.toggleSidebar);
    },

    switchSidebar: (injectee: ActionContext<IRootStoreState, any>, value: boolean) => {
        injectee.commit(RootStoreTypes.switchSidebar, value);
    },

    setSidebarState: (injectee: ActionContext<IRootStoreState, any>, value: boolean) => {
        injectee.commit(RootStoreTypes.setSidebarState, value);
    },

    handleSwipe: (injectee: ActionContext<IRootStoreState, any>, e: any) => {
        injectee.commit(RootStoreTypes.handleSwipe, e);
    },

    changeSidebarActive: (injectee: ActionContext<IRootStoreState, any>, index: number) => {
        injectee.commit(RootStoreTypes.changeSidebarActive, index);
    },

    changeFeeStudentInfo: (injectee: ActionContext<IRootStoreState, any>, value: any) => {
        injectee.commit(RootStoreTypes.changeFeeStudentInfo, value);
    },
    reportOperation: (Injectee: ActionContext<IRootStoreState, any>, value: any) =>{

        Injectee.commit(RootStoreTypes.reportOperation, value);

    }
};