import { put, select, call } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import {
  getStoresApi,
  createStoreOrderApi,
  updateStoreOrderApi,
  getStoreContentApi,
  submitStoreOrderApi,
} from 'utils/api/requests';
import { setGlobalError } from 'pages/common/actions';
import * as ActionTypes from '../constants';
import {
  fetchStoresSuccess,
  fetchStoreContentSuccess,
  setPurchasesData,
  setPendingPurchase,
  setPendingPurchaseParticipants,
  updatePurchase,
  submitStoreOrderSuccess,
  setOrderJustSubmittedState,
  setStoresLoader,
} from '../actions';
import {
  makeSelectPendingPurchase,
  makeSelectPurchasesList,
  makeSelectPendingPurchaseParticipants,
} from '../selectors';

function* fetchStores() {
  const response = yield call(getStoresApi);
  yield put(fetchStoresSuccess(response.data));
}

function* fetchStoreContent(action) {
  yield put(setStoresLoader(true));
  const response = yield call(getStoreContentApi, action.storeId);
  yield put(fetchStoreContentSuccess(response.data));
  yield put(setStoresLoader(false));
}

function* createStoreOrder(action) {
  const storeId = action.storeId;

  const pendingPurchaseParticipants = yield select(makeSelectPendingPurchaseParticipants());
  const pendingPurchase = yield select(makeSelectPendingPurchase());

  const reqData = {
    name: pendingPurchase.name,
    storeId,
    users: pendingPurchaseParticipants,
  };

  const response = yield call(createStoreOrderApi, reqData);
  const purchasesList = yield select(makeSelectPurchasesList());
  purchasesList.unshift(response.data);

  yield put(setPurchasesData(purchasesList));
  browserHistory.push(`/?purchase=${response.data.id}`);
  yield put(setPendingPurchase(null));
  yield put(setPendingPurchaseParticipants(null));
}

function* updateStoreOrder(action) {
  const { orderId, data } = action;

  const reqData = {
    items: data.map((item) => ({
      itemId: item.id,
      number: item.amount,
      price: item.sum,
    })),
  };

  const response = yield call(updateStoreOrderApi, orderId, reqData);

  const purchase = response.data;
  yield put(updatePurchase(purchase));
}

function* submitStoreOrder(action) {
  const { orderId } = action;

  try {
    yield call(submitStoreOrderApi, orderId);
    yield put(submitStoreOrderSuccess(orderId));
    yield put(setOrderJustSubmittedState(true));
  } catch (e) {
    yield put(setGlobalError('Order can\'t be empty'));
  }
}

export default {
  fetchStores: { actionType: ActionTypes.FETCH_STORES_REQUEST, handler: fetchStores },
  fetchStoreContent: { actionType: ActionTypes.FETCH_STORE_CONTENT_REQUEST, handler: fetchStoreContent },
  createStoreOrder: { actionType: ActionTypes.CREATE_STORE_ORDER_REQUEST, handler: createStoreOrder },
  updateStoreOrder: { actionType: ActionTypes.UPDATE_STORE_ORDER_REQUEST, handler: updateStoreOrder },
  submitStoreOrder: { actionType: ActionTypes.SUBMIT_STORE_ORDER_REQUEST, handler: submitStoreOrder },
};
