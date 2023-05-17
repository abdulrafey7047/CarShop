import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    isLoading: false,
    adds_data: {'results':[]},
    error: 'no error',
    searchFieldValue: '',
}

export const advertismentSlice = createSlice({
  name: 'advertisment',
  initialState,
  reducers:{
    setAdvertisments: (state, action) => {
      state.adds_data = action.payload.data
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setsearchFieldValue: (state, action) => {
      state.searchFieldValue = action.payload
    },
  }
})

export const { setAdvertisments, setIsLoading, setsearchFieldValue } = advertismentSlice.actions;
export default advertismentSlice.reducer
