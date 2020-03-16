import React from 'react';
import cs from 'classNames';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const actived = true;
    const hello = 'hello';
    const world = 'world';
    return <div className="a">
        <div className={cs("b", hello, ["c"], {
        d: world
      }, {
        e: false
      }, {
        f: actived
      })}>
          <h1 className={cs("g", "h", {
          i: true
        })}></h1>
          <a className="j k l"></a>
        </div>
      </div>;
  }

}