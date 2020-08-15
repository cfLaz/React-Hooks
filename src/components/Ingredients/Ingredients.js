import React, {useReducer,useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

                //state (stateIngredients) , action
const ingsReducer = (currentIngs, action) => {
// all updates in one place, 
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngs, action.ingredient];
    case 'DELETE':
      return currentIngs.filter(ing => ing.id!== action.id)
      default:
        throw new Error ('should not get here!')
  }
}
//can out reducer inside of the function if you want to (perhaps to use props)
const httpReducer = (currentHttp, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      return {...currentHttp, loading: false}; //arguments after ... are overriding
    case 'ERROR':
      return {loading: false, error: action.errorMessage};
    case 'CLEAR':
      return {...currentHttp, error: null};  
    default:
      throw new Error ('Should not be reached');
    
  }
}

function Ingredients() {
  
  const [stateIngredients, dispatch] = useReducer(ingsReducer, []);
  //const [stateIngredients, setIngredients] = useState([]);
  const [httpState, httpDispatch] = useReducer(httpReducer, {loading: false, error: null});
  //const [isLoading, setLoading] = useState(false);
  //const [error, setError] = useState();
 
  useEffect(()=> { //runs after every re-render
      console.log('RENDERING INGREDIENTS', stateIngredients)
    }, [stateIngredients]) //effect only activates when values in the list (2nd argument) change
                      //446 3:00
  const addIngredient = useCallback(ingredient => {
      httpDispatch({type: 'SEND'})
    //fetch is browser function
    fetch("https://react-hooks-ea611.firebaseio.com/ingredients.json", {
      method: 'POST',
      body: JSON.stringify(ingredient), //converts js object or array into JSON
      headers: {'Content-Type': 'application/json'}
      }).then(response => { //response has automatic generated ID
        httpDispatch({type: 'RESPONSE'});
        return response.json(); // converts JSON to normal JS code
        
        }).then( responseData => {
            dispatch({
             type: 'ADD',
             ingredient: {id: responseData.name, ...ingredient}
          })
      })
    },[]);

  /* function removeIng(array,id){ //how I tried
    for(let i=0; i<array.length; i++){
      if(array[i].id === id)
        setIngredients(prevIngredients => [...prevIngredients].splice(i,1))
    }
  }; */
  const removeIng = useCallback(ingID => {
    
    httpDispatch({type: 'SEND'}); //doesn't need to be specified in second argument of useCallback function
    fetch(`https://react-hooks-ea611.firebaseio.com/ingredients/${ingID}.json`, {
      method: 'DELETE',
    }).then(response => {
      httpDispatch({type: 'RESPONSE'});

      dispatch ({type: 'DELETE', id: ingID})

    }).catch(error => {
     // setError(error.message);// every error has a message property
        httpDispatch({type: 'ERROR', errorMessage: 'Something went wrong'});
    })
  }, [])

                      //437 2:30
  const filteredIngs = useCallback(filteredIngs => {
    //setIngredients(filteredIngs);
    dispatch({type: 'SET', ingredients: filteredIngs});
  }, [/* same as putting setIngredients here */])

  const clearError =useCallback(() => httpDispatch({type: 'CLEAR'}), []);/*remember, couldn't use setError() directly */

  const ingList = useMemo(()=>{
    return(<IngList ingredients={stateIngredients} onRemoveItem={removeIng}/>)
  }, [stateIngredients, removeIng]);//removeIng shouldn't change because it's in useCallback
  
  return (
    <div className="App">
      {httpState.error && 
      (<ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>)}

      <IngredientForm 
        onAddIngredient={addIngredient}
        loading={httpState.loading}

      />

      <section>
        <Search onLoadIngs={filteredIngs} />
        {ingList}
      </section>
    </div>
  );
}

export default Ingredients;
