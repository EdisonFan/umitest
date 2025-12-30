import { IRoute } from 'umi';

// 定义路由配置类型
export interface RouteConfig extends IRoute {
    routes?: RouteConfig[];
    meta?: {
        title?: string;           // 标签页标题
        icon?: React.ReactNode;    // 图标
        keepAlive?: boolean;       // 是否缓存
        fixed?: boolean;           // 是否固定
        closable?: boolean;        // 是否可关闭
        multiTab?: boolean;        // 是否支持多标签页
    };
}

// 模拟异步路由数据
export async function fetchRouteConfig(): Promise<RouteConfig[]> {
    console.log('fetchRouteConfig');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([

                {
                    path: '/',
                    name: '首页',
                    exact: true,
                    component: '@/pages/index',
                    meta: {
                        title: '首页',
                        keepAlive: true,
                        fixed: true,
                        closable: false,
                    }
                },
                {
                    path: '/list',
                    name: '列表',
                    exact: true,
                    component: '@/pages/list',
                    meta: {
                        title: '列表',
                        keepAlive: true,
                    }
                },
                {
                    path: '/about',
                    name: '关于',
                    exact: true,
                    component: '@/pages/about',
                    meta: {
                        title: '关于',
                        keepAlive: true,
                    }
                }, {
                    path: '/test',
                    name: '测试',
                    exact: true,
                    component: '@/pages/test',
                    meta: {
                        title: '测试',
                        keepAlive: true,
                    }
                },
                {
                    path: '/tab',
                    name: '标签页',
                    exact: true,
                    component: '@/pages/tab',
                    meta: {
                        title: '标签页',
                        keepAlive: true,
                        closable: false,
                        multiTab: true,
                    }
                },
            ]);
        }, 1000);
    });
} 