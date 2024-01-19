import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import validator from "validator";
import { addGroup } from "../../store/groups";
import { addImage } from "../../store/groupImages";
import { useNavigate } from "react-router-dom";

function CreateGroupForm() {
	const [location, setLocation] = useState("");
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [privacy, setPrivacy] = useState("");
	const [type, setType] = useState("");
	const [imgUrl, setImgUrl] = useState("");
    const [errors, setErrors] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false)
	const dispatch = useDispatch();
	const navigate = useNavigate();


    let hasErrors = Object.values(errors).length === 0 ? false : true;

	const handleLocation = (location) => {
		let cityState = location.split(",");
		return cityState;
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setHasSubmitted(true)
        console.log(imgUrl)
        let isPrivate = privacy === "Private" ? true : false
		if (!hasErrors) {
			let groupLocation = handleLocation(location);

			const createGroup = {
				name,
				about,
				type,
				private: isPrivate,
				city: groupLocation[0],
				state: groupLocation[1],
			};

			const group = await dispatch(addGroup(createGroup));

			if (group) {
				const createImage = {
					url: imgUrl,
					preview: true,
				};
				dispatch(addImage(group.id, createImage));
			}
            resetForm()
            navigate(`/groups/${group.id}`)
		}
	};

	const resetForm = () => {
		setName("");
		setLocation("");
		setAbout("");
		setType("");
		setPrivacy("");
		setImgUrl("");
		setHasSubmitted(false)
		hasErrors = false;
	};

	useEffect(() => {
		const validationErrors = {};
		if (validator.isEmpty(location)) validationErrors["location"] = "Location is required";
		if (!location.includes(","))
			validationErrors["locationFormat"] = "Please put a comma (,) between the city and state";
		if (validator.isEmpty(name)) validationErrors["name"] = "Name is required";
		if (about.length < 30) validationErrors["about"] = "Description must be at least 30 characters long";
		if (validator.isEmpty(privacy)) validationErrors["privacy"] = "Visability Type is required";
		if (validator.isEmpty(type)) validationErrors["type"] = "Group Type is required";
		if (!(imgUrl.endsWith(".png") || imgUrl.endsWith(".jpg") || imgUrl.endsWith(".jpeg")))
			validationErrors["imgUrl"] = "Image URL must end with .png, .jpg, or .jpeg";
        setErrors(validationErrors)
        console.log(imgUrl)
	}, [location, name, about, privacy, type, imgUrl]);

	return (
		<>
			<form onSubmit={onSubmit}>
				<div>
					<h4>BECOME AN ORGANIZER</h4>
					<h2>We&apos;ll walk you through a few steps to build your local community</h2>
				</div>
				<div>
					<h2>First, set your group&apos;s location</h2>
					<p>
						Meetup groups meet locally, in person and online. We&apos;ll connect you with people in your area, and more can
						join you online.
					</p>
					<input
						type='text'
						onChange={(e) => setLocation(e.target.value)}
						value={location}
						placeholder='City, STATE'
						name='location'
					></input>
                    {errors.location && hasSubmitted && <p>{errors.location}</p>}
                    {errors.locationFormat && hasSubmitted && <p>{errors.locationFormat}</p>}
				</div>
				<div>
					<h2>What will your group&apos;s name be?</h2>
					<p>
						Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You
						can edit this later if you change your mind.
					</p>
					<input
						type='text'
						onChange={(e) => setName(e.target.value)}
						value={name}
						placeholder="What is your group's name?"
						name='name'
					></input>
                    {errors.name && hasSubmitted && <p>{errors.name}</p>}
				</div>
				<div>
					<h2>Now describe what your group will be about</h2>
					<p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
					<ol>
						<li>What&apos;s the purpose of the group?</li>
						<li>Who should join?</li>
						<li>What will you do at your events?</li>
					</ol>
					<textarea
						rows='10'
						onChange={(e) => setAbout(e.target.value)}
						value={about}
						name='about'
						placeholder='Please write at least 30 characters'
					></textarea>
                    {errors.about && hasSubmitted && <p>{errors.about}</p>}
				</div>
				<div>
					<h2>Final steps...</h2>
					<p>Is this an in person or online group?</p>
					<select onChange={(e) => setType(e.target.value)} value={type}>
						<option disabled value={""}>
							(select one)
						</option>
						<option value={"In person"}>In person</option>
						<option value={"Online"}>Online</option>
					</select>
                    {errors.type && hasSubmitted && <p>{errors.type}</p>}
					<p>Is this group private or public?</p>
					<select onChange={(e) => setPrivacy(e.target.value)} value={privacy}>
						<option disabled value={""}>
							(select one)
						</option>
						<option value={"Private"}>Private</option>
						<option value={"Public"}>Public</option>
					</select>
                    {errors.privacy && hasSubmitted && <p>{errors.privacy}</p>}
					<p>Please add in image url for your group below:</p>
					<input
						type='text'
						placeholder='https://somewhere.com/image.png'
                        value={imgUrl}
						onChange={(e) => setImgUrl(e.target.value)}

					></input>
                    {errors.imgUrl && hasSubmitted && <p>{errors.imgUrl}</p>}
				</div>
				<div>
					<button type='submit'>Create group</button>
				</div>
			</form>
		</>
	);
}

export default CreateGroupForm;
