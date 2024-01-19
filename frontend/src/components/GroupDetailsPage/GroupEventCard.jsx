import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEvent } from "../../store/events";

function GroupEventCard({ event }) {
	const noImgUrl =
		"https://t4.ftcdn.net/jpg/05/17/53/57/240_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg";
	const { id, startDate } = event;
	const dispatch = useDispatch();

	const eventDetails = useSelector((state) => state.events[id]);

	useEffect(() => {
		dispatch(getEvent(id));
	}, [dispatch, id]);
	return (
		<>
			<div>
				<div>
					<img src={noImgUrl}></img>
					<div>
						<h5>{startDate}</h5>
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