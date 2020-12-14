import sleep from 'sleep-promise'

export const promiseDelay = (ms: number) => sleep(ms)

export const awaitedPromiseDelay = async (ms: number) => {
  await sleep(ms)
}
