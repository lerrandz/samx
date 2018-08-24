import React from 'react'

import { render } from 'react-dom'
import { Provider } from 'mobx-react'

/**
 * Renders the root Component bound to preloaded Models and Actions
 * @param { Function } modelsGetter Gets all the modesl from the store.
 * @param { Function } Renderer Receives the modelsGetter asn arg, and renders however it sees fit
 * @param {Function} Component APP's entry component.
 * @param {HTMLElement} DOM    HTMLElement to mount the APP.
 * @returns {void}
 *
 * @example
 * render(RoutingView, document.getElementById('root'))
 */
export const buildRenderFactory = modelsGetter => Renderer => {
  if (! modelsGetter || typeof modelsGetter !== 'function') {
    throw Error('Expected a models\' getter as a first curried argument')
  }

  if (! Renderer || typeof Renderer !== 'function') {
    throw Error('Expected a renderer as a second curried argument')
  }

  return Renderer(modelsGetter)
}

export const DefaultRenderer = modelsGetter => (Component, DOM) => {
  render(
    React.createElement(
      Provider, {
        models: modelsGetter(),
      },
      React.createElement(Component)
    ),
    DOM
  )
}
