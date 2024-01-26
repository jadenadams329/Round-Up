import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getGroup } from "../../store/groups";

import Spinner from "../Spinner/Spinner";

const PrivateRoute = ({ children }) => {
	const { id } = useParams();
    const dispatch = useDispatch();
	const user = useSelector((state) => state.session.user);
	const group = useSelector((state) => state.groups.data[id]);
	const isLoading = useSelector((state) => state.groups.isLoading);

	const checkIfUserIsLoggedIn = (user) => {
		return user !== null;
	};

	const checkIfUserIsGroupOwner = (user, group) => {
		return user && group && user.id === group.organizerId;
	};

	const isLoggedIn = checkIfUserIsLoggedIn(user);
	const isGroupOwner = checkIfUserIsGroupOwner(user, group);

    useEffect(() => {
        dispatch(getGroup(id))
    }, [dispatch, id])

	if (isLoading) {
		return (
			<div id='spinner'>
				<Spinner />
			</div>
		);
	}

	return isLoggedIn && isGroupOwner ? children : <Navigate to='/' />;
};

export default PrivateRoute;
