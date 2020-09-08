//we can build normal function which contains all that send- request functions, but within that normal function we could not dispatch events which change the state in a component that calls the function, that's why we use hooks.
import {useReducer, useCallback} from 'react';

const initialState = 
{ 
  loading: false, 
  error: null,
  extra: null,
  data: null,
  identifier: null,
};
const httpReducer = (currentHttp, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true, 
        error: null,
        data: null, 
        extra: null, 
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...currentHttp, 
        loading: false, 
        data: action.responseData,
        extra: action.extra
      }; //arguments after ... are overriding
    case 'ERROR':
      return {
        ...currentHttp,
        loading: false, 
        error: action.errorMessage
      };
    case 'CLEAR':
      return initialState;  
    default:
      throw new Error ('Should not be reached');
    
  }
}
//has to be useSomething... when used inside of another compoenent, it's not just using the passed data, it's being used as if it was written inside that compoenent. e.g. can use statefull logic but it would be different for each component
const useHttp = () => {// will re-run with every re-render cycle
  //can use any hook here, each component will use it differently
  const [httpState, httpDispatch] = useReducer(httpReducer, initialState);
                      //had an infinite loop without ()=>
  const clear = useCallback( () => httpDispatch( {type: 'CLEAR'} ), [] );

  const sendRequest = useCallback( (url, method, body, reqExtra, reqIdentifier) => {

    //don't forget that component in which this is used is re-rendered after every httpDispatch
    httpDispatch({type: 'SEND', identifier: reqIdentifier}); //doesn't need to be specified in second argument of useCallback function
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'appliacation/json'
      }
    }).then(response => {
        return response.json();
      }).then(responseData=> { 
          httpDispatch(
            {type: 'RESPONSE', 
            responseData: responseData,
            extra: reqExtra
          });
        }).catch(error => {
            // setError(error.message);// every error has a message property
            httpDispatch({
              type: 'ERROR', 
              errorMessage: 'Something   went wrong', 
              extra:reqExtra});
          })
    }, [] );
    //can return any type
    return {
      isLoading: httpState.loading,
      data: httpState.data,
      error: httpState.error,
      sendRequest: sendRequest,
      reqExtra: httpState.extra,
      reqIdentifier: httpState.identifier,
      clear: clear
    };
};

export default useHttp;