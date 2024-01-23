import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import LandingPage from "./components/LandingPage/LandingPage";
import GroupsListPage from "./components/GroupsListPage/GroupsListPage";
import GroupDetailsPage from "./components/GroupDetailsPage/GroupDetailsPage";
import CreateGroupForm from "./components/CreateGroupForm/CreateGroupForm";
import UpdateGroupForm from "./components/UpdateGroupForm/UpdateGroupForm";
import EventsListPage from "./components/EventsListPage/EventsListPage";

function Layout() {
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	return (
		<>
			<Navigation isLoaded={isLoaded} />
			{isLoaded && <Outlet />}
		</>
	);
}

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <LandingPage />,
			},
			{
				path: "/groups",
				element: <GroupsListPage />,
			},
			{
				path: "/groups/:id",
				element: <GroupDetailsPage />,
			},
			{
				path: "/groups/new",
				element: <CreateGroupForm />,
			},
			{
				path: "/groups/:id/edit",
				element: <UpdateGroupForm />,
			},
			{
				path: "/events",
				element: <EventsListPage />,
			},
			{
				path: "/events/:id",
				element: <h3>Event Details</h3>,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
