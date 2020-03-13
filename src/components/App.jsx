import React from 'react'
import cs from 'classNames'
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const actived = true
    const hello = 'hello'
    const world = 'world'
    return (
      <div className="app-wrapper">
        <div className={cs('app-inner', hello, ['array-item'], { world }, { isBlock: false }, { isActived: actived })}>
          <h1 className={cs('title', 'bold', { large: true })} ></h1>
          <a className="link underline blue"></a>
        </div>
      </div>
    )
  }
}
