import { history } from 'umi';

type RouteUpdateCallback = () => void;

class RouteManager {
  private routes: any[] = [];
  private routeUpdateCallbacks: RouteUpdateCallback[] = [];

  setRoutes(routes: any[]) {
    this.routes = routes;
    // 触发路由更新回调
    this.routeUpdateCallbacks.forEach(callback => callback());
  }

  getRoutes() {
    return this.routes;
  }

  // 添加路由更新监听
  onRoutesUpdate(callback: RouteUpdateCallback) {
    this.routeUpdateCallbacks.push(callback);
  }

  // 移除路由更新监听
  offRoutesUpdate(callback: RouteUpdateCallback) {
    this.routeUpdateCallbacks = this.routeUpdateCallbacks.filter(cb => cb !== callback);
  }

  // 检查路由权限
  hasPermission(path: string) {
    return true;
  }
}

export const routeManager = new RouteManager(); 