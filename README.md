# SAMx

SAMx is a Functional Reactive State Management library for React that implements the SAM pattern using for MobX.

# Why?

MobX is a powerful FRP library and observable pattern implementation, and we wanted to leverage that to the world of state management in React, while maintaining a functiona approach.

MobX alone does not do state management, but is a powerful engine for such matter. On the other hand, the SAM pattern is a strong separation of concerns pattern that exactly solves the problem of state management. Combining both has produced a simple and powerful tool that we call SAMx.

# How?

SAMx is not so different from Flux/Redux from a high level of abstraction, however there are key difference when it comes to the implementation details. You can thoroughly read about [SAM Pattern](https://sam.js.org) by clicking the provided link.

SAMx neatly separates your data layer, your business logic layer and your presentation layer, providing a unidirectional flow of data, sparing you the hells of having imparative logic handling everything at once.

SAMX defines key concepts to achieve this, and they are the following:

#### Model:
This is where you model the entities your app is dealing with.
The model is defined by a schema that describes the properties and the types of your entity. Also, the model is responsible for handling all data operations related to the entity it represents, i.e: validation, entity-specific business logic and so on.

Example:

```
import { Model } from '@expertlead/samx'

Model('user', {
  schema: {
    firstName: '', // properties' types are defined by the zero-value of their type
    lastName: '',
    age: 0,
  }
})
```

Every model provides a proposer method, proposes mutations to the model, and it is up to the model to whether accept or reject the proposed mutations.

Example:
To propose to the `user` model a new name, do the following:
```
import { Propose } from '@expertlead/samx'

const proposer = Propose('user') // model name (this function is auto-curried)

const changeUserName = (firstName, lastName) => {
  proposer({
    name: 'user.update-name',
    value: {
      firstName,
      lastName
    }
  })
}
```

Please do not get confused by the schema of the object being proposed, and check the `proposals` section for further explanation.

By default, all mutations are accepted, however an `acceptor` function can be provided to the model to control what is being accepted/rejected.

Example:
```
import { Model } from '@expertlead/samx'

Model('user', {
  schema: {
    firstName: '', // properties' types are defined by the zero-value of their type
    lastName: '',
    age: 0,
  },
  acceptor: (Accept, proposition, currentState) => {
    const { name: propositionName, value } = proposition

    switch (propositionName) {
      case 'user.update-name'
        const { firstName, lastName } = value

        if (firstName.length == 0 && lastName.length == 0) {
          return false
        }
        break;
      default:
        Accept(proposition);
        return true;
        break;
    }
  }
})
```
The acceptor function receives three arguments:
  1- The accept function:
    This is what accepts the mutation and tells the model to propogate the changes
  
  2- The proposition object:
    This represents the actual mutation, having two main keys, name and value. Where the name is the defined semantic name for the mutation, and the value being the actual mutation mirroring the model's schema.
  
  3- The current state of the model:
    This represents the state of the model at the time of accepting/rejecting the mutation, it is useful for accessing current values upon which future values may depend.

The acceptor is a mutations' middleware, through which you can either reject or accept a mutation. Technically speaking, any sort of intervention can happen this level, but in an effort to respect the pattern, it is advised to only keep this layer for validation, or intricate model logic. Do not mutate your model with unregistered mutations. All possible mutations must be received through the acceptor, and accepted using the `accept` function, as opposed to ad-hoc on the fly mutation creation. (_See proposals section_)


#### Proposition:

Propositions are mutation objects, defining two main properties, a name and a value.
The name property should hold a meaningful name for what the mutation does, and which model it affects, where as the value property should contain only the models' properties we wish to change, and their new values, all following the model's schema.

Example:

For a model whose name is post and whose schema is like the following:
```
{
  id: 0,
  description: '',
  isValid: false
}
```

All the possible mutations could be described as propositions:

**Proposition 1**: `{ name: 'post.update-id', value: { id: 1 } }`
**Proposition 2**: `{ name: 'post.update-description', value: { description: 'blblablab' } }`
**Proposition 3**: `{ name: 'post.validate', value: { isValid: true } }`
**Proposition 4**: `{ name: 'post.invalidate', value: { isValid: false } }`

In SAMx mutations are first class citizens, and there two main reasons for this:

  1- We wanted to have a semantic API through which you describe all the possible state changes the app can go through
  2- We wanted our mutations to be composable and reusable.

### Proposal:

Proposals are functions that help make propositions composable, and provide access to models values. This is similar to action creators in Redux.

Proposals always return proposition objects.
Example:
```
const UpdatePostName = (name) => ({
  name: 'post.update-name',
  value: {
    name
  }
})
```

Proposals can access other values from other models, in order to do so, you will have to curry your proposal.

Example:
```
const IncrementPostId = () => (models) => ({
  name: 'post.increment-id',
  value: {
    id: models.post.collection.length + 1
  }
})
```

#### State:

A State in SAMx model represents a snapshot of the aggregated models' data, mapped into the desired schema, resulting in a specific granular state, or to be more precise, the state representation, ready to be consumed/observed by views/observers.

So the state is a models' aggregator and data transformer that procudes an observable to whom the observers (views) react to efficiently.

Example:

For a repo containing the following models:

  1- posts: `{ schema: { collection: [] } }`
  2- user: `{ schema: { id: 0, firstName: '', lastName: '', age: '' } }`
  3- session: `{ schema : { authToken: '', expiresAt: '' } }`

We can define a state in which we only need a username, an auth token, and the posts of that user.

```

import { State } from '@expertlead/samx'

const aggregatePostingUserState = (models) => ({
  username: models.user.firstName + ' ' + models.user.lastName,
  authSecret: models.sessions.authToken,
  posts: models.post.collection.filter(post => post.userId === models.user.id)
})

export const PostingUserState = State(aggregatePostingUserState)
```

Now, you can export and consume your state however you wish, guaranteeing that as long as your state is consumed by an observer, any changes propogated to the models will be reflected to the state.

The consumption of the state happens as easily as importing the named export and accessing the defined properties.

You can also choose to track specific models to compute a specific state out of:

Example:

For a repo containing the following models:

  1- posts: `{ schema: { collection: [] } }`
  2- user: `{ schema: { id: 0, firstName: '', lastName: '', age: '' } }`
  3- session: `{ schema : { authToken: '', expiresAt: '' } }`

We can define a state in which we only need a username, an auth token, thus we only need to track the user model. This can be acheived by providing a second curried argument, being the options argument, defined as the following:

```
{
  name: "", // name of the state, for debugging purposes
  onlyTrack: [], // The models you which to specifically track for your state
}
```
```
import { State } from '@expertlead/samx'

const aggregateUserState = ({ user }) => ({
  username: models.user.firstName + ' ' + models.user.lastName,
  authSecret: models.sessions.authToken,
})

export const UserState = State(aggregateUserState)({ onlyTrack: ["user"] })
```

When you choose to use the `onlyTrack` option, the models object that is passed to the state aggregator will only contain the models you chose to track, and trying to access non tracked models will result in an error.

### Next Action Predicate

There are common scenarios where we like to fire off an action based off of a change in state, in parallel to the main loop, or perhaps to interupt the main loop and render conditionally for instance.

The SAM pattern answers this by introducing the concept of the "next action predicate".

You can define a next action predicate for your state, say, to notify a service everytime a user has logged in.

Example:

We will define a model to hold our user entity, and then define a NAP to inform the service once the user has logged in.

For a repo containing the following models:

  1- user: `{ schema: { id: 0, firstName: '', lastName: '', age: '' } }`
  2- session: `{ schema : { authToken: '', expiresAt: '' } }`

We will define the `authenticatedUser` state and register a next action predicate to notify the relevant service(s) of the login of the user.


```
import { State } from '@expertlead/samx'

const aggregateUserState = ({ user }) => ({
  username: models.user.firstName + ' ' + models.user.lastName,
  authSecret: models.sessions.authToken,
})

const nextActionPredicate = (state, models, dispose) => {
  if (state.authSecret) {
    notifyService(authSecret)
      .then(dispose) // to remove the next action predicate once notified
  }
}

export const UserState = State(aggregateUserState, nextActionPredicate)({ name: "userState" })
```

In the way we have defined the next action predicate, we have registered a reaction that will notify a service once the `authSecret` has received a value after a login scenario, and afterwards, we dispose of our next action predicate.

If not, the next action predicate will just react everytime the SAM loop iterates, which is of course useful but for other scenarios.

You can also define multiple NAPs, by simply providing an array:
```
import { State } from '@expertlead/samx'

const aggregateUserState = ({ user }) => ({
  username: models.user.firstName + ' ' + models.user.lastName,
  authSecret: models.sessions.authToken,
})

const notifyUsersServerNAP = (state, models, dispose) => {
  if (state.authSecret) {
    notifyService(authSecret)
      .then(dispose) // to remove the next action predicate once notified
  }
}

const pushUserDocumentationNotificationNAP = (state, models, dispose) => {
  if (state.authSecret && models.user.initiated) {
    pushDocsNotification()
  }
}

export const UserState = State(aggregateUserState, [notifyUsersServerNAP, pushUserDocumentationNotificationNAP])({ name: "userState" })
```

### Action:

Actions are regular functions that should propose changes to the models. Imagine you had an input field whose value you wanted sent to an API to be stored at the database.

This will define two actions: One that updates model's value from the field while typing, and another one that sends the data to the API and tells the model that it successfully stored it.

For the sake of example, we will imagine our model to be like the following:

```
Model('user', {
  schema: {
    name: '',
    saved: false
  }
})
```

The actions:
```
import { Propose } from '@expertlead/samx'
import { SucceedUserSave, FailUserSave, UpdateUserName } from './proposals/user'

const updateInputFieldValue = (e) /*event object from input field*/ => {
  Propose('user', UpdateUserName(e.target.value))
}

const saveUser = async (name) /* value of user name passed as arg from somewhere*/ => {
  const response = await api.saveUser(name)

  if (response.ok) {
    Propose('user', SucceedUserSave()) // basically a proposition: { name: 'x', value: { saved: true } }
  } else {
    Propose('user', FailUserSave()) // basically a proposition: { name: 'y', value: { saved: false } }
  }
}
```

```js
import * as React from 'react'
import { render } from 'react-dom'
import { Model, State, Propose, View } from '../../src'

// Design the model for your Application
Model('app', { schema: {
  todos: [
    { id: 0, description: 'Write example', done: true },
  ],
} })

// Create necessary State evaluator
const appStateEvaluator = models => () => ({
  pending: models.app.todos.filter(t => ! t.done),
  done: models.app.todos.filter(t => t.done),
  size: models.app.todos.length,
})
const state = State(appStateEvaluator)

// Create proposals and actions
const proposeTodoUpdate = (id, props) => ({
  name: 'update',
  // You can use the Key property to cause deep mutations without triggering undesired renders
  key: `todos[${id}]`,
  value: props,
})

const proposeNewTodo = description => ({ todos }) => ({
  name: 'append',
  value: { todos: [...todos, { description, done: false, id: todos.length }] },
})

const createTodo = e => {
  if (e.key === 'Enter') Propose('app')(proposeNewTodo(e.target.value))
}

const updateDescription = id => e =>
  Propose('app')(proposeTodoUpdate(id, { description: e.target.value }))

// Create the View
const ListItem = View(({ todo: { description, done, id } }) =>
  <li>
    <input type='checkbox' value={done} checked={done} onChange={updateStatus(id)}/>
    <input type='text' value={description} onChange={updateDescription(id)}/>
  </li>)

const TodoList = View(() => (
  <div>
      Hi, we have {state.size} total todos.
      Pending:
    <ul>
      {
        state.pending.map((t, i) => <ListItem key={i} todo={t}/>)
      }
    </ul>
      Done:
    <ul>
      {
        state.done.map((t, i) => <ListItem key={i} todo={t}/>)
      }
    </ul>

    <p>
      Add new: <input type='text' onKeyPress={createTodo}/>
    </p>
  </div>
))

// Render
const root = document.getElementById('root')
render(<TodoList />, root)
```
