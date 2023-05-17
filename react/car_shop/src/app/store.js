import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import saga from './sagas'

import advertismentReducer from '../redux-slices/advertismentSlice'
import categoryReducer from '../redux-slices/categorySlice'


let sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]


export default configureStore({
  reducer: {
    adds: advertismentReducer,
    categories: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
})

sagaMiddleware.run(saga)
