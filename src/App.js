import React, { useState, useEffect } from 'react';
import { fromEvent } from 'rxjs';
import { buffer, filter, map, share } from 'rxjs/operators';


function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const input$ = fromEvent(document.body, 'keypress')
      .pipe(
        map(evt => evt.key),
        share(),
      )
        
    const nonEnter$ = input$.pipe(
      filter(key => key !== 'Enter')
    )
    const enter$ = input$.pipe(
      filter(key => key === 'Enter')
    )

    const submission$ = nonEnter$.pipe(
      buffer(enter$),
      map(buf => buf.join('')),
    )

    const subscriptions = [
      input$.subscribe(value => console.log('value', value)),
      nonEnter$.subscribe(value => console.log('nonEnter', value)),
      enter$.subscribe(value => console.log('enter', value)),
      submission$.subscribe(value => setMessage(value))
    ]

    return () => subscriptions.forEach(s => s.unsubscribe());

  }, [])
  return (
    <div className="App">
      {message}
    </div>
  );
}

export default App;
