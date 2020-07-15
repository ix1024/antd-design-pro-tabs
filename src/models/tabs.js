
import config from '../../config/config';
import menu from '../locales/zh-CN/menu';
import { store } from '@/utils/utils';

const { get } = store;
const GlobalModel = {
  namespace: 'tabs',
  state: {
    collapsed: false,
    notices: [],
    pathname: '/',
    pageName: '新页面',
    paths: [],
    pages: [],
  },
  effects: {

  },
  reducers: {
    // 设置当前Path
    setCurrentPath(state, { payload }) {
      const { pathname, pageName } = payload;
      const { paths } = state;
      if (!paths.some(path => path === pathname)) {
        paths.push(pathname);
      }
      return { ...state, pathname, pageName, paths };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      const getName = (routes = [], parentName, pathname) => {
        const list = [];
        routes.forEach(item => {
          // eslint-disable-next-line no-shadow
          const { routes, name } = item;
          const pName = parentName && name ? `${parentName}.${name}` : parentName || name;

          if (routes && routes.length) {
            list.push(...getName(routes, pName, pathname));
          } else if (pName && name) {
            if (item.path === pathname) {
              list.push(pName);
            }
          }
        });
        return list;
      };
      // 监听路由变化
      return history.listen(({ pathname }) => {
        let id;
        if (pathname === '/') {
          return;
        }
        try {
          id = pathname.split('/').slice(-1)[0];
        } catch (error) { }
        const { title } = get(id, 'sessionstorage') || {};
        let name = '';
        name = pathname.substr(pathname.lastIndexOf('/') + 1);

        const pageName =
          menu[getName(config.routes, 'menu', pathname)[0]] || title || name || '新标签页';

        setTimeout(() => {
          dispatch({ type: 'setCurrentPath', payload: { pathname, pageName: title || pageName } });
          // dispatch({ type: 'addPath', payload: { pathname, pageName } });
        }, 0);
      });
    },
  },
};
export default GlobalModel;
