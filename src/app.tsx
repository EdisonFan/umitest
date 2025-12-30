import React, { Suspense, lazy } from 'react';
import { RequestConfig } from 'umi';
import { fetchRouteConfig, RouteConfig } from './services/route';
import { routeManager } from './utils/routeManager';
import { history } from 'umi';
import PageLoading from '@/components/PageLoading';

// 从本地缓存恢复动态路由，仅在应用启动阶段使用
function initRoutesFromStorageOnce() {
  if (routeManager.getRoutes().length > 0) return;
  try {
    const stored = localStorage.getItem('routers');
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      routeManager.setRoutes(parsed as RouteConfig[]);
    }
  } catch (error) {
    // 解析失败时忽略本地缓存，避免影响应用启动
    // console.error('Failed to restore routes from localStorage', error);
  }
}

// 修改路由
export function patchRoutes({ routes }: { routes: RouteConfig[] }) {
  // 此时只从 routeManager 获取动态路由，具体数据来源（接口 / localStorage）
  // 在应用初始化阶段统一处理
  const dynamicRoutes = routeManager.getRoutes();

  if (dynamicRoutes.length > 0) {
    const rootRoute = routes.find((route) => route.path === '/');
    if (rootRoute && rootRoute.routes) {
      rootRoute.routes = dynamicRoutes.map((route) => ({
        ...route,
        component: lazy(
          () => import(`./pages/${route.component.split('/').pop()}`),
        ),
      }));
    }
    console.log(routes, 'routes');
  }
}

// 动态添加路由
export function render(oldRender: () => void) {
  // 应用启动时先尝试从本地缓存恢复动态路由
  initRoutesFromStorageOnce();

  // 监听路由更新，路由变化时重新渲染应用
  routeManager.onRoutesUpdate(() => {
    oldRender();
  });
  oldRender();
}

// 路由变化监听
export function onRouteChange({ location, routes, action }: any) {
  const { pathname } = location;
  if (!routeManager.hasPermission(pathname)) {
    history.push('/403');
    return;
  }
}

// 请求配置
export const request: RequestConfig = {
  timeout: 1,
};

// 包装应用程序的根组件以支持 Suspense 和 react-activation
import { AliveScope } from 'react-activation';

export function rootContainer(container: React.ReactNode) {
  return (
    <AliveScope>
      <Suspense fallback={<PageLoading />}>
        {container}
      </Suspense>
    </AliveScope>
  );
} 