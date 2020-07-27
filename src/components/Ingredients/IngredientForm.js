import React, {useState} from 'react'; //useState controls state in functional components

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  //can be anything, not just an object like in c;ass based state.
  const inputState = useState({title: '', amount: ''}); //always returns array with two elements, first element is current state snapshot, second is a function that alows us to update the current state


  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>

          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" 
              value={inputState[0].title}      //to be sure that we are using latest state ->prevInputState (can name it whatever)
              onChange={event => {
                const newTitle = event.target.value;
                inputState[1]( (prevInputState)=> (
                {title: newTitle, amount: previnputState[0].amount} 
                )) /*428*/
                }
              }

            />
          </div>

          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" 
              value={inputState[0].amount}
              onChange={event => {
                const newAmount = event.target.value; //bcz react event is not same as DOM event
                inputState[1]( (pInState)=>(
                {amount: newAmount, title: pInState[0].title}))
                }
              }
            />
          </div>

          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>

        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
