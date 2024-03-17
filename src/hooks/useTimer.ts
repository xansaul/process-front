import { useEffect, useState } from "react";
import { TimerState } from "../interfaces/Timer";

export const useTimer = (): [TimerState, () => void, () => void, () => void] => {
  const [timerObj, setTimerObj] = useState<TimerState>({
    timer: 0,
    initTimer: false,
    paused: false,
  });

  useEffect(() => {
    if (!timerObj.initTimer || timerObj.paused) return;

    const intervalId = setInterval(() => {
      setTimerObj((prev) => ({
        ...prev,
        timer: prev.timer + 1,
      }));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timerObj.initTimer, timerObj.paused]);

  const initTimer = () => {
    setTimerObj((prev) => ({
      ...prev,
      initTimer: true,
    }));
  };

  const pauseTimer = () => {
    setTimerObj((prev) => ({
      ...prev,
      paused: true,
    }));
  };

  const playTimer = () => {
    setTimerObj((prev) => ({
      ...prev,
      paused: false,
    }));
  };


  return [timerObj, initTimer, pauseTimer,playTimer];
};
