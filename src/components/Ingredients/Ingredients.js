import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngList from './IngredientList';
function Ingredients() {

  const [stateIngredients, setIngredients] = useState([]);
  
  /* when compoenent mounts, we are fetching ingredients in Search component so there is no need for this.

  //execeute side ffects, has to have a function
  useEffect(()=>{//executed right AFTER component is rendered (EVERY render cycle)
    fetch("https://react-hooks-ea611.firebaseio.com/ingredients.json").then(response => response.json() )
      .then(responseData => {//rD is an object
        const loadedIngredients = [];
        for(const key in responseData){
          loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        })
    }
    setIngredients(loadedIngredients);
  }) // 434 !!!
  }, []); //with empty array it functions like componentDidMount, runs just once (after the first render). Without second argument, it acts like componentDidUpdate (after every component update (re-render) ) */
  
 /*  fetch("https://react-hooks-ea611.firebaseio.com/ingredients.json").then(response => response.json() ).then(responseData => {
    const loadedIngredients = [];
    for(const key in responseData){
      loadedIngredients.push({
        id: key,
        title: responseData[key].title,
        amount: responseData[key].amount
      })
    }
    //setIngredients(loadedIngredients); -> infinite loop, updating state re-renders Ingredients
  }) */
    
    useEffect(()=> { //runs after every re-render
      console.log('RENDERING INGREDIENTS', stateIngredients)
    }, [stateIngredients]) //effect only activates when values in the list (2nd argument) change

    const addIngredient = ingredient => {
    //fetch is browser function
    fetch("https://react-hooks-ea611.firebaseio.com/ingredients.json", {
      method: 'POST',
      body: JSON.stringify(ingredient), //converts js object or array into JSON
      headers: {'Content-Type': 'application/json'}
    }).then(response => { //response has automatic generated ID
        return response.json(); // converts JSON to normal JS code
        }).then( responseData => 
              {setIngredients(prevIngredients => 
              [...prevIngredients, //each ingredient is an object, they are inside of an array
              {id: responseData.name, ...ingredient}, //expect to receive ingredient as an object
              ] 
      );
    })
    

  };

  /* function removeIng(array,id){ //how I tried
    for(let i=0; i<array.length; i++){
      if(array[i].id === id)
        setIngredients(prevIngredients => [...prevIngredients].splice(i,1))
    }
  }; */
  const removeIng = ingID => {

    fetch(`https://react-hooks-ea611.firebaseio.com/ingredients/${ingID}.json`, {
      method: 'DELETE',
    }).then(response => {
      setIngredients(prevIngredients => prevIngredients.filter((ingredient) => ingredient.id !== ingID));
    })

  }
                      //437 2:30
  const filteredIngs = useCallback(filteredIngs => {
    setIngredients(filteredIngs);
  }, [/* same as putting setIngredients */])

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredient}/>

      <section>
        <Search onLoadIngs={filteredIngs} />
        <IngList ingredients={stateIngredients} onRemoveItem={removeIng}/>
      </section>
    </div>
  );
}

export default Ingredients;
