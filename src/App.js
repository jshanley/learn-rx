import React, { useState, useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';


function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const input$ = fromEvent(document.body, 'keypress');
    input$.pipe(map(evt => evt.key));
    const subscription = input$.subscribe(value => console.log(value));

    return () => subscription.unsubscribe();

  }, [])
  return (
    <div className="App">
      Hello
    </div>
  );
}

export default App;
