import { Model } from '../../src'

Model('app', { schema: {
  todos: [
    { id: 0, description: 'Write example', done: true },
  ],
} })
