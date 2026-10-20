export function createAsyncActionLock() {
  let isRunning = false;

  return async function runOnce(action) {
    if (isRunning) return false;

    isRunning = true;
    try {
      await action();
      return true;
    } finally {
      isRunning = false;
    }
  };
}
