import * as React from 'react'
import { View } from '../../../src'
import { updateDescription, updateStatus } from '../actions.jsx'

export default View(({ todo: { description, done, id } }) =>
  <li>
    <input type='checkbox' value={done} checked={done} onChange={updateStatus(id)}/>
    <input type='text' value={description} onChange={updateDescription(id)}/>
  </li>)
