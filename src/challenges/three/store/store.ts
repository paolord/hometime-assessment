import { configureStore, createSlice } from "@reduxjs/toolkit";

export enum TimerState {
  Start,
  Pause,
  Reset
}

export const timerStateSlice = createSlice({
  name: "timerState",
  initialState: {
    value: TimerState.Reset
  },
  reducers: {
    start: (state) => {
      state.value = TimerState.Start;
    },
    pause: (state) => {
      state.value = TimerState.Pause;
    },
    reset: (state) => {
      state.value = TimerState.Reset;
    }
  }
});

export const { start, pause, reset } = timerStateSlice.actions;

export default configureStore({
  reducer: {
    timerState: timerStateSlice.reducer
  }
});
