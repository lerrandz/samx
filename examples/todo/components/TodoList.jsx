import * as React from 'react'
import { View } from '../../../src'
import { createTodo, login, logout } from '../actions.jsx'
import { userState, todoState } from '../state.jsx'

import ListItem from './ListItem.jsx'
import Form from "./Form"

console.log({
  todoState, userState
})

export default View(() => {
  return (
    <div>
        <Form />
        <br/>
        <hr/>
        Hi, we have {todoState.size} total todos.
        Pending:
      <ul>
        User: { userState.isAuthenticated ? userState.userFullname : "Log in please"}
      </ul>
      {
        !userState.isAuthenticated
          ? <button onClick={login}>Login</button>
          : <button onClick={logout}> logout</button>
      }
      <ul>
        {
          todoState.pending.map((t, i) => <ListItem key={i} todo={t}/>)
        }
      </ul>
        Done:
      <ul>
        {
          todoState.done.map((t, i) => <ListItem key={i} todo={t}/>)
        }
      </ul>

      <p>
        Add new: <input type='text' onKeyPress={createTodo}/>
      </p>
    </div>
  )
})