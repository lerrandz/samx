import 'mocha'

import { expect } from 'chai'
import { pick } from 'lodash/fp'

import { toJS } from 'mobx'
import { proposeToModel, buildModelFactory, buildProposerFactory } from '~/src/model'

describe('Model', () => {
  describe('buildModelFactory', () => {
    const store = {}
    const registerModel = (name, model) => {
      store[name] = model
      return model
    }

    const getModels = () => store
    const getModel = (name) => store[name]

    it('should be curried', () => {
      expect(buildModelFactory)
        .to.be.a('function')

      expect(buildModelFactory(m => m))
        .to.be.a('function')

      expect(buildModelFactory(m => m)(n => n))
        .to.be.a('function')
    })

    describe('should throw if did not receive correct arguments', () => {
      it('should throw if it did not receive the first curried argument', () => {
        try {
          buildModelFactory()
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to propose to models')
        }

        try {
          buildModelFactory(1)
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to propose to models')
        }

        try {
          buildModelFactory('')
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to propose to models')
        }

        try {
          buildModelFactory([])
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to propose to models')
        }

        try {
          buildModelFactory({})
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to propose to models')
        }
      })

      it('should throw if it did not receive the second curried argument', () => {
        try {
          buildModelFactory((m) => m)()
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to register models to the store')
        }

        try {
          buildModelFactory(() => {})(1)
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to register models to the store')
        }

        try {
          buildModelFactory(() => {})('')
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to register models to the store')
        }

        try {
          buildModelFactory(() => {})([])
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to register models to the store')
        }

        try {
          buildModelFactory(() => {})({})
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('Expecting a function to register models to the store')
        }
      })

      it('should throw if it did not receive the third curried argument', () => {
        try {
          buildModelFactory(proposeToModel)(m => m)(undefined, {})
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('InvalidArgError: Expecting a model name, received none')
        }

        try {
          buildModelFactory(proposeToModel)(m => m)('', { })
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('InvalidArgError: Expecting a model name, received none')
        }

        try {
          buildModelFactory(proposeToModel)(m => m)('model', { })
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('InvalidArgError: Expecting a model schema, received none')
        }

        try {
          buildModelFactory(proposeToModel)(m => m)('model', { schema: 1 })
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('InvalidArgError: Expecting a model schema, received none')
        }

        try {
          buildModelFactory(proposeToModel)(m => m)('model', { schema: '' })
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('InvalidArgError: Expecting a model schema, received none')
        }

        try {
          buildModelFactory(proposeToModel)(m => m)('model', { schema: [] })
        } catch (err) {
          expect(err)
            .to.be.instanceOf(Error)
            .to.have.property('message')
            .to.equal('InvalidArgError: Expecting a model schema, received none')
        }
      })
    })

    describe('should register a model', () => {
      it('with a name and schema', () => {
        let ModelFactory, model

        it('providing a register models function', () => {
          expect(() => {
            ModelFactory = buildModelFactory(proposeToModel)(registerModel)
          }).not.to.throw()
        })

        it('providing a valid name and schema', () => {
          expect.to.not.throw(() => {
            model = ModelFactory('post', {
              schema: {
                id: 0,
                body: 'a posty post',
              },
            })
          })
        })

        it('model.propose is functional', () => {
          const newPost = {
            name: 'post.new',
            value: {
              id: 1,
              body: 'A postier post',
            },
          }

          expect(model.propose)
            .to.be.a('function')

          model.propose(newPost)

          expect(toJS(model).id).to.equal(newPost.id)
          expect(toJS(model).body).to.equal(newPost.body)
        })
      })
    })

    describe('with a name and schema and an acceptor', () => {
      let ModelFactory, model
      const secondStore = []

      it('providing a register models function', () => {
        expect(() => {
          ModelFactory = buildModelFactory(proposeToModel)(registerModel)
        }).not.to.throw()
      })

      it('providing a valid name and schema and an acceptor', () => {
        expect(() => {
          model = ModelFactory('post', {
            schema: {
              id: 0,
              body: 'a posty post',
            },
            acceptor: (accept, proposition) => secondStore
              .push(
                pick([
                  'id',
                  'body',
                ])(
                  accept(proposition)
                )
              ),
          })
        }).not.to.throw()
      })

      it('model.propose is functional', () => {
        const newPost = {
          name: 'post.new',
          value: {
            id: 1,
            body: 'A postier post',
          },
        }

        expect(model.propose)
          .to.be.a('function')

        const postIndex = model.propose(newPost)

        expect(toJS(model).id).to.equal(newPost.value.id)
        expect(toJS(model).body).to.equal(newPost.value.body)

        expect(secondStore)
          .to.have.deep.members([{
            id: newPost.value.id,
            body: newPost.value.body,
          }])

        expect(postIndex).to.equal(1)
      })
    })
  })

  describe('buildProposerFactory', () => {

  })
})
