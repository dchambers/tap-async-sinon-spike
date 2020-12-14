import tap from 'tap'
import fakeTimers from '@sinonjs/fake-timers'

import { promiseDelay, awaitedPromiseDelay } from './code-with-delays'

const ACTUAL_DELAY = 10

tap.beforeEach((done, test) => {
  test.context.clock = fakeTimers.install()
  done()
})

tap.afterEach((done, test) => {
  test.context.clock.uninstall()
  done()
})

tap.test('promise delay can be tested natively', async (test) => {
  const { clock } = test.context
  let delayFired = false

  promiseDelay(ACTUAL_DELAY).then(() => {
    delayFired = true
  })

  test.false(delayFired)
  await clock.tickAsync(0)
  test.false(delayFired)
  await clock.tickAsync(ACTUAL_DELAY)
  test.true(delayFired)
  test.end()
})

tap.test('awaited promise delay can be tested natively', async (test) => {
  const { clock } = test.context
  let delayFired = false

  awaitedPromiseDelay(ACTUAL_DELAY).then(() => {
    delayFired = true
  })

  test.false(delayFired)
  await clock.tickAsync(0)
  test.false(delayFired)
  await clock.tickAsync(ACTUAL_DELAY)
  test.true(delayFired)
  test.end()
})
