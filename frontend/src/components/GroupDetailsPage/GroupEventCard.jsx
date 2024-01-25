import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEvent } from "../../store/events";
import "./GroupEventCard.css";

function GroupEventCard({ event }) {
	const { id, startDate } = event;
	const dispatch = useDispatch();
	let dateTime = startDate.split(" ");
	dateTime.splice(1, 0, "·");
	dateTime = dateTime.join(" ");

	const eventDetails = useSelector((state) => state.events.eventDetails[id]);

	useEffect(() => {
		dispatch(getEvent(id));
	}, [dispatch, id]);
	return (
		<>
			<div className='gecContainer'>
				<div className='gecTop'>
					<img src={event && event.previewImage}></img>
					<div className='gecTopRight'>
						<h5>{dateTime}</h5>
						<h4>{eventDetails && eventDetails.name}</h4>
						<span>
							{eventDetails && eventDetails.type === "Online"
								? "Online"
								: eventDetails && eventDetails.Venue
								? `${eventDetails.Venue.address}, ${eventDetails.Venue.city}, ${eventDetails.Venue.state}`
								: "No Location Yet"}
						</span>
					</div>
				</div>
				<p>{eventDetails && eventDetails.description}</p>
			</div>
		</>
	);
}

export default GroupEventCard;
