//
// unistore-immer-bridge
// _____________________________________

import produce from 'immer'

export function createAction (actions, modelName) {
  const buf = {}
  Object.keys(actions).forEach(key => {
    buf[key] = (state, ...arg) => {
      return produce(state, draft => {
        const fn = actions[key]
        const scope = draft[modelName]
        return fn.bind(scope)(state, arg)
      })
    }
  })
  return buf
}

export function update (store, fn, overwrite, action) {
  store.setState(
    produce(store.getState(), draft => fn(draft)),
    overwrite, action
  )
}

export function change (store, resolver) {
  return new Promise(resolve => {
    const disposer = store.subscribe((state, action) => {
      if (action === resolver) {
        disposer()
        resolve(state)
      }
    })
  })
}
