import "./GroupDetailsPage.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getGroup, getGroupEvents } from "../../store/groups";
import GroupEventCard from "./GroupEventCard";
import moment from "moment";
import DeleteGroupModal from "../DeleteGroupModal/DeleteGroupModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function GroupDetailsPage() {
	const noImgUrl = "https://t4.ftcdn.net/jpg/05/17/53/57/240_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg";
	let imgFound = false;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const group = useSelector((state) => state.groups.groupInfo[id]);
	const events = useSelector((state) => state.groups.groupEvents);
	const sessionUser = useSelector((state) => state.session.user);
	const eventList = Object.values(events);
	const Today = moment();
	const upcomingEvents = eventList.filter((event) => moment(event.startDate).isSameOrAfter(Today));
	const pastEvents = eventList.filter((event) => moment(event.endDate).isBefore(Today));
	let groupButtons;

	const callNavigate = () => {
		return navigate("/groups");
	};

	const handleUpdateClick = () => {
		navigate(`/groups/${id}/edit`);
	};

	if (sessionUser && group && sessionUser.id === group.organizerId) {
		groupButtons = (
			<>
				<button className='gdpButtons'>Create event</button>
				<button className='gdpButtons' onClick={handleUpdateClick}>
					Update
				</button>
				<OpenModalButton
					cssClass={"gdpButtons"}
					buttonText='Delete'
					modalComponent={<DeleteGroupModal groupId={id} navigate={callNavigate} />}
				/>
			</>
		);
	} else {
		groupButtons = (
			<>
				<button className='gdpButtons'>Join this group</button>
			</>
		);
	}

	useEffect(() => {
		dispatch(getGroup(id));
		dispatch(getGroupEvents(id));
	}, [dispatch, id]);

	return (
		<>
			<div className='gdpContainer'>
				<div></div>
				<div className='gdpTopSection'>
					<div className='gdpTopLeft'>
						<Link className='gdpGroupLink' to={"/groups"}>{`< Groups`}</Link>
						{group &&
							group.GroupImages &&
							group.GroupImages.map((image) => {
								if (image.url && image.preview) {
									imgFound = true;
									return <img className='gdpImg' key={image.id} src={image.url} alt='Group' />;
								}
							})}
						{!imgFound && <img className='gdpImg' src={noImgUrl} alt='No Image Available' />}
					</div>
					<div className='gdpTopRight'>
						<div className='gdpTRInfo'>
							<h2>{group?.name}</h2>
							<span>{group ? `${group.city}, ${group.state}` : null}</span>
							<span>
								{group &&
									eventList &&
									`${eventList.length} ${eventList.length === 1 ? "event" : "events"} - ${
										group.private ? "Private" : "Public"
									}`}
							</span>
							<span>
								{group && group.Organizer
									? `Organized by: ${group.Organizer.firstName} ${group.Organizer.lastName}`
									: null}
							</span>
						</div>
						<div className='gdpButtonsDiv'>{groupButtons}</div>
					</div>
				</div>
				<div></div>

				<div className='gdpBottomSection'></div>
				<div className='gdpBottomSection'>
					<div className='gdpBSContent'>
						<div className='gdpOrganzier'>
							<h3>Organizer</h3>
							<p>{group && group.Organizer ? `${group.Organizer.firstName} ${group.Organizer.lastName}` : null}</p>
						</div>
						<div className='gdpAbout'>
							<h3>What we&apos;re about</h3>
							<p>{group && group.about}</p>
						</div>
						<div className='gdpUEvents'>
							{upcomingEvents.length > 0 && (
								<>
									<h3>Upcoming Events ({upcomingEvents.length})</h3>
									{upcomingEvents.map((event) => (
										<GroupEventCard key={event.id} event={event} />
									))}
								</>
							)}

							{upcomingEvents.length === 0 && (
								<>
									<h3>No Upcoming Events</h3>
								</>
							)}
						</div>
						<div className="gpdPEvents">
							{pastEvents.length > 0 && (
								<>
									<h3>Past Events ({pastEvents.length})</h3>
									{pastEvents.map((event) => (
										<GroupEventCard key={event.id} event={event} />
									))}
								</>
							)}
						</div>
					</div>
				</div>
				<div className='gdpBottomSection'></div>
			</div>
		</>
	);
}

export default GroupDetailsPage;
