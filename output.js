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
    return <div className="aaa">
        <div className={cs("aab", hello, ["aac"], {
        aad: world
      }, {
        aae: false
      }, {
        aaf: actived
      })}>
          <h1 className={cs("aag", "aah", {
          aai: true
        })}></h1>
          <a className="aaj"></a>
        </div>
      </div>;
  }

}