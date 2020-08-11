//Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language. 
import React, {useState} from 'react';

//should start with capital letter
export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {},
});

const AuthContextProvider = props => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  return(
    <AuthContext.Provider value={{login: loginHandler, isAuth: isAuthenticated}}>
      {props.chidren}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;