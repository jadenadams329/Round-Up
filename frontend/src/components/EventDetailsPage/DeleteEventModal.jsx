import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteEvent } from "../../store/events";
import { getGroupEvents } from "../../store/groupEvents";

function DeleteEventModal({eventId, navigate, groupId}) {
    const { closeModal } = useModal();
	const dispatch = useDispatch();
    const handleDelete = async (e) => {
		e.preventDefault();
		try {
			dispatch(deleteEvent(eventId))
				.then(() => {
					dispatch(getGroupEvents(groupId))
				})

			closeModal();
            navigate();
		} catch (err) {

			console.log(err);
		}
	};
  return (
    <>
			<div className="dgmContainer">
				<div className="dgmInfo">
					<h2>Confirm Delete</h2>
					<p>Are you sure you want to remove this Event?</p>
				</div>
				<div className="dgmButtons">
					<button className="dgmButtonTop" onClick={handleDelete}>Yes (Delete Event) </button>
					<button className="dgmButtonBottom" onClick={closeModal}>No (Keep Event) </button>
				</div>
			</div>
		</>
  )
}

export default DeleteEventModal
