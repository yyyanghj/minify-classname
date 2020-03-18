import React from 'react';
import classnames from 'classnames';
import './App.css';

export default function App() {
  const hello = 'hello';
  const isLarge = true;
  const link = 'link';
  return (
    <div className="app-wrapper">
      <header className="header flex flex-center flex-col">
        <h1
          className={classnames('title', ['bold'], { ink: true }, { 'text-large': isLarge }, hello)}
        >
          Hello World
        </h1>
        <a className={classnames('blue underline mt-1 Text', { [link]: true })}>Awesome😁</a>
      </header>
    </div>
  );
}
