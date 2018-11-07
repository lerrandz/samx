*v2.0.1*
_Feat: expose toJS from mobx_

*v2.0.0*
_Feat: Create State as a second observable layer that reacts as needed by updates in the Model._
> This is a breaking change and it deprecates the former Render wrapper.
_Feat: Proposals can now specify deep property mutation through the new `key` property._
_Feat: View components are now observers for the State and render only if needed._

*v1.1.2*
_Fix: MobX faulty `configure` call_

*v1.1.1*
_Fix: Defining an acceptor stopped models from receiving propositions_

*v1.1.0*
_Feat: Add support for State based propositions_
> Basically this injects the current model representation when the
passed proposition is a Function.

*v1.0.2*
_Fix: Drop JSX syntax in favor of vanilla JS_
> This settle the building errors without the need of building the library.

*v1.0.1*
_Fix: Drop spread operator_

*v1.0.0*
_Bootstrap SAMx_
