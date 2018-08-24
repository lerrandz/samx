import { configure } from 'mobx'
import { getModel, getModels, registerModel } from './store'

import { buildStateFactory } from './state'
import { buildRenderFactory, DefaultRenderer } from './render'
import { proposeToModel, buildModelFactory, buildProposerFactory } from './model'

configure({
  enforceActions: 'strict',
  isolatedGlobalState: true,
})

export const ModelFactory = buildModelFactory(proposeToModel)(registerModel)
export const StateFactory = buildStateFactory(getModels)
export const RenderFactory = buildRenderFactory(getModels)
export const ProposerFactory = buildProposerFactory(getModel)(DefaultRenderer)

export {
  ModelFactory as Model,
  StateFactory as State,
  RenderFactory as Render,
  ProposerFactory as Proposer,
}
