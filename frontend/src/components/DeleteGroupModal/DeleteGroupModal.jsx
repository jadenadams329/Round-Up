import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteGroup } from "../../store/groups";
import { useState } from "react";


function DeleteGroupModal({ groupId, navigate }) {
	const { closeModal } = useModal();
	const dispatch = useDispatch();
	const [errors, setErrors] = useState({});

	const handleDelete = async (e) => {
		e.preventDefault();
        setErrors({});
		try {
			dispatch(deleteGroup(groupId));
			closeModal();
			navigate()
		} catch (res) {
			const data = await res.json();
			if (data) {
				setErrors(data);
			}
            console.log(errors)
		}
	};

	return (
		<>
			<h2>Confirm Delete</h2>
			<p>Are you sure you want to remove this group?</p>
			<button onClick={handleDelete}>Yes (Delete Group) </button>
			<button onClick={closeModal}>No (Keep Group) </button>
		</>
	);
}

export default DeleteGroupModal;
