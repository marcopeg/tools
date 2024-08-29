import { useEffect } from "react";
import EventEmitter from "eventemitter3";
export const bus = new EventEmitter();

export const usePubSub = () => bus;

export const useSubscribe = (
  event: string,
  callback: (...args: any[]) => void
) => {
  useEffect(() => {
    bus.on(event, callback);
    return () => {
      bus.off(event, callback);
    };
  }, [event, callback]);
};
