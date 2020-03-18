import React from 'react';
import './Button.css';

export default function Button({ children }) {
  return <button className="btn btn-blue flex flex-center ignore-me ignore-btn">{children}</button>;
}
