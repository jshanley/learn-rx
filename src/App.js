import React, { useState, useEffect } from 'react';
import { fromEvent, interval, Subject } from 'rxjs';
import { buffer, bufferToggle, filter, map, mapTo, scan, share, startWith, switchMap, repeatWhen } from 'rxjs/operators';


function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const input$ = fromEvent(document.body, 'keypress').pipe(
      map(evt => evt.key),
      share(),
    )    
    
    // split off the Enter key presses into a separate stream
    const nonEnter$ = input$.pipe(filter(key => key !== 'Enter'))
    const enter$ = input$.pipe(filter(key => key === 'Enter'))

    // reset is triggered after typing stops for 1 second
    const resetInterval$ = interval(1000).pipe(mapTo(true));
    const reset$ = input$.pipe(
      startWith(true),
      switchMap(() => resetInterval$)
    )

    const submission$ = nonEnter$.pipe(
      bufferToggle(reset$, () => enter$),
      map(buf => buf.join('')),
    )

    const subscription = submission$.subscribe(value => setMessage(value));

    return () => subscription.unsubscribe();

  }, [])
  return (
    <div className="App">
      {message}
    </div>
  );
}

export default App;
