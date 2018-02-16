## Model (Counter)

DomainModel of Counter.

```javascript
import { createActions } from 'unistore-immer'

export const counterModel = (defs = {}) => ({
  count: 0,
  todosCount: 0,
  expo2 () {
    return this.count ** 2
  },
  getCountSum () {
    return this.count + this.todosCount
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
}, 'counter')
```

## Model (Todos)

DomainModel of Todos.

```javascript
import { createActions } from 'unistore-immer'
import { todoModel } from './todo'

export const todosModel = (defs = {}) => ({
  records: [],
  getTodos () {
    return this.records
  },
  getTodoByIndex (index) {
    return this.records[index]
  },
  gettodosCount () {
    return this.getTodos().length
  },
  ...defs
})

export const todosActions = store => createActions({
  addTodo (task) {
    this.records.push(todoModel({ task }))
  }
}, 'todos')
```

## Model (Todo)

Instance of TodosDomain records.

```javascript
export const todoModel = (defs = {}) => ({
  task: '',
  date: new Date(),
  getTask () {
    const dateStr = this.getDateString()
    return `${this.task} (${dateStr})`
  },
  getDateString () {
    const month = this.date.getMonth() + 1
    const date = this.date.getDate()
    const hour = this.date.getHours()
    const minute = this.date.getMinutes()
    const second = this.date.getSeconds()
    return `${month}/${date} ${hour}:${minute}:${second}`
  },
  ...defs
})
```

## Service (Counter)

Context mapping of upstream and downstream.

```javascript
import { change, update } from 'unistore-immer'

async function mapTodosCount (store) {
  while (true) {
    await change(store)
    update(store, ({ counter, todos }) => {
      counter.todosCount = todos.getTodosCount()
    })
  }
}

export function runCounterService (store) {
  mapTodosCount(store)
}
```

## View (Counter)

Usual SFC.

```javascript
export default ({ model, increment, decrement }) => {
  return (
    <div>
      <h1>Counter</h1>
      <p>count = {model.count}</p>
      <p>expo2 = {model.expo2()}</p>
      <p>counter.count + todos.length = {model.getCountSum()}</p>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  )
}
```

## View (Todos)

Usual Component.

```javascript
import { Component } from 'preact'

export default class extends Component {
  constructor () {
    super()
    this.state = { value: '' }
  }
  render ({ model, addTodo }) {
    return (
      <div>
        <h1>Todos</h1>
        <input
          type='text'
          defaultValue=''
          onChange={e => this.onChange(e)}
        />
        <button onClick={() => addTodo(this.state.value)}>add</button>
        <Todos model={model} />
      </div>
    )
  }
  onChange (e) {
    this.setState({ value: e.target.value })
  }
}

function Todos ({ model }) {
  const components = model.getTodos().map((todo, i) => {
    return <p key={i}>{todo.getTask()}</p>
  })
  return <div>{components}</div>
}
```

## View (Root)

Mapping some actors.

```javascript
import { connect } from 'unistore/preact'
import { counterActions } from './models/counter'
import { todosActions } from './models/todos'
import Counter from './views/counter'
import Todos from './views/todos'

export default connect(
  ['counter', 'todos'],
  store => ({
    ...counterActions(store),
    ...todosActions(store)
  })
)(
  ({ counter, todos, increment, decrement, addTodo }) => {
    return (
      <div>
        <Counter
          model={counter}
          increment={increment}
          decrement={decrement}
        />
        <Todos
          model={todos}
          addTodo={addTodo}
        />
      </div>
    )
  }
)
```

## App

Create single store with aggregate root.

```javascript
import { render } from 'preact'
import createStore from 'unistore'
import devtools from 'unistore/devtools'
import { Provider } from 'unistore/preact'
import { counterModel } from './models/counter'
import { todosModel } from './models/todos'
import { runCounterService } from './services/counter'
import View from './view'

export const store = devtools(
  createStore({
    counter: counterModel({ count: 0 }), // dependency injection.
    todos: todosModel()
  })
)

runCounterService(store)

render((
  <Provider store={store}>
    <View />
  </Provider>),
document.getElementById('app'))

```
