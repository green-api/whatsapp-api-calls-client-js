import { useState, useCallback, useRef, useEffect } from 'react';

const useStateWithCallback = <T>(
  initialState: T
): [T, (newState: T | Function, cb?: Function) => void] => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef<Function>();

  const updateState = useCallback((newState: T | Function, cb?: Function) => {
    cbRef.current = cb;

    setState((prev) => (typeof newState === 'function' ? (newState as Function)(prev) : newState));
  }, []);

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = undefined;
    }
  }, [state]);

  return [state, updateState];
};

export default useStateWithCallback;
