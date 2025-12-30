import type { RouteConfig } from '@/services/route';

type RouteUpdateCallback = (routes: RouteConfig[]) => void;

class RouteManager {
  private routes: RouteConfig[] = [];
  private routeUpdateCallbacks: RouteUpdateCallback[] = [];

  /**
   * 设置当前动态路由（内存）
   */
  setRoutes(routes: RouteConfig[]) {
    this.routes = routes;
    // 触发路由更新回调
    this.routeUpdateCallbacks.forEach((callback) => callback(this.routes));
  }

  /**
   * 获取当前动态路由（内存）
   */
  getRoutes(): RouteConfig[] {
    return this.routes;
  }

  /**
   * 添加路由更新监听，返回解绑函数
   */
  onRoutesUpdate(callback: RouteUpdateCallback) {
    this.routeUpdateCallbacks.push(callback);
    return () => this.offRoutesUpdate(callback);
  }

  // 移除路由更新监听
  offRoutesUpdate(callback: RouteUpdateCallback) {
    this.routeUpdateCallbacks = this.routeUpdateCallbacks.filter(
      (cb) => cb !== callback,
    );
  }

  // 检查路由权限（后续可以根据 RouteConfig.meta 等实现真正的权限控制）
  hasPermission(_path: string) {
    return true;
  }
}

export const routeManager = new RouteManager(); 