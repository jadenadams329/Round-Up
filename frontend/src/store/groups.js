import { csrfFetch } from "./csrf";

/** Action Type Constants: */
const LOAD_GROUPS = "groups/loadGroups";

/**  Action Creators: */
export const loadGroups = (groups) => ({
	type: LOAD_GROUPS,
	payload: groups.Groups,
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

/** Reducer: */
const initialState = {};
const groupsReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_GROUPS:
			const groupsState = {};
			action.payload.forEach((group) => {
				groupsState[group.id] = group;
			});
			return groupsState;

		default:
			return state;
	}
};

export default groupsReducer;
