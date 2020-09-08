import React, {useReducer,useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http'; //has to begin with "use" here as well
                
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
//can put reducer inside of the function if you want to (perhaps to use props)

function Ingredients() {

  const [stateIngredients, dispatch] = useReducer(ingsReducer, []);
  //const [isLoading, setLoading] = useState(false);
  //const [error, setError] = useState();
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear}= useHttp(); //doesn't send the request, just sets up the state and the function inside it... will re-run with every render

  //handling requests like this fully embraces concept of React Hooks
  useEffect(()=> { //runs after every re-render
    //is Loading - to make sure WE ARE DONE with Loading and can move on, not before that, same for error.
    if (!isLoading && !error && reqIdentifier === 'REMOVE_ING'){
      dispatch({type: 'DELETE', id: reqExtra}) 
    }
    else if (!isLoading && !error && reqIdentifier === 'ADD_ING') {
      dispatch({ 
        type: 'ADD',     
        ingredient: {id: data.name, ...reqExtra}
      })
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]) //effect only activates when values in the list (2nd argument) change
                      //446 3:00
  const addIngredient = useCallback(ingredient => {

    sendRequest(
      'https://react-hooks-ea611.firebaseio.com/ingredients/.json', 
      'POST', 
      JSON.stringify(ingredient), 
      ingredient,
      'ADD_ING')
      
    },[sendRequest]); 


  const removeIng = useCallback(ingID => {
    //Ingredient component is rebuilt when sendRequest is done
    sendRequest(`https://react-hooks-ea611.firebaseio.com/ingredients/${ingID}.json`, 
      'DELETE',
      null,
      ingID,
      'REMOVE_ING'
    );
  }, [sendRequest])

                      //437 2:30
  const filteredIngs = useCallback(filteredIngs => {
    //setIngredients(filteredIngs);
    dispatch({type: 'SET', ingredients: filteredIngs});
  }, [/* same as putting setIngredients here */])

  const ingList = useMemo(()=>{ //the returned value is saved (so it's not changed in future if it's the same)... not feasible in small apps
    return(
      <IngList 
        ingredients={stateIngredients} 
        onRemoveItem={removeIng} 
      />)
  }, [stateIngredients, removeIng]);//removeIng shouldn't change because it's in useCallback
  
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}> {error} </ErrorModal>}

      <IngredientForm 
        onAddIngredient={addIngredient}
        loading={isLoading}

      />

      <section>
        <Search onLoadIngs={filteredIngs} />
        {ingList}
      </section>
    </div>
  );
}

export default Ingredients;
