import { State } from '../../src'

const appStateEvaluator = models => () => ({
  pending: models.app.todos.filter(t => ! t.done),
  done: models.app.todos.filter(t => t.done),
  size: models.app.todos.length,
})

export default State(appStateEvaluator)
