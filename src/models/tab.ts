import { Tab } from '@/features/tab/tabTypes';
import { Effect, Reducer } from 'umi';

export interface TabModelState {
  tabs: Tab[];
  activeTabId: string;
}

export interface TabModelType {
  namespace: 'tab';
  state: TabModelState;
  effects: {};
  reducers: {
    addTab: Reducer<TabModelState>;
    removeTab: Reducer<TabModelState>;
    setActiveTab: Reducer<TabModelState>;
    updateTab: Reducer<TabModelState>;
    setTabs: Reducer<TabModelState>;
    clearTabs: Reducer<TabModelState>;
  };
}

const TabModel: TabModelType = {
  namespace: 'tab',

  state: {
    tabs: [],
    activeTabId: '',
  },

  effects: {},

  reducers: {
    addTab(state, { payload: newTab }) {
      const exists = state!.tabs.some(tab => tab.id === newTab.id);
      if (exists) {
        return {
          ...state!,
          tabs: state!.tabs.map(tab =>
            tab.id === newTab.id ? { ...tab, ...newTab } : tab
          ),
          activeTabId: newTab.id,
        };
      }
      return {
        ...state!,
        tabs: [...state!.tabs, newTab],
        activeTabId: newTab.id,
      };
    },

    removeTab(state, { payload: tabId }) {
      const newTabs = state!.tabs.filter(tab => tab.id !== tabId);
      let newActiveTabId = state!.activeTabId;

      if (state!.activeTabId === tabId) {
        const currentIndex = state!.tabs.findIndex(tab => tab.id === tabId);
        if (currentIndex !== -1) {
          const nextTab = state!.tabs[currentIndex + 1] || state!.tabs[currentIndex - 1];
          newActiveTabId = nextTab?.id || (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '');
        } else {
          newActiveTabId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '';
        }
      }

      return {
        ...state!,
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    },

    setActiveTab(state, { payload: tabId }) {
      return {
        ...state!,
        activeTabId: tabId,
      };
    },

    updateTab(state, { payload }) {
      const { id, tab } = payload;
      return {
        ...state!,
        tabs: state!.tabs.map(t => (t.id === id ? { ...t, ...tab } : t)),
      };
    },

    setTabs(state, { payload: tabs }) {
      return {
        ...state!,
        tabs,
      };
    },

    clearTabs(state, { payload: keepIds = [] }) {
      const fixedTabs = state!.tabs.filter(tab => tab.fixed);
      const keepTabIds = [...fixedTabs.map(tab => tab.id), ...keepIds];
      const newTabs = state!.tabs.filter(tab => keepTabIds.includes(tab.id));
      const newActiveTabId = keepTabIds.includes(state!.activeTabId)
        ? state!.activeTabId
        : (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '');

      return {
        ...state!,
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    },
  },
};

export default TabModel;
