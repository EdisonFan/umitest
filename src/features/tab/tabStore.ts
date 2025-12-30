/**
 * 标签页状态管理（useReducer）
 */
import { useHistory } from 'umi';
import { TabState, TabAction } from './tabTypes';

export const initialState: TabState = {
  tabs: [],
  activeTabId: '',
};

export function tabReducer(state: TabState, action: TabAction): TabState {
  const history = useHistory();
  switch (action.type) {
    case 'ADD_TAB': {
      const { payload: newTab } = action;
      // 检查标签页是否已存在
      const exists = state.tabs.some(tab => tab.id === newTab.id);
      if (exists) {
        // 如果存在，更新并激活
        return {
          ...state,
          tabs: state.tabs.map(tab =>
            tab.id === newTab.id ? { ...tab, ...newTab } : tab
          ),
          activeTabId: newTab.id,
        };
      }
      // 如果不存在，添加新标签页
      return {
        ...state,
        tabs: [...state.tabs, newTab],
        activeTabId: newTab.id,
      };
    }

    case 'REMOVE_TAB': {
      const { payload: tabId } = action;
      const newTabs = state.tabs.filter(tab => tab.id !== tabId);
      let newActiveTabId = state.activeTabId;

      // 如果删除的是当前激活的标签页，切换到相邻标签页
      if (state.activeTabId === tabId) {
        const currentIndex = state.tabs.findIndex(tab => tab.id === tabId);
        // 确保找到了要删除的标签
        if (currentIndex !== -1) {
          // 优先选择下一个标签，否则选择上一个，最后选择剩余标签中的最后一个
          const nextTab = state.tabs[currentIndex + 1] || state.tabs[currentIndex - 1];
          newActiveTabId = nextTab?.id || (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '');
        } else {
          // 理论上不应该发生，但作为安全措施
          newActiveTabId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '';
        }
      }
      console.log('最新状态', {
        ...state,
        tabs: newTabs,
        activeTabId: newActiveTabId,
      });

      return {
        ...state,
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    }

    case 'SET_ACTIVE_TAB': {
      return {
        ...state,
        activeTabId: action.payload,
      };
    }

    case 'UPDATE_TAB': {
      const { id, tab } = action.payload;
      return {
        ...state,
        tabs: state.tabs.map(t => (t.id === id ? { ...t, ...tab } : t)),
      };
    }

    case 'SET_TABS': {
      return {
        ...state,
        tabs: action.payload,
      };
    }

    case 'CLEAR_TABS': {
      const { payload: keepIds = [] } = action;
      const fixedTabs = state.tabs.filter(tab => tab.fixed);
      const keepTabIds = [...fixedTabs.map(tab => tab.id), ...keepIds];
      const newTabs = state.tabs.filter(tab => keepTabIds.includes(tab.id));
      const newActiveTabId = keepTabIds.includes(state.activeTabId)
        ? state.activeTabId
        : (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : '');

      return {
        ...state,
        tabs: newTabs,
        activeTabId: newActiveTabId,
      };
    }

    default:
      return state;
  }
}

