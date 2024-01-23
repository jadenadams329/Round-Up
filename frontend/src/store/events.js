import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const LOAD_EVENTS = "events/LOAD_EVENTS";
export const RECEIVE_EVENT = "events/RECEIVE_EVENT";

/**  Action Creators: */
export const loadEvents = (events) => ({
	type: LOAD_EVENTS,
	payload: events.Events,
});

export const receiveEvent = (event) => ({
	type: RECEIVE_EVENT,
	event,
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

/** Reducer: */
const initialState = {};

const eventsReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_EVENTS: {
			const eventsState = {};
			action.payload.forEach((event) => {
				eventsState[event.id] = event;
			});
			return { ...state, eventsState };
		}

		case RECEIVE_EVENT:
			return { ...state, [action.event.id]: action.event };

		default:
			return state;
	}
};

export default eventsReducer;
