import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_EVENTS = "events/LOAD_EVENTS";
export const ADD_EVENT = "events/ADD_EVENT";
export const REMOVE_EVENT = "events/REMOVE_EVENT";

/**  Action Creators: */
export const loadEvents = (events) => ({
	type: LOAD_EVENTS,
	events,
});



export const createEvent = (event) => ({
	type: ADD_EVENT,
	event,
});

export const removeEvent = (eventId) => ({
	type: REMOVE_EVENT,
	eventId,
});

/** Thunk Action Creators: */
export const getAllEvents = () => async (dispatch) => {
	const res = await csrfFetch("/api/events");
	if (res.ok) {
		const data = await res.json();
		dispatch(loadEvents(data));
		return data;
	}
};



export const addEvent = (groupId, data) => async (dispatch) => {
	const res = await csrfFetch(`/api/groups/${groupId}/events`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (res.ok) {
		const event = await res.json();
		dispatch(createEvent(event));
		return event;
	}
};

export const deleteEvent = (eventId) => async (dispatch) => {
	const res = await csrfFetch(`/api/events/${eventId}`, {
		method: "DELETE",
	});
	if (res.ok) {
		dispatch(removeEvent(eventId));
	}
};

/** Reducer: */
const initialState = {
	data: {},
	isLoading: true
};

const eventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_EVENTS: {
			const newData = { ...state.data };
			action.events.Events.forEach((event) => {
				newData[event.id] = event;
			});
			return { ...state, data: newData, isLoading: false };
		}

		case ADD_EVENT:
			return { ...state, data: { ...state.data, [action.event.id]: action.event }, isLoading: false };

		case REMOVE_EVENT: {
			const newData = { ...state.data };
			delete newData[action.eventId];
			return { ...state, data: newData, isLoading: false }
		}
		default:
			return state;
	}
};

export default eventsReducer;
