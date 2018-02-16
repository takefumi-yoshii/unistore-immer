# unistore-immer

[![Latest Version](https://img.shields.io/badge/npm-v0.0.1-C12127.svg)](https://www.npmjs.com/package/unistore-immer)
[![CircleCI](https://circleci.com/gh/takefumi-yoshii/unistore-immer.svg?style=svg)](https://circleci.com/gh/takefumi-yoshii/unistore-immer)

The bridge of unistore and immer.By using this you can safely change the value as immutable.The behavior of the model contributes greatly to the design pattern.Developers can concentrate on the scope of collections they deal with.

## install

```sh
$ npm install --save unistore-immer
```

## usage

```javascript
import { createActions } from 'unistore-immer'

export const counterModel = (defs = {}) => ({
  count: 0,
  ...defs
})

export const counterActions = store => createActions({
  increment () {
    this.count++
  },
  decrement () {
    this.count--
  }
}, 'counter') // define aggregate name.

```

```javascript
import { createAction } from 'unistore-immer'
import { todoModel } from './todo'

export const todosModel = (defs = {}) => ({
  records: [],
  getTodos () {
    return this.records
  },
  getTodoByIndex (index) {
    return this.records[index]
  },
  getTodosLength () {
    return this.getTodos().length
  },
  ...defs
})

export const todosActions = store => createAction({
  addTodo (task) {
    this.records.push(todoModel({ task }))
  }
}, 'todos') // define aggregate name.

```

```javascript
import { render } from 'preact'
import createStore from 'unistore'
import devtools from 'unistore/devtools'
import { Provider } from 'unistore/preact'
import { counterModel } from './models/counter'
import { todosModel } from './models/todos'
import View from './view'

export const store = devtools(
  createStore({
    counter: counterModel({ count: 0 }),
    todos: todosModel()
  })
)

render((
  <Provider store={store}>
    <View />
  </Provider>),
document.getElementById('app'))

```