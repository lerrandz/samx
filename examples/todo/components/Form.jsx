import * as React from 'react'
import { View, LocalState } from '../../../src'

const {
  state,
  setState
} = LocalState({
  schema: {
    name: "",
    age: 0,
  },

  setter: (mutation) => {
    return {
      name: mutation.name ? mutation.name.toLowerCase() : "",
      age: mutation.age
        ? mutation.age > 0
          ? mutation.age * 2
          : mutation.age * 10
        : mutation.age + 1,
    }
  },

  getter: (state) => {
    const [
      firstName, lastName
    ] = state.name.split(" ")

    return {
      firstName,
      lastName,
    }
  }
})

export default View(
  () =>
  <div>
    <pre>
      {
        <p>
          name: { state.name }
          age: { state.age }
        </p>
      }
    </pre>
    <li>
      <label htmlFor="name">Name</label>
      <input type="text" name="name" value={state.name} onChange={({ target: { value } }) => setState("name")(value)}/>
    </li>
    <li>
      <label htmlFor="name">Age</label>
      <input type="text" name="name" value={state.age} onChange={({ target: { value }}) => setState("age")(value)}/>
    </li>
  </div>
)
