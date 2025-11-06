import login from './views/login.js';
import dashboard from './views/dashboard.js';
import menu from './views/menu.js';
import bill from './views/bill.js';
import payment from './views/payment.js';
import join from './views/join.js';
import history from './views/history.js';
import notFound from './views/notFound.js';

const routes = {
  '#/login': login,
  '#/dashboard': dashboard,
  '#/menu/:restaurantId': menu,
  '#/bill/:code': bill,
  '#/join': join,
  '#/history': history,
  '#/payment/:code': payment,
};

function findRoute(hash) {
  for (const route in routes) {
    const routeRegex = new RegExp(`^${route.replace(/:\w+/g, '([^/]+)')}$`);
    const match = hash.match(routeRegex);
    if (match) {
      const params = match.slice(1);
      const paramNames = (route.match(/:\w+/g) || []).map(name => name.substring(1));
      const paramsObj = paramNames.reduce((obj, name, index) => {
        obj[name] = params[index];
        return obj;
      }, {});
      return { view: routes[route], params: paramsObj };
    }
  }
  return { view: notFound, params: {} };
}

function renderView(view, params) {
  const root = document.getElementById('root');
  root.innerHTML = '';
  const viewElement = view(params);
  if (viewElement) {
    root.appendChild(viewElement);
    lucide.createIcons();
  }
}

function router() {
  const hash = window.location.hash || '#/login';
  const { view, params } = findRoute(hash);
  renderView(view, params);
}

export function initializeRouter() {
  window.addEventListener('hashchange', router);
  router(); // Initial render
}
