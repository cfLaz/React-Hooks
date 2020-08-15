import React, {useState} from 'react'; //useState controls state in functional components

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => { //if props are the same don't rerender the component
  //can be anything, not just an object like in class based state.
  /*const [inputState, setInputState] = useState({title: '', amount: ''}); //always returns array with two elements, first element is current state snapshot, second is a function that alows us to update the current state, 
  array destructuring for smoother code (429), use objects and arrays if you really have data that changes together or when you need to change multiple things together*/
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    /*can't use React Hooks inside other functions (has to be in root of functional component, not function that's inside of FC) e.g useState(),
     or hooks e.g. if(true){useState() } */
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>

          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" 
              /* value={inputState.title}      //to be sure that we are using latest state ->prevInputState (can name it whatever)
              onChange={event => {
                const newTitle = event.target.value;
                setInputState( (prevInputState)=> (
                {title: newTitle, amount: prevInputState.amount} 
                )) 428
                } */
                value={enteredTitle}      
                onChange={event => {
                  setEnteredTitle(event.target.value);
                  }
                }

            />
          </div>

          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" 
              /* value={inputState.amount}
              onChange={event => {
                const newAmount = event.target.value; //bcz react event is not same as DOM event
                setInputState( (prevInputState)=>(
                {amount: newAmount, title: prevInputState.title}))
                }
              } */
              value={enteredAmount}
              onChange={event => setEnteredAmount(event.target.value)}
            />
          </div>

          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/>}
          </div>

        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
