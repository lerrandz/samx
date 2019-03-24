import { State } from '../../src'

const aggregateTodos = models => ({
  pending: models.app.todos.filter(t => ! t.done),
  done: models.app.todos.filter(t => t.done),
  size: models.app.todos.length,
})

const todosStateNextActionPredicate = (state, models) => {
  if (state.size > 100) {
    console.log("TodosOverflow: You must do your chores!")
  } else if (state.size < 100) {
    console.log("Keep on adding todos still")
  }
}

const printDoneNap = (state) => {
  console.log("You have completed", state.done.length, " tasks")
}

const notifyAboutSize = (state, models, dispose) => {
  console.log("current size is", state.size)
  dispose()
}

const aggregateAuthenticatedUser = ({ user }) => ({
  isAuthenticated: user.username !== '',
  userFullname: user.username,
})

const userStateNextActionPredicate = (state, onlyTrackedModels, dispose) => {
  if (state.isAuthenticated) {
    console.log("User logged in, send notification to service x")
    dispose()
  }
}

export const todoState = State(aggregateTodos, [
  todosStateNextActionPredicate,
  printDoneNap,
  notifyAboutSize
])({ name: "todoState" })

export const userState = State(aggregateAuthenticatedUser, userStateNextActionPredicate)({ name: "userState", onlyTrack: ['user'] })
