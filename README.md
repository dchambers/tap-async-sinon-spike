# Controlling time with Tap & Tape

## Promises

Tap and Tape are just Node.js libraries. The main promise libraries are scheduled on Node.js as follows:

1. Bluebird's promises are scheduled on `nextTick`.
2. Native promises are scheduled between `nextTick` and `setImmediate`.
3. Polyfill promises are scheduled on `setImmediate`.

SinonJs is unable to mock `nextTick` without completely freezing Node.js. As a consequence Sinon's `clock.tick()` method won't work for native promises.

Potential work-arounds for this are as follows:

1. You can use `await clock.tickAsync(1)` instead of `clock.tick(1)`, but doing this causes promises to be fired regardless of elapsed time, and so is not representative of reality.
2. You can use Bluebird's promises and do `BluebirdPromise.setScheduler((fn) => fn())`, in which case `clock.tick(1)` works correctly, but this also causes promises to becomes synchronous which can break code, and is therefore not representative of reality.
3. You can use polyfill promises and do `clock.tick(2)` instead of `clock.tick(1)` to fire the additional `setImmediate` -- `setImmediate` requires 1ms (rather than 0ms) if it was scheduled during a tick, as will be the case for promises.

Of these options, polyfill promises with an extra millisecond wait is by far the most realistic option.

## Async / Await

Node.js's native `async` / `await` implementation uses a private copy of `global.Promise` that can not be patched from within a test. This can be solved by using either `ts-node` or `babel-node` (provided `@babel/plugin-transform-async-to-generator` is enabled) to run your tests since the `async` / `await` implementations provided by these transpilers is patchable.

However, the generator code that `async` / `await` is transpiled to requires yet more promises to be resolved behind the scenes, which means yet more in-tick `setImmediate` invocations. The net effect being that you must wait 3ms for awaited promises as opposed to 1ms for promises resolved without `async` / `await`.
