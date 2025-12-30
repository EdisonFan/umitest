/**
 * 标签页 Context 定义
 */
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { TabState, TabAction, Tab } from './tabTypes';
import { tabReducer, initialState } from './tabStore';
import { useHistory } from 'umi';

interface TabContextValue {
  state: TabState;
  dispatch: React.Dispatch<TabAction>;
  // 便捷方法
  addTab: (tab: Tab) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTab: (id: string, tab: Partial<Tab>) => void;
  clearTabs: (keepIds?: string[]) => void;
  setTabs: (tabs: Tab[]) => void;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tabReducer, initialState);
  const history = useHistory();

  const addTab = useCallback((tab: Tab) => {
    dispatch({ type: 'ADD_TAB', payload: tab });
  }, []);

  const removeTab = useCallback((tabId: string) => {
    const tabToRemove = state.tabs.find(tab => tab.id === tabId);
    dispatch({ type: 'REMOVE_TAB', payload: tabId });
    
    // 在 dispatch 后处理路由跳转
    if (state.activeTabId === tabId) {
      const currentIndex = state.tabs.findIndex(tab => tab.id === tabId);
      if (currentIndex !== -1) {
        const nextTab = state.tabs[currentIndex + 1] || state.tabs[currentIndex - 1];
        const newActiveTabId = nextTab?.id || (state.tabs.length > 0 ? state.tabs[state.tabs.length - 1].id : '');
        if (newActiveTabId) {
          const newActiveTab = state.tabs.find(tab => tab.id === newActiveTabId);
          if (newActiveTab) {
            history.push(newActiveTab.fullPath);
          }
        }
      }
    }
  }, [state, history]);

  const setActiveTab = useCallback((tabId: string) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
  }, []);

  const updateTab = useCallback((id: string, tab: Partial<Tab>) => {
    dispatch({ type: 'UPDATE_TAB', payload: { id, tab } });
  }, []);

  const clearTabs = useCallback((keepIds?: string[]) => {
    dispatch({ type: 'CLEAR_TABS', payload: keepIds });
  }, []);

  const setTabs = useCallback((tabs: Tab[]) => {
    dispatch({ type: 'SET_TABS', payload: tabs });
  }, []);

  const value: TabContextValue = {
    state,
    dispatch,
    addTab,
    removeTab,
    setActiveTab,
    updateTab,
    clearTabs,
    setTabs,
  };

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export function useTabContext() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within TabProvider');
  }
  return context;
}

