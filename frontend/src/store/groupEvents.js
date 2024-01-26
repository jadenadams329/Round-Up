import { csrfFetch } from "./csrf";

export const RECEIVE_GROUP_EVENTS = "groupEvents/RECEIVE_GROUP_EVENTS";

export const receiveGroupEvents = (events) => ({
	type: RECEIVE_GROUP_EVENTS,
	payload: events.Events,
});

export const getGroupEvents = (groupId) => async (dispatch) => {
	const res = await csrfFetch(`/api/groups/${groupId}/events`);
	if (res.ok) {
		const data = await res.json();
		dispatch(receiveGroupEvents(data));
		return data;
	}
};

const initialState = {
	data: {},
	isLoading: true,
};

const groupEventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case RECEIVE_GROUP_EVENTS: {
			const groupEvents = {};
			action.payload.forEach((event) => {
				groupEvents[event.id] = event;
			});
			return { ...state, data: groupEvents };
		}
		default:
			return state;
	}
};

export default groupEventsReducer;
