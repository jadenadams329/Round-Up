import { csrfFetch } from "./csrf";

/** Action Type Constants: */
export const CREATE_IMAGE = "groupImages/CREATE_IMAGE";

/**  Action Creators: */
export const createImage = (image) => ({
	type: CREATE_IMAGE,
	image,
});

/** Thunk Action Creators: */
export const addImage = (groupId, data) => async (dispatch) => {
	const res = await csrfFetch(`/api/groups/${groupId}/images`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

    if (res.ok) {
        const img = await res.json();
        dispatch(createImage(img))
        return img
    }
};

/** Reducer: */
const initialState = {};

const groupImagesReducer = (state = initialState, action) => {
	switch (action.type) {
		case CREATE_IMAGE:
			return { ...state, [action.image.id]: action.image };

		default:
			return state;
	}
};

export default groupImagesReducer;
