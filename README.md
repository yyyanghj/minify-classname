# minify-classname
minify classname for jsx


### before
```js
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
        <a className={classnames('blue underline mt-1', { [link]: true })}>Awesome😁</a>
      </header>
    </div>
  );
}
```
```css
.app-wrapper {
    /* ... */
}

.header {
    /* ... */
}

.flex {
    /* ... */
}

.flex-center {
    /* ... */
}
```

### after

```js
export default function App() {
  const hello = 'hello';
  const isLarge = true;
  const link = 'link';
  return (
    <div className="a">
      <header className="b c d e">
        <h1
          className={classnames('f',['g'],{ h: true },{ i: isLarge }, hello)}>
          Hello World
        </h1>
        <a className={classnames('j k l', {[link]: true})}>
          Awesome😁
        </a>
      </header>
    </div>
  );
}

```
```css
.a { 
    /* ... */
}
.b {
    /* ... */
}
.c {
    /* ... */
}
.d {
    /* ... */
}
.e {
    /* ... */
}
```


## How to use
```js
// webpack.config.js
const MinifyClassName = require('minify-classname')

const webpackConfig = {
  plugin: [
    new MinifyClassName();
  ],
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [MinifyClassName.babelPlugin]
            }
          }
        ],
      },
    ]
  }
}
```
