import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_EVENTS = "events/LOAD_EVENTS";
export const RECEIVE_EVENT = "events/RECEIVE_EVENT";
export const ADD_EVENT = "events/ADD_EVENT";
export const REMOVE_EVENT = "events/REMOVE_EVENT";

/**  Action Creators: */
export const loadEvents = (events) => ({
	type: LOAD_EVENTS,
	events,
});

export const receiveEvent = (event) => ({
	type: RECEIVE_EVENT,
	event,
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

export const getEvent = (eventId) => async (dispatch) => {
	const res = await csrfFetch(`/api/events/${eventId}`);
	if (res.ok) {
		const data = await res.json();
		dispatch(receiveEvent(data));
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
	eventsInfo: {},
	eventDetails: {},
};

const eventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_EVENTS: {
			const newState = {};
			action.events.Events.forEach((event) => {
				newState[event.id] = event;
			});
			return { ...state, eventsInfo: newState };
		}

		case RECEIVE_EVENT:
			return { ...state, eventDetails: { ...state.eventDetails, [action.event.id]: action.event } };

		case ADD_EVENT:
			return { ...state, eventsInfo: { ...state.eventsInfo, [action.event.id]: action.event } };

		case REMOVE_EVENT: {
			const newState = { ...state };
			delete newState.eventsInfo[action.eventId];
			return newState;
		}

		default:
			return state;
	}
};

export default eventsReducer;
