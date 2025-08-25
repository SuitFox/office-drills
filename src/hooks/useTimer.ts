import { useState, useEffect, useCallback } from 'react';
import { TimerState } from '../types';

export function useTimer(initialTime: number) {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    timeRemaining: initialTime,
    nextBreakTime: null
  });

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      nextBreakTime: Date.now() + (prev.timeRemaining * 1000)
    }));
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: true
    }));
  }, []);

  const resume = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPaused: false,
      nextBreakTime: Date.now() + (prev.timeRemaining * 1000)
    }));
  }, []);

  const stop = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      nextBreakTime: null
    }));
  }, []);

  const reset = useCallback((newTime?: number) => {
    setState(prev => ({
      ...prev,
      timeRemaining: newTime ?? initialTime,
      isRunning: false,
      isPaused: false,
      nextBreakTime: null
    }));
  }, [initialTime]);

  const snooze = useCallback((minutes: number) => {
    const snoozeTime = minutes * 60;
    setState(prev => ({
      ...prev,
      timeRemaining: snoozeTime,
      nextBreakTime: Date.now() + (snoozeTime * 1000)
    }));
  }, []);

  // Timer effect
  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      const id = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            return {
              ...prev,
              timeRemaining: 0,
              isRunning: false,
              isPaused: false,
              nextBreakTime: null
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
      
      setIntervalId(id);
      return () => clearInterval(id);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [state.isRunning, state.isPaused, intervalId]);

  return {
    ...state,
    start,
    pause,
    resume,
    stop,
    reset,
    snooze
  };
}