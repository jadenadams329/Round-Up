import { csrfFetch } from "./csrf";

export const RECEIVE_EVENT_DETAILS = "eventDetails/RECEIVE_EVENT";

export const receiveEventDetails = (event) => ({
	type: RECEIVE_EVENT_DETAILS,
	event,
});

export const getEventDetails = (eventId) => async (dispatch) => {
	const res = await csrfFetch(`/api/events/${eventId}`);
	if (res.ok) {
		const data = await res.json();
		dispatch(receiveEventDetails(data));
		return data;
	}
};

/** Reducer: */
const initialState = {
	data: {},
	isLoading: true
};

const eventDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_EVENT_DETAILS:
            return { ...state, data: { ...state.data, [action.event.id]: action.event }, isLoading: false };
        default:
            return state;
    }
}
export default eventDetailsReducer;
