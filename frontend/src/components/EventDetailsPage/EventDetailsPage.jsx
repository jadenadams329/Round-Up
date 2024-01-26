import "./EventDetailsPage.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getEventDetails } from "../../store/eventDetails";
import { getGroup } from "../../store/groups";
import Spinner from "../Spinner/Spinner";
import EventDetailsGroupCard from "./EventDetailsGroupCard";
import EventDetailsInfo from "./EventDetailsInfo";

function EventDetailsPage() {

	const noImgUrl = "https://t4.ftcdn.net/jpg/05/17/53/57/240_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg";
	const { id } = useParams();
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false)
	const eventDetails = useSelector((state) => state.eventDetails.data[id]);
	const group = useSelector((state) => state.groups.data[eventDetails?.groupId]);
	const navigate = useNavigate();
	const imageUrl = eventDetails && eventDetails.EventImages.length > 0 ? eventDetails.EventImages[0].url : noImgUrl;

	const callNavigate = () => {
		return navigate(`/groups/${eventDetails.groupId}`);
	};

	useEffect(() => {
		dispatch(getEventDetails(id));
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
						<p>{group && group.Organizer && `Hosted by ${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
					</div>
					<div className='edp-item4'></div>
					<div className='edp-item5'></div>
					<div className='edp-item6'>
						<div className='edpEventImg'>
							<img src={imageUrl}></img>
						</div>
						<div className='edpInfo'>
							<Link className='edpCardLink' to={`/groups/${group.id}`}>
								<EventDetailsGroupCard group={group} />
							</Link>
							<EventDetailsInfo group={group} event={eventDetails} navigate={callNavigate} />
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
