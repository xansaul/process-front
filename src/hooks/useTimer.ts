import { useEffect, useState } from "react";
import { TimerState } from "../interfaces/Timer";

export const useTimer = (velocity: number): [TimerState, () => void, () => void, () => void] => {
  const [timerObj, setTimerObj] = useState<TimerState>({
    timer: 0,
    initTimer: false,
    is_paused: false,
  });

  useEffect(() => {
    if (!timerObj.initTimer || timerObj.is_paused) return;

    const intervalId = setInterval(() => {
      setTimerObj((prev) => ({
        ...prev,
        timer: prev.timer + 1,
      }));
    }, velocity);

    return () => {
      clearInterval(intervalId);
    };
  }, [timerObj.initTimer, timerObj.is_paused]);

  const initTimer = () => {
    setTimerObj((prev) => ({
      ...prev,
      initTimer: true,
    }));
  };

  const pauseTimer = () => {
    setTimerObj((prev) => ({
      ...prev,
      is_paused: true,
    }));
  };

  const playTimer = () => {
    setTimerObj((prev) => ({
      ...prev,
      is_paused: false,
    }));
  };


  return [timerObj, initTimer, pauseTimer,playTimer];
};
