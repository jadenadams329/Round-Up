import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteEventModal from "./DeleteEventModal";

function EventDetailsInfo({ event, navigate }) {
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
							<p>{`${event && event.startDate}`}</p>
							<p>{`${event && event.endDate}`}</p>
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
					<div>
						<OpenModalButton
							cssClass={"gdpButtons"}
							buttonText='Delete'
							modalComponent={<DeleteEventModal eventId={event.id} navigate={navigate} />}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default EventDetailsInfo;
