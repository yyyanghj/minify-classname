import React from 'react';
import classnames from 'classnames';
import './App.css';
export default function App() {
  const hello = 'hello';
  const isLarge = true;
  const link = 'link';
  return (
    <div className="a">
      <header className="b c d e">
        <h1
          className={classnames(
            'f',
            ['g'],
            {
              h: true,
            },
            {
              i: isLarge,
            },
            hello,
          )}
        >
          Hello World
        </h1>
        <a
          className={classnames('j k l', {
            [link]: true,
          })}
        >
          Awesome😁
        </a>
      </header>
    </div>
  );
}
