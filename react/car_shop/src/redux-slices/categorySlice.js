import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    isLoading: false,
    categories: {'results':[]},
    error: 'no error'
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers:{
    setCategories: (state, action) => {
      state.categories = action.payload.data
    },
    setIsLoading: (state, action) => {
        state.isLoading = action.payload.data
    }
  }
})

export const { setCategories, setIsLoading } = categorySlice.actions;
export default categorySlice.reducer