import { defineConfig } from 'umi';
import { localRoutes } from './routes';
import  proxy  from  './proxy'
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  layout: false,
  hash: true,
  history: {
    type: 'hash',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  routes: localRoutes,
  // fastRefresh: {},
  dynamicImport: {
    loading: '@/components/PageLoading',
  },
  dva: {
    immer: true,
    hmr: true,
  },
  mfsu: {}
}); 