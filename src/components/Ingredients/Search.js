import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search = React.memo(props => {

  const {onLoadIngs} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const {isLoading, data, error, sendRequest, clear} = useHttp();

  useEffect(()=> {
    
    const timer  = setTimeout( ()=> {
      if(enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 
      ? '' 
      : `?orderBy="title"&equalTo="${enteredFilter}"`; //syntax understood by firebase

        sendRequest(
          "https://react-hooks-ea611.firebaseio.com/ingredients.json"+ query,
          'GET',
        )
      }
    }, 1000);
    //439 1:00 return(not mandatory) needs to be a function (this is a cleanup function), "runs before useEffect runs for the next time"
    return () => {// more memory efficient, clears out old timers.has to return a function
      clearTimeout(timer);
    }
  }, [enteredFilter, sendRequest, inputRef]) //436 4min

  useEffect( () => {
    if(!isLoading && data && !error){
      const loadedIngredients = [];
      for(const key in data){
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
      })
    }
    onLoadIngs(loadedIngredients);
  }
  }, [data, isLoading, error, onLoadIngs]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
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
