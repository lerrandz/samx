import { Propose } from '../../src'
import { proposeTodoUpdate, proposeNewTodo, proposeLogin, proposeLogout } from './proposals.jsx'

const updateDescription = id => e =>
  Propose('app')(proposeTodoUpdate(id, { description: e.target.value }))

const updateStatus = id => e => {
  const done = e.target.value !== 'true'
  Propose('app')(proposeTodoUpdate(id, { done }))
}

const createTodo = e => {
  if (e.key === 'Enter') Propose('app')(proposeNewTodo(e.target.value))
}

const login = () => {
  Propose('user')(proposeLogin("james"))
}

const logout = () => {
  Propose('user')(proposeLogout())
}

export {
  createTodo,
  updateDescription,
  updateStatus,
  login,
  logout,
}
