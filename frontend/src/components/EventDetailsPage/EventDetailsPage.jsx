import "./EventDetailsPage.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEvent } from "../../store/events";
import { getGroup } from "../../store/groups";
import Spinner from "../Spinner/Spinner";
import EventDetailsGroupCard from "./EventDetailsGroupCard";
import EventDetailsInfo from "./EventDetailsInfo";

function EventDetailsPage() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);
	const eventDetails = useSelector((state) => state.events.eventDetails[id]);
	const group = useSelector((state) => state.groups.groupInfo[eventDetails?.groupId]);

	useEffect(() => {
		dispatch(getEvent(id));
		dispatch(getGroup(eventDetails?.groupId)).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch, id, eventDetails?.groupId]);

	if (!isLoaded) {
		return (
			<div id='spinner'>
				<Spinner />
			</div>
		);
	}
	return (
		<>
			{isLoaded && (
				<div className='edp-grid-container'>
					<div className='edp-item1'></div>
					<div className='edp-item2'></div>
					<div className='edp-item3'>
						<Link to={"/events"}>{`< Events`}</Link>
						<h2>{eventDetails && eventDetails.name}</h2>
						<p>{`Hosted by ${group && group.Organizer.firstName} ${group && group.Organizer.lastName}`}</p>
					</div>
					<div className='edp-item4'></div>
					<div className='edp-item5'></div>
					<div className='edp-item6'>
						<div className='edpEventImg'>
							<img src={eventDetails && eventDetails.EventImages[0].url}></img>
						</div>
						<div className='edpInfo'>
							<Link className='edpCardLink' to={`/groups/${group.id}`}>
								<EventDetailsGroupCard group={group} />
							</Link>
							<EventDetailsInfo event={eventDetails} />
						</div>
					</div>
					<div className='edp-item10'>
						<h3>Details</h3>
						<p>{eventDetails && eventDetails.description}</p>
					</div>
					<div className='edp-item'></div>
				</div>
			)}
		</>
	);
}

export default EventDetailsPage;
