const proposeTodoUpdate = (id, props) => ({
  name: 'update',
  key: `todos[${id}]`,
  value: props,
})

const proposeNewTodo = description => ({ todos }) => ({
  name: 'append',
  value: { todos: [...todos, { description, done: false, id: todos.length }] },
})

export {
  proposeTodoUpdate,
  proposeNewTodo,
}
