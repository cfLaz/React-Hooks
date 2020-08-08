import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const {onLoadIngs} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(()=> {
    
    const timer  = setTimeout( ()=> {
      if(enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 
      ? '' 
      : `?orderBy="title"&equalTo="${enteredFilter}"`; //syntax understood by firebase

      fetch("https://react-hooks-ea611.firebaseio.com/ingredients.json"+ query).then(response => response.json() )
      .then(responseData => {

          const loadedIngredients = [];
          for(const key in responseData){

            loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          })
      }
        onLoadIngs(loadedIngredients);
      })
    }
      
    }, 1000);
    //439 1:00 return(not mandatory) needs to be a function (this is a cleanup function), "runs before useEffect runs for the next time"
    return () => {// more memory efficient, clears out old timers.
      clearTimeout(timer);
    }
  }, [enteredFilter, onLoadIngs, inputRef]) //436 4min

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
          ref={inputRef}
          type="text" 
          value = {enteredFilter}
          onChange ={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
