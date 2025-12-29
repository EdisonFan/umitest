import React, { Suspense, lazy } from 'react';
import { RequestConfig } from 'umi';
import { fetchRouteConfig, RouteConfig } from './services/route';
import { routeManager } from './utils/routeManager';
import { history } from 'umi';
import PageLoading from '@/components/PageLoading';

// 修改路由
export function patchRoutes({ routes }: { routes: RouteConfig[] }) {
  // 从 routeManager 获取路由，如果没有则从 localStorage 恢复
  const dynamicRoutes = routeManager.getRoutes().length > 0 
    ? routeManager.getRoutes() 
    : JSON.parse(localStorage.getItem('routers') || '[]');

  // 如果从 localStorage 恢复了路由，更新 routeManager
  if (dynamicRoutes.length > 0 && routeManager.getRoutes().length === 0) {
    routeManager.setRoutes(dynamicRoutes);
  }

  if (dynamicRoutes.length > 0) {
    const rootRoute = routes.find(route => route.path === '/');
    if (rootRoute && rootRoute.routes) {
      rootRoute.routes = dynamicRoutes.map(route => ({
        ...route,
        component: lazy(() => import(`./pages/${route.component.split('/').pop()}`))
      }));
    }
    console.log(routes,'routes');
  }
}

// 动态添加路由
export function render(oldRender: () => void) {
  // 监听路由更新
  routeManager.onRoutesUpdate(() => {
    // 重新渲染应用
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

// 包装应用程序的根组件以支持 Suspense
// export function rootContainer(container: React.ReactNode) {
//   return (
//     <Suspense fallback={<PageLoading />}>
//       {container}
//     </Suspense>
//   );
// } 