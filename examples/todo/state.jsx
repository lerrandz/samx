import { State } from '../../src'

const aggregateTodos = models => ({
  pending: models.app.todos.filter(t => ! t.done),
  done: models.app.todos.filter(t => t.done),
  size: models.app.todos.length,
})

const aggregateAuthenticatedUser = ({ user }) => ({
  isAuthenticated: user.username !== '',
  userFullname: user.username,
})

export const todoState = State(aggregateTodos, { name: "todoState" })
export const userState = State(aggregateAuthenticatedUser, { name: "userState", onlyTrack: ['user'] })
