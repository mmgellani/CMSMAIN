import { Store as VuexStore } from 'vuex';
import { IRootStoreState } from './state';

export { IRootStoreState } from './state';
export { RootStoreTypes } from './types';
export type RootStore = VuexStore<IRootStoreState>;
