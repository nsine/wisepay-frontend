import {
  SET_LOADER_STATUS,
  GET_USERS_REQUEST,
  SET_USERS_DATA,

  GET_GROUPS_REQUEST,
  SET_GROUPS_DATA,

  SET_GROUP_MODAL_STATE,

  CREATE_GROUP_REQUEST,
  UPDATE_GROUP_REQUEST,
} from './constants';

export function setLoaderStatus(data) {
  return {
    type: SET_LOADER_STATUS,
    data,
  };
}

export function getUsersRequest() {
  return {
    type: GET_USERS_REQUEST,
  };
}

export function setUsersData(data) {
  return {
    type: SET_USERS_DATA,
    data,
  };
}

export function getGroupsRequest() {
  return {
    type: GET_GROUPS_REQUEST,
  };
}

export function setGroupsData(data) {
  return {
    type: SET_GROUPS_DATA,
    data,
  };
}

export function setGroupModalState(data) {
  return {
    type: SET_GROUP_MODAL_STATE,
    data,
  };
}

export function createGroupRequest(data) {
  return {
    type: CREATE_GROUP_REQUEST,
    data,
  };
}

export function updateGroupRequest(data) {
  return {
    type: UPDATE_GROUP_REQUEST,
    data,
  };
}
