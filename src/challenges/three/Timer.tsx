import { Button, HStack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import store, { TimerState, start, pause, reset } from "./store/store";
import { Provider, useDispatch, useSelector } from "react-redux";

type TimerProps = {
  children: JSX.Element;
};

export default function Timer({ children }: TimerProps) {
  return <Provider store={store}>{children}</Provider>;
}

export function TimerDisplay() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [tenths, setTenths] = useState(0);
  const [running, setRunning] = useState(false);

  const timerState = useSelector((state: any) => state.timerState.value);

  useEffect(() => {
    setRunning(false);
    setMinutes(0);
    setSeconds(0);
    setTenths(0);
  }, []);

  useEffect(() => {
    if (timerState === TimerState.Start) {
      setRunning(true);
    } else if (timerState === TimerState.Pause) {
      setRunning(false);
    } else if (timerState === TimerState.Reset) {
      setMinutes(0);
      setSeconds(0);
      setTenths(0);
      setRunning(false);
    }
  }, [timerState]);

  useInterval(
    () => {
      let nextTenths = tenths + 1;
      if (nextTenths === 10) {
        let nextSeconds = seconds + 1;
        if (nextSeconds === 60) {
          setMinutes(minutes + 1);
          setSeconds(0);
        } else {
          setSeconds(nextSeconds);
        }
        setTenths(0);
      } else {
        setTenths(nextTenths);
      }
    },
    running ? 100 : null
  );

  return (
    <Text
      fontSize="7xl"
      color="gray.600"
      sx={{
        fontVariantNumeric: "tabular-nums"
      }}
    >
      {minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}
      :
      {seconds.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      })}
      :{tenths}
    </Text>
  );
}

export function TimerControls() {
  const [startActive, setStartActive] = useState(false);
  const [pauseActive, setPauseActive] = useState(false);
  const [resetActive, setResetActive] = useState(false);
  const [timerState, setTimerState] = useState(TimerState.Reset);

  const dispatch = useDispatch();

  useEffect(() => {
    // on mount
    setTimerState(TimerState.Reset);
  }, []);

  useEffect(() => {
    if (timerState === TimerState.Reset) {
      setStartActive(true);
      setPauseActive(false);
      setResetActive(false);
    } else if (timerState === TimerState.Start) {
      setStartActive(false);
      setPauseActive(true);
      setResetActive(true);
    } else if (timerState === TimerState.Pause) {
      setStartActive(true);
      setPauseActive(false);
      setResetActive(true);
    }
  }, [startActive, pauseActive, resetActive, timerState]);

  return (
    <HStack>
      <Button
        colorScheme="green"
        onClick={() => {
          setTimerState(TimerState.Start);
          dispatch(start());
        }}
        hidden={!startActive}
      >
        Start
      </Button>
      <Button
        colorScheme="red"
        onClick={() => {
          setTimerState(TimerState.Pause);
          dispatch(pause());
        }}
        hidden={!pauseActive}
      >
        Pause
      </Button>
      <Button
        onClick={() => {
          setTimerState(TimerState.Reset);
          dispatch(reset());
        }}
        hidden={!resetActive}
      >
        Reset
      </Button>
    </HStack>
  );
}
