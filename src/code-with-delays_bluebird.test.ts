import tap from 'tap'
import BluebirdPromise from 'bluebird'
import fakeTimers from '@sinonjs/fake-timers'

import { promiseDelay, awaitedPromiseDelay } from './code-with-delays'

const ACTUAL_DELAY = 10

const origPromise = Promise

// NOTE: this is why we don't need `ADDITIONAL_PROMISE_DELAY`, but it can break real-world code
BluebirdPromise.setScheduler((fn) => fn())

tap.beforeEach((done, test) => {
  test.context.clock = fakeTimers.install()
  global.Promise = BluebirdPromise as any
  done()
})

tap.afterEach((done, test) => {
  global.Promise = origPromise
  test.context.clock.uninstall()
  done()
})

tap.test('promise delay can be tested with bluebird', (test) => {
  const { clock } = test.context
  let delayFired = false

  promiseDelay(ACTUAL_DELAY).then(() => {
    delayFired = true
  })

  test.false(delayFired)
  clock.tick(0)
  test.false(delayFired)
  clock.tick(ACTUAL_DELAY)
  test.true(delayFired)
  test.end()
})

tap.test('awaited promise delay can be tested with bluebird', (test) => {
  const { clock } = test.context
  let delayFired = false

  awaitedPromiseDelay(ACTUAL_DELAY).then(() => {
    delayFired = true
  })

  test.false(delayFired)
  clock.tick(0)
  test.false(delayFired)
  clock.tick(ACTUAL_DELAY)
  test.true(delayFired)
  test.end()
})
