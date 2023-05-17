import { call, takeEvery, put } from 'redux-saga/effects'

import sagaActions from './sagaActions'

import { setCategories } from '../redux-slices/categorySlice'
import { setAdvertisments, setIsLoading } from '../redux-slices/advertismentSlice'

import axiosInstance from '../custom_axios'


function* fetchAdvertismentsSaga(action) {

    yield put(setIsLoading(true))
    try {
        let response = yield call(() =>
            axiosInstance.get(`advertisments${action.payload.filterString}`).
            then((response) => {
              return response
            })
        )
        yield put(setAdvertisments(response))
        yield put(setIsLoading(false))
    }catch (error) {
        yield put(setIsLoading(false))
        console.log('ERROR in fetchAdvertismentsSaga: ', error)
    }
}


function* fetchCategoriesSaga(action) {

    let url = ''
    if (action.payload) url = `/categories/${action.payload.filterString}`
    else url = '/categories/'

    try {
        let response = yield call(() =>
            axiosInstance.get(url).
            then((response) => {
              return response
            })
        )
        yield put(setCategories(response))
    }catch (error) {
        yield put(setIsLoading(false))
        console.log('ERROR in fetchAdvertismentsSaga: ', error)
    }
}


function* rootSaga() {
    yield takeEvery(sagaActions.FETCH_ADVERTISMENT_SAGA, fetchAdvertismentsSaga)
    yield takeEvery(sagaActions.FETCH_CATEGORIES_SAGA, fetchCategoriesSaga)
}

export {fetchAdvertismentsSaga, setIsLoading}
export default rootSaga;
