import "./CreateEventForm.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { useParams, useNavigate } from "react-router-dom";
import { addEvent } from "../../store/events";
import { addImage } from "../../store/eventImages";
import Spinner from "../Spinner/Spinner";
import { getGroup } from "../../store/groups";

function CreateEventForm() {
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [privacy, setPrivacy] = useState("");
	const [price, setPrice] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [imgUrl, setImgUrl] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState({});
	const [hasSubmitted, setHasSubmitted] = useState(false);
	const { id } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const group = useSelector((state) => state.groups.data[id]);
	const isLoaded = useSelector((state) => !state.groups.isLoading);

	let hasErrors = Object.values(errors).length === 0 ? false : true;

	const onSubmit = async (e) => {
		e.preventDefault();
		setHasSubmitted(true);
		let capacityDefault = 100;

		if (!hasErrors) {
			const createEvent = { name, type, capacity: capacityDefault, price, description, startDate, endDate };
			const createImage = { url: imgUrl, preview: true };
			const event = await dispatch(addEvent(id, createEvent)).catch(async (res) => {
				const data = await res.json();
				if (data?.errors) {
					setErrors(data.errors);
				}
			});
			if (event && event.id) {
				dispatch(addImage(event.id, createImage)).then(() => {
					navigate(`/events/${event.id}`);
				});
			}
		}
	};

	const fillFormData = (e) => {
		e.preventDefault();
		setName("Random Name");
		setType("In person");
		setPrivacy("Public");
		setPrice("100");
		setStartDate("05/03/2025 11:00 AM");
		setEndDate("05/03/2025 11:01 AM");
		setImgUrl("https://ceowatermandate.org/wp-content/plugins/ninja-forms/assets/img/no-image-available-icon-6.jpg");
		setDescription("this should have at least 50 characters as per the database so hopefully this works");
	};

	useEffect(() => {
		dispatch(getGroup(id));
	}, [dispatch, id]);

	useEffect(() => {
		const validationErrors = {};
		if (validator.isEmpty(name)) validationErrors["name"] = "Name is required";
		if (validator.isEmpty(type)) validationErrors["type"] = "Event Type is required";
		if (validator.isEmpty(privacy)) validationErrors["privacy"] = "Visibility is required";
		if (validator.isEmpty(price)) validationErrors["price"] = "Price is required";
		if (price < 0) validationErrors["priceAmount"] = "Price can't be less than 0";
		if (validator.isEmpty(startDate)) validationErrors["startDateOne"] = "Event start is required";
		if (validator.isEmpty(endDate)) validationErrors["endDateOne"] = "Event end is required";
		if (!(imgUrl.endsWith(".png") || imgUrl.endsWith(".jpg") || imgUrl.endsWith(".jpeg")))
			validationErrors["imgUrl"] = "Image URL must end with .png, .jpg, or .jpeg";
		if (description.length < 50) validationErrors["description"] = "Description must be at least 50 characters long";

		setErrors(validationErrors);
	}, [name, type, privacy, price, startDate, endDate, imgUrl, description]);

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
				<div className='grid-container'>
					<div className='grid-item'></div>
					<div className='grid-item'>
						<form onSubmit={onSubmit}>
							<div className='ceEventName'>
								<h2>{`Create an event for ${group && group.name}`}</h2>
								<label>What is the name of your event?</label>
								<input
									onChange={(e) => setName(e.target.value)}
									value={name}
									type='text'
									placeholder='Event Name'
								></input>
								{errors.name && hasSubmitted && <p className='cgError'>{errors.name}</p>}
							</div>
							<div className='ceSecondContainer'>
								<div className='ceType'>
									<label>Is this an in person or online event?</label>
									<select onChange={(e) => setType(e.target.value)} value={type}>
										<option disabled value={""}>
											(select one)
										</option>
										<option value={"In person"}>In person</option>
										<option value={"Online"}>Online</option>
									</select>
									{errors.type && hasSubmitted && <p className='cgError'>{errors.type}</p>}
								</div>
								<div className='cePrivacy'>
									<label htmlFor=''>Is this event private or public?</label>
									<select onChange={(e) => setPrivacy(e.target.value)} value={privacy}>
										<option disabled value={""}>
											(select one)
										</option>
										<option value={"Private"}>Private</option>
										<option value={"Public"}>Public</option>
									</select>
									{errors.privacy && hasSubmitted && <p className='cgError'>{errors.privacy}</p>}
								</div>
								<div className='cePrice'>
									<label>What is the price for your event?</label>
									<input onChange={(e) => setPrice(e.target.value)} value={price} type='number' placeholder='0'></input>
									{errors.price && hasSubmitted && <p className='cgError'>{errors.price}</p>}
									{errors.priceAmount && hasSubmitted && <p className='cgError'>{errors.priceAmount}</p>}
								</div>
							</div>
							<div className='ceSectionContainer'>
								<div className='ceStartContainer'>
									<div className='ceStart'>
										<label>When does your event start?</label>
										<input
											onChange={(e) => setStartDate(e.target.value)}
											value={startDate}
											type='text'
											placeholder='MM/DD/YYYY HH:mm AM'
										></input>
										{errors.startDateOne && hasSubmitted && <p className='cgError'>{errors.startDateOne}</p>}
										{errors.startDate && <p className='cgError'>{errors.startDate}</p>}
									</div>
									<i className='fa-regular fa-calendar'></i>
								</div>
								<div className='ceStartContainer'>
									<div className='ceStart'>
										<label>When does your event end?</label>
										<input
											onChange={(e) => setEndDate(e.target.value)}
											value={endDate}
											type='text'
											placeholder='MM/DD/YYYY HH:mm PM'
										></input>
										{errors.endDateOne && hasSubmitted && <p className='cgError'>{errors.endDateOne}</p>}
										{errors.endDate && <p className='cgError'>{errors.endDate}</p>}
									</div>
									<i className='fa-regular fa-calendar'></i>
								</div>
							</div>
							<div className='ceSectionContainer'>
								<div className='ceImg'>
									<label>Please add in image url for your event below:</label>
									<input
										onChange={(e) => setImgUrl(e.target.value)}
										value={imgUrl}
										type='text'
										placeholder='Image URL'
									></input>
									{errors.imgUrl && hasSubmitted && <p className='cgError'>{errors.imgUrl}</p>}
								</div>
							</div>
							<div className='ceSectionContainer'>
								<div className='ceDescription'>
									<label>Please describe your event:</label>
									<textarea
										onChange={(e) => setDescription(e.target.value)}
										value={description}
										rows={15}
										type='text'
										placeholder='Please include at least 50 characters'
									></textarea>
									{errors.description && hasSubmitted && <p className='cgError'>{errors.description}</p>}
								</div>
							</div>
							<div className='ceButton'>
								<button>Create Event</button>
							</div>
						</form>
						<div>
							<button className='fillData' onClick={fillFormData}>
								Fill Form Data(Demo purposes)
							</button>
						</div>
					</div>
					<div className='grid-item'></div>
				</div>
			)}
		</>
	);
}

export default CreateEventForm;
