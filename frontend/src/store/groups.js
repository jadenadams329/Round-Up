import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const RECEIVE_GROUP = "groups/RECEIVE_GROUP";

export const ADD_GROUP = "groups/ADD_GROUP";
export const UPDATE_GROUP = "groups/UPDATE_GROUP";
export const REMOVE_GROUP = "groups/REMOVE_GROUP";

/**  Action Creators: */
export const loadGroups = (groups) => ({
	type: LOAD_GROUPS,
	payload: groups.Groups,
});

export const receiveGroup = (group) => ({
	type: RECEIVE_GROUP,
	group,
});



export const createGroup = (group) => ({
	type: ADD_GROUP,
	group,
});

export const editGroup = (group) => ({
	type: UPDATE_GROUP,
	group,
});

export const removeGroup = (groupId) => ({
	type: REMOVE_GROUP,
	groupId,
});

/** Thunk Action Creators: */
export const getAllGroups = () => async (dispatch) => {
	const res = await csrfFetch("/api/groups");
	if (res.ok) {
		const data = await res.json();
		dispatch(loadGroups(data));
		return data;
	}
};

export const getGroup = (groupId) => async (dispatch) => {
	const res = await csrfFetch(`/api/groups/${groupId}`);
	if (res.ok) {
		const data = await res.json();
		dispatch(receiveGroup(data));
		return data;
	}
};



export const addGroup = (data) => async (dispatch) => {
	const res = await csrfFetch("/api/groups", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (res.ok) {
		const group = await res.json();
		dispatch(createGroup(group));
		return group;
	}
};

export const updateGroup = (groupId, data) => async (dispatch) => {
	const res = await csrfFetch(`/api/groups/${groupId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (res.ok) {
		const group = await res.json();
		dispatch(editGroup(group));
		return group;
	}
};

export const deleteGroup = (groupId) => async (dispatch) => {
	const res = await csrfFetch(`/api/groups/${groupId}`, {
		method: "DELETE",
	});
	if (res.ok) {
		dispatch(removeGroup(groupId));
	}
};

/** Reducer: */
const initialState = {
	isLoading: true,
	data: {}
};

const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_GROUPS: {
			const groupsState = {};
			action.payload.forEach((group) => {
				groupsState[group.id] = group;
			});
			return { ...state, data: groupsState, isLoading: false };
		}

		case RECEIVE_GROUP:
			return { ...state, data: { ...state.data, [action.group.id]: action.group }, isLoading: false };

		case ADD_GROUP:
			return { ...state, data: { ...state.data, [action.group.id]: action.group }, isLoading: false };

		case UPDATE_GROUP:
			return { ...state, data: { ...state.data, [action.group.id]: action.group }, isLoading: false };

		case REMOVE_GROUP: {
			const newState = {...state}
			delete newState.data[action.groupId]
			return { ...newState, isLoading: false }
		}

		default:
			return state;
	}
};

export default groupsReducer;
