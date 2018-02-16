# unistore-immer

[![Latest Version](https://img.shields.io/badge/npm-v0.0.1-C12127.svg)](https://www.npmjs.com/package/unistore-immer)
[![CircleCI](https://circleci.com/gh/takefumi-yoshii/unistore-immer.svg?style=svg)](https://circleci.com/gh/takefumi-yoshii/unistore-immer)

The bridge of [unistore](https://github.com/developit/unistore) and [immer](https://github.com/mweststrate/immer).By using this you can safely change the value as immutable.The behavior of the model contributes greatly to the design pattern.Developers can concentrate on the scope of collections they deal with.

## install

```sh
$ npm install --save unistore-immer
```

## usage

Setup states and getter as Model. Actions Scope is bound for model.

```javascript
import { createActions } from 'unistore-immer'

export const counterModel = (defs = {}) => ({
  count: 0,
  expo2 () {
    return this.count ** 2
  },
  ...defs
})

export const counterActions = store => createActions({
  increment () {
    this.count++
  },
  decrement () {
    this.count--
  }
}, 'counter') // Specify the scope of the model.

```

Use age of App entry point.

```javascript
import { render } from 'preact'
import createStore from 'unistore'
import { Provider, connect } from 'unistore/preact'
import { counterModel, counterActions } from './models/counter'

export const store = createStore({
  counter: counterModel() // model name key.
})

function View () {
  return connect('counter', counterActions)( // connect model.
    ({ model, increment, decrement }) => {
      return (
        <CounterView
          model={counter}
          increment={increment}
          decrement={decrement}
        />
      )
    }
  )
}

function CounterView ({ model, increment, decrement }) {
  // plain jsx.
  return (
    <div>
      <h1>Counter</h1>
      <p>count = {model.count}</p>
      <p>expo2 = {model.expo2()}</p> // computed getter.
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  )
}

render((
  <Provider store={store}>
    <View />
  </Provider>),
document.getElementById('app'))

```

[And more examples ->](./docs)
