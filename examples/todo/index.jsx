import * as React from 'react'
import { render } from 'react-dom'

import './models.jsx'
import TodoList from './components/TodoList.jsx'

const root = document.getElementById('root')

render(<TodoList />, root)
