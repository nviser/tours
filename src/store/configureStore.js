import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import combinedReducers from '../reducers';

export default function configureStore() {
  const create = () => {
    return createStore(
      combinedReducers,
      composeWithDevTools(
        applyMiddleware(
          thunk
          // logger
        )
      )
    );
  };

  const store = create();

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(combinedReducers);
    });
  }

  return store;
}
