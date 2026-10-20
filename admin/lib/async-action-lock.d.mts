export declare function createAsyncActionLock(): (
  action: () => Promise<void>,
) => Promise<boolean>;
