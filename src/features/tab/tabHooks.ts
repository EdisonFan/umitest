/**
 * 标签页业务 Hooks
 */
import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useHistory, useDispatch, useSelector } from 'umi';
import { createTabFromRoute, isTabExists, getFixedTabIds } from './tabUtils';
import { Tab } from './tabTypes';
import { routeManager } from '@/utils/routeManager';
import { useAliveController } from 'react-activation';
import { TabModelState } from '@/models/tab';
/**
 * 标签页管理器 - 自动根据路由创建/更新标签页
 */
export function useTabManager() {
  const location = useLocation();
  const dispatch = useDispatch();
  const tabs = useSelector((state: { tab: TabModelState }) => state.tab.tabs);
  const isInitRef = useRef(false);
  const { loadTabsFromCache } = useTabCache();

  // 初始化时恢复缓存的标签页
  useEffect(() => {
    if (!isInitRef.current && tabs.length === 0) {
      const cachedTabs = loadTabsFromCache();
      if (cachedTabs && cachedTabs.length > 0) {
        // 恢复标签页
        dispatch({ type: 'tab/setTabs', payload: cachedTabs });
        // 激活当前路由对应的标签页
        const { pathname, search } = location;
        const fullPath = pathname + search;
        const currentTab = cachedTabs.find(tab => tab.id === fullPath);
        if (currentTab) {
          dispatch({ type: 'tab/setActiveTab', payload: fullPath });
        }
      }
      isInitRef.current = true;
    }
  }, []);

  useEffect(() => {
    const { pathname, search } = location;
    const fullPath = pathname + search;

    // 跳过登录页
    if (pathname === '/login') {
      return;
    }

    // 如果还没初始化完成，不处理
    if (!isInitRef.current) {
      return;
    }

    // 获取路由信息（从路由配置中获取）
    const routes = routeManager.getRoutes();
    const route = routes.find(r => r.path === pathname);

    const routeTitle = getRouteTitle(pathname);
    const routeIcon = getRouteIcon(pathname);

    // 从路由配置中获取 meta 信息
    const keepAlive = route?.meta?.keepAlive ?? true;
    const fixed = route?.meta?.fixed ?? (pathname === '/');
    const closable = route?.meta?.closable ?? (pathname !== '/');

    // 检查标签页是否已存在
    if (!isTabExists(tabs, fullPath)) {
      // 创建新标签页
      const newTab = createTabFromRoute(
        pathname,
        fullPath,
        routeTitle,
        {
          icon: routeIcon,
          keepAlive,
          fixed,
          closable,
        }
      );
      dispatch({ type: 'tab/addTab', payload: newTab });
    } else {
      // 标签页已存在，只更新激活状态
      dispatch({ type: 'tab/setActiveTab', payload: fullPath });
    }
  }, [location.pathname, location.search, tabs, dispatch]);
}

/**
 * 标签页操作 Hook
 */
export function useTabActions() {
  const dispatch = useDispatch();
  const tabs = useSelector((state: { tab: TabModelState }) => state.tab.tabs);
  const activeTabId = useSelector((state: { tab: TabModelState }) => state.tab.activeTabId);
  const history = useHistory();
  const { drop } = useAliveController();

  const clearCache = useCallback((cacheKey: string) => {
    // 和 KeepAlive 的 name / cacheKey / id 保持一致，这里用 tab.id(fullPath)
    drop(cacheKey);
  }, [drop]);

  const switchToTab = useCallback((tab: Tab) => {
    history.push(tab.fullPath);
    dispatch({ type: 'tab/setActiveTab', payload: tab.id });
  }, [history, dispatch]);

  const closeTab = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    dispatch({ type: 'tab/removeTab', payload: tabId });
    // 如果关闭的是当前激活的标签页，会在 reducer 中自动切换
    // 清除 KeepAlive 缓存
    if (tab?.keepAlive && tab.id) {
      clearCache(tab.id);
    }
  }, [dispatch, tabs, clearCache]);

  const closeOtherTabs = useCallback((keepTabId: string) => {
    const fixedTabIds = getFixedTabIds(tabs);
    const keepIds = [...fixedTabIds, keepTabId];
    dispatch({ type: 'tab/clearTabs', payload: keepIds });
  }, [tabs, dispatch]);

  const closeLeftTabs = useCallback((tabId: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId);
    if (currentIndex <= 0) return;

    const fixedTabIds = getFixedTabIds(tabs);
    const keepTabIds = [
      ...fixedTabIds,
      ...tabs.slice(currentIndex).map(tab => tab.id),
    ];
    dispatch({ type: 'tab/clearTabs', payload: keepTabIds });
  }, [tabs, dispatch]);

  const closeRightTabs = useCallback((tabId: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId);
    if (currentIndex < 0 || currentIndex === tabs.length - 1) return;

    const fixedTabIds = getFixedTabIds(tabs);
    const keepTabIds = [
      ...fixedTabIds,
      ...tabs.slice(0, currentIndex + 1).map(tab => tab.id),
    ];
    dispatch({ type: 'tab/clearTabs', payload: keepTabIds });
  }, [tabs, dispatch]);

  const closeAllTabs = useCallback(() => {
    const fixedTabIds = getFixedTabIds(tabs);
    dispatch({ type: 'tab/clearTabs', payload: fixedTabIds });
  }, [tabs, dispatch]);

  const updateTab = useCallback((id: string, tab: Partial<Tab>) => {
    dispatch({ type: 'tab/updateTab', payload: { id, tab } });
  }, [dispatch]);

  return {
    tabs,
    activeTabId,
    switchToTab,
    closeTab,
    closeOtherTabs,
    closeLeftTabs,
    closeRightTabs,
    closeAllTabs,
    updateTab,
  };
}

/**
 * 标签页持久化 Hook
 */
export function useTabCache() {
  const tabs = useSelector((state: { tab: TabModelState }) => state.tab.tabs);

  const saveTabsToCache = useCallback(() => {
    try {
      localStorage.setItem('globalTabs', JSON.stringify(tabs));
    } catch (error) {
      console.error('Failed to save tabs to cache:', error);
    }
  }, [tabs]);

  const loadTabsFromCache = useCallback((): Tab[] | null => {
    try {
      const cached = localStorage.getItem('globalTabs');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Failed to load tabs from cache:', error);
    }
    return null;
  }, []);

  // 页面卸载时保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveTabsToCache();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveTabsToCache]);

  return {
    saveTabsToCache,
    loadTabsFromCache,
  };
}

/**
 * 辅助函数：根据路径获取标题
 */
function getRouteTitle(pathname: string): string {
  // 从路由管理器获取路由配置
  const routes = routeManager.getRoutes();
  const route = routes.find(r => r.path === pathname);
  
  if (route) {
    // 优先使用 meta.title，其次使用 name
    return route.meta?.title || route.name || pathname;
  }
  
  // 默认标题映射
  const routeMap: Record<string, string> = {
    '/': '首页',
    '/list': '列表',
    '/about': '关于',
    '/test': '测试',
  };
  return routeMap[pathname] || pathname;
}

/**
 * 辅助函数：根据路径获取图标
 */
function getRouteIcon(pathname: string): React.ReactNode {
  // 这里简化处理，实际应该从路由配置中获取
  return null;
}

