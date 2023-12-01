import {useSelector} from 'react-redux';
import Login from '../Pages/Login';
import Signup from '../Pages/Signup';
import Home from '../Pages/Home';
import Dashboard from '../Pages/Dashboard';
import ChatPeople from '../Pages/ChatPeople';
import ChatRoom from '../Pages/ChatRoom';
function useNavigator() {
  const path = useSelector(state => {
    return state.config.path;
  });

  const isLoggedIn = useSelector(state => {
    return state.config.isLoggedIn;
  });
  switch (path) {
    case '/login':
      return <Login />;
    case '/signup':
      return <Signup />;
    case '/home':
      if (isLoggedIn) return <Home />;
      else return <Dashboard />;
    case '/dashboard':
      return <Dashboard />;
    case '/chat':
      if (isLoggedIn) return <ChatPeople />;
      else return <Dashboard />;
    case '/chatRoom':
      if (isLoggedIn) return <ChatRoom />;
      else return <Dashboard />;
  }
}
export default useNavigator;
