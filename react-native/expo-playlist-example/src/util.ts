import { useLayoutEffect, useRef, type MutableRefObject } from "react";

type LatestRefObject<T> = Readonly<MutableRefObject<T>>;

export function useLatestRef<T>(value: T): LatestRefObject<T> {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

function padWithZero(number: number): string {
  return number.toString().padStart(2, "0");
}

export function getMMSSFromMillis(millis: number): string {
  const totalSeconds = millis / 1000;
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor(totalSeconds / 60);
  return padWithZero(minutes) + ":" + padWithZero(seconds);
}
