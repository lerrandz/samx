import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import { getModels } from './store'

/**
 * Renders the root Component bound to preloaded Models and Actions
 * @param {function} Component APP's entry component.
 * @param {HTMLElement} DOM    HTMLElement to mount the APP.
 * @example
 * render(RoutingView, document.getElementById('root'))
 */
export const Render = (Component, DOM) =>
  render(
    React.createElement(
      Provider,
      { models: getModels() },
      React.createElement(Component)
    ),
    DOM
  )
