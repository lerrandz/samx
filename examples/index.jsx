import * as React from 'react'
import { Render, Model, State, Propose } from '../src/index.js'

const root = document.getElementById('root')

Model('app', { schema: {
  todos: [
    { id: 1, description: 'Write example.', done: true },
    { id: 2, description: 'Write another example.', done: false },
  ],
}})

const state = State(models => {
  return {
    pending: models.app.todos.filter(t => !t.done),
    done: models.app.todos.filter(t => t.done),
    size: models.app.todos.length,
  }
})

const update = id => e => Propose('app')(proposeNewDescription(id, e.target.value))

const proposeNewDescription = (id, description) => models => ({
  name: 'update',
  value: {
    todos: models.todos.map(t => t.id === id ? Object.assign({}, t, {description}) : t ),
  }
})

const Todo = props =>
  <li><input type='text' value={props.description} onChange={update(props.id)}/></li>

const App = state(({ state }) => {
  console.log(state)
  return (
    <div>
      Hi, we have {state.size} total todos.
      Pending:
      <ul>
        {
          state.pending.map((t, i) => <Todo key={i} {...t}/>)
        }
      </ul>
      Done:
      <ul>
        {
          state.done.map((t, i) => <Todo key={i} {...t}/>)
        }
      </ul>
    </div>
  )
})


Render(App, root)
