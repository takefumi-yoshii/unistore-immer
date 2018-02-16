//
// unistore-immer
// _____________________________________

import produce from 'immer'

export function createAction (actions, modelName) {
  const buf = {}
  Object.keys(actions).forEach(key => {
    buf[key] = (state, ...arg) => {
      return produce(state, draft => {
        const fn = actions[key]
        const scope = draft[modelName]
        return fn.bind(scope, ...arg)()
      })
    }
  })
  return buf
}

export function update (store, fn) {
  store.setState(
    produce(store.getState(), draft => fn(draft))
  )
}

export function change (store) {
  return new Promise(resolve => {
    const unsbuscribe = store.subscribe(state => {
      unsbuscribe()
      resolve(state)
    })
  })
}
