import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteEventModal from "./DeleteEventModal";
import { useSelector } from "react-redux";

function EventDetailsInfo({ group, event, navigate }) {
	const sessionUser = useSelector((state) => state.session.user);
	let eventButtons;
	if (sessionUser && group && sessionUser.id === group.organizerId) {
		eventButtons = (
			<>
				<button className='gdpButtons'>Update</button>
				<OpenModalButton
					cssClass={"gdpButtons"}
					buttonText='Delete'
					modalComponent={<DeleteEventModal eventId={event.id} navigate={navigate} />}
				/>
			</>
		);
	} else {
		eventButtons = <></>;
	}
	return (
		<>
			<div className='ediContainer'>
				<div className='ediTimeContainer'>
					<i className='fa-regular fa-clock'></i>
					<div className='ediTime'>
						<div>
							<p>{`START`}</p>
							<p>{`END`}</p>
						</div>
						<div>
							<p>{`${
								event &&
								event.startDate.split(" ").slice(0, 1).concat("·").concat(event.startDate.split(" ").slice(1)).join(" ")
							}`}</p>
							<p>{`${
								event &&
								event.endDate.split(" ").slice(0, 1).concat("·").concat(event.endDate.split(" ").slice(1)).join(" ")
							}`}</p>
						</div>
					</div>
				</div>
				<div className='ediPrice'>
					<i className='fa-light fa-dollar-sign'></i>
					<p>{event && event.price === 0 ? "FREE" : event.price}</p>
				</div>
				<div className='ediType'>
					<i className='fa-sharp fa-solid fa-map-pin'></i>
					<p>{event && event.type}</p>

					<div>{eventButtons}</div>
				</div>
			</div>
		</>
	);
}

export default EventDetailsInfo;
