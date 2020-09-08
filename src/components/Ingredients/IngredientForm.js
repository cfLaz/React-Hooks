import React, {useState} from 'react'; //useState controls state in functional components

import Card from '../UI/Card';
import './IngredientForm.css';
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo(props => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  console.log('rendering ingredient form');

  const submitHandler = event => {
    
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
                const newAmount = event.target.value; //bcz react event is not same as DOM event 428
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
