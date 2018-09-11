import * as React from 'react'
import { View } from '../../../src'
import { createTodo } from '../actions.jsx'
import state from '../state.jsx'

import ListItem from './ListItem.jsx'

export default View(() => (
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
