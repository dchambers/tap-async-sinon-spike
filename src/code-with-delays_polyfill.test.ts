import tap from 'tap'
import PolyfillPromise from 'promise-polyfill'
import fakeTimers from '@sinonjs/fake-timers'

import { promiseDelay, awaitedPromiseDelay } from './code-with-delays'

const ACTUAL_DELAY = 10
const ADDITIONAL_PROMISE_DELAY = 1

const origPromise = Promise

tap.beforeEach((done, test) => {
  test.context.clock = fakeTimers.install()
  global.Promise = PolyfillPromise
  done()
})

tap.afterEach((done, test) => {
  global.Promise = origPromise
  test.context.clock.uninstall()
  done()
})

tap.test('promise delay can be tested with polyfill', (test) => {
  const { clock } = test.context
  let delayFired = false

  promiseDelay(ACTUAL_DELAY).then(() => {
    delayFired = true
  })

  test.false(delayFired)
  clock.tick(0)
  test.false(delayFired)
  clock.tick(ACTUAL_DELAY)
  test.false(delayFired)
  clock.tick(ADDITIONAL_PROMISE_DELAY)
  test.true(delayFired)
  test.end()
})

tap.test('awaited promise delay can be tested with polyfill', (test) => {
  const { clock } = test.context
  let delayFired = false

  awaitedPromiseDelay(ACTUAL_DELAY).then(() => {
    delayFired = true
  })

  test.false(delayFired)
  clock.tick(0)
  test.false(delayFired)
  clock.tick(ACTUAL_DELAY)
  test.false(delayFired)
  clock.tick(ADDITIONAL_PROMISE_DELAY * 3)
  test.true(delayFired)
  test.end()
})
