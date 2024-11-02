import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from 'App';
import { setupStore } from 'store';

const store = setupStore();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);