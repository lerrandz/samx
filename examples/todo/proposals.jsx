const proposeTodoUpdate = (id, props) => ({
  name: 'update',
  key: `todos[${id}]`,
  value: props,
})

const proposeNewTodo = description => ({ todos }) => ({
  name: 'append',
  value: { todos: [...todos, { description, done: false, id: todos.length }] },
})

const proposeLogin = (username) => ({
  name: 'login',
  value: { username },
})

const proposeLogout = () => ({
  name: 'logout',
  value: { username: "" },
})

export {
  proposeTodoUpdate,
  proposeNewTodo,
  proposeLogin,
  proposeLogout,
}
