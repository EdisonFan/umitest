import { IRoute } from 'umi';

// 定义路由配置类型
export interface RouteConfig extends IRoute {
    routes?: RouteConfig[];
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
                    component: '@/pages/index'
                },
                {
                    path: '/list',
                    name: '列表',
                    exact: true,
                    component: '@/pages/list'
                },
                {
                    path: '/about',
                    name: '关于',
                    exact: true,
                    component: '@/pages/about'
                }, {
                    path: '/test',
                    name: '测试',
                    exact: true,
                    component: '@/pages/test'
                },
            ]);
        }, 1000);
    });
} 