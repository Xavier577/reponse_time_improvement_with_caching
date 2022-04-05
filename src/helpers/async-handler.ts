export const AsyncWrapper = async <T>(asynFn: () => Promise<T>) => {
  try {
    let result = await asynFn();
    return { result };
  } catch (err) {
    let error = err;
    return { error };
  }
};

export const PromiseWrapper = async <T>(promise: Promise<T>) => {
  try {
    let result = await promise;
    return { result };
  } catch (err) {
    let error = err;
    return { error };
  }
};
