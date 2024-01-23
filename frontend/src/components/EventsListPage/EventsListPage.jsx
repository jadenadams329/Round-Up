import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../store/events";
import EventListCard from "./EventListCard";
import Spinner from "../Spinner/Spinner";

function EventsListPage() {
	const dispatch = useDispatch();
	const events = useSelector((state) => state.events);
	const eventList = Object.values(events.eventsState);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(getAllEvents()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	return (
		<>
			<div className='glpGridContainer'>
				<div className='glpCol'></div>
				<div className='glpMenuContainer'>
					<div className='glpMenu'>
						<h2 className='glpMenuActive'>Events</h2>
						<h2>
							<Link className='glpMenuEvents' to='/groups'>
								Groups
							</Link>
						</h2>
					</div>
					<p className='glpMenuP'>Events in Roundup</p>
					<div id='spinner'>{!isLoaded && <Spinner />}</div>

					{isLoaded &&
						eventList &&
						eventList.map((event) => (
							<Link className='glpCardLink' key={event.id} to={`/events/${event.id}`}>
								<EventListCard eventId={event.id} key={event.id} />
							</Link>
						))}
				</div>
				<div className='glpCol'></div>
			</div>
		</>
	);
}

export default EventsListPage;
