import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const RECEIVE_GROUP = "groups/RECEIVE_GROUP";
export const RECEIVE_GROUP_EVENTS = "groups/RECEIVE_GROUP_EVENTS"

/**  Action Creators: */
export const loadGroups = (groups) => ({
	type: LOAD_GROUPS,
	payload: groups.Groups,
});

export const receiveGroup = (group) => ({
	type: RECEIVE_GROUP,
	group,
});

export const receiveGroupEvents = (events) => ({
	type: RECEIVE_GROUP_EVENTS,
	payload: events.Events
})

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

export const getGroupEvents = (groupId) => async dispatch => {
	const res = await csrfFetch(`/api/groups/${groupId}/events`)
	if(res.ok){
		const data = await res.json();
		dispatch(receiveGroupEvents(data));
		return data
	}
}

/** Reducer: */
const initialState = {
	groupInfo: {},
	groupEvents: {}
};
const groupsReducer = (state = initialState, action) => {
	switch (action.type) {

		case LOAD_GROUPS: {
			const groupsState = {};
			action.payload.forEach((group) => {
				groupsState[group.id] = group;
			});
			return { ...state, groupInfo: groupsState };
		}

		case RECEIVE_GROUP:
			return { ...state, groupInfo: { ...state.groupInfo, [action.group.id]: action.group } };

		case RECEIVE_GROUP_EVENTS: {
			const groupEventsState = {}
			action.payload.forEach((event) => {
				groupEventsState[event.id] = event
			})
			return { ...state, groupEvents: groupEventsState }
		}

		default:
			return state;
	}
};

export default groupsReducer;
