import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEvent } from "../../store/events";
import "./EventListCard.css";

function EventListCard({ eventId }) {
	const dispatch = useDispatch();
	const noImgUrl = "https://t4.ftcdn.net/jpg/05/17/53/57/240_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg";
	const eventDetails = useSelector((state) => state.events[eventId]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(getEvent(eventId)).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch, eventId]);

	return (
		<>
			{isLoaded && (
				<div className='elcContainer'>
					<div className='elcTop'>
						<div className='glcImg'>
							<img src={noImgUrl}></img>
						</div>
						<div className='elcTopRight'>
							<h5>{eventDetails && eventDetails.startDate}</h5>
							<h2>{eventDetails && eventDetails.name}</h2>
							<span>
								{eventDetails && eventDetails.type === "Online"
									? "Online"
									: eventDetails && eventDetails.Venue
									? `${eventDetails && eventDetails.Venue.address}, ${eventDetails && eventDetails.Venue.city}, ${
											eventDetails && eventDetails.Venue.state
									  }`
									: "No Location Yet"}
							</span>
						</div>
					</div>
					<p>{eventDetails && eventDetails.description}</p>
				</div>
			)}
		</>
	);
}

export default EventListCard;
