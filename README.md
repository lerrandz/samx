# SAMx

SAMx is a SAM pattern implementation for MobX and React.

# How?

```js
import * as React from 'react'
import { render } from 'react-dom'
import { Model, State, Propose, View } from '../../src'

// Design the model for your Application
Model('app', { schema: {
  todos: [
    { id: 0, description: 'Write example', done: true },
  ],
} })

// Create necessary State evaluator
const appStateEvaluator = models => () => ({
  pending: models.app.todos.filter(t => ! t.done),
  done: models.app.todos.filter(t => t.done),
  size: models.app.todos.length,
})
const state = State(appStateEvaluator)

// Create proposals and actions
const proposeTodoUpdate = (id, props) => ({
  name: 'update',
  // You can use the Key property to cause deep mutations without triggering undesired renders
  key: `todos[${id}]`,
  value: props,
})

const proposeNewTodo = description => ({ todos }) => ({
  name: 'append',
  value: { todos: [...todos, { description, done: false, id: todos.length }] },
})

const createTodo = e => {
  if (e.key === 'Enter') Propose('app')(proposeNewTodo(e.target.value))
}

const updateDescription = id => e =>
  Propose('app')(proposeTodoUpdate(id, { description: e.target.value }))

// Create the View
const ListItem = View(({ todo: { description, done, id } }) =>
  <li>
    <input type='checkbox' value={done} checked={done} onChange={updateStatus(id)}/>
    <input type='text' value={description} onChange={updateDescription(id)}/>
  </li>)

const TodoList = View(() => (
  <div>
      Hi, we have {state.size} total todos.
      Pending:
    <ul>
      {
        state.pending.map((t, i) => <ListItem key={i} todo={t}/>)
      }
    </ul>
      Done:
    <ul>
      {
        state.done.map((t, i) => <ListItem key={i} todo={t}/>)
      }
    </ul>

    <p>
      Add new: <input type='text' onKeyPress={createTodo}/>
    </p>
  </div>
))

// Render
const root = document.getElementById('root')
render(<TodoList />, root)
```
