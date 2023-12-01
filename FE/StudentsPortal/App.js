import {Provider} from 'react-redux';
import Root from './Components/Root';
import {store} from './Store/StoreInterface';

function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
export default App;
