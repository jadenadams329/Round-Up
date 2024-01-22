import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import validator from "validator";
import { useNavigate, useParams } from "react-router-dom";
import { updateGroup } from "../../store/groups";
import { addImage } from "../../store/groupImages";

function UpdateGroupForm() {
	const { id } = useParams();
	const group = useSelector((state) => state.groups.groupInfo[id]);
	let previewImg = group?.GroupImages?.find((img) => img.preview);

	const handleIncomingLocation = (city, state) => {
		let cityState = `${city},${state}`;
		return cityState;
	};

	const handleLocation = (location) => {
		let cityState = location.split(",");
		return cityState;
	};

	const [location, setLocation] = useState(handleIncomingLocation(group?.city, group?.state));
	const [name, setName] = useState(group?.name);
	const [about, setAbout] = useState(group?.about);
	const [privacy, setPrivacy] = useState(group?.private ? "Private" : "Public");
	const [type, setType] = useState(group?.type);
	const [imgUrl, setImgUrl] = useState(previewImg?.url ? previewImg.url : "");
	const [errors, setErrors] = useState({});
	const [hasSubmitted, setHasSubmitted] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	let hasErrors = Object.values(errors).length === 0 ? false : true;

	const onSubmit = async (e) => {
		e.preventDefault();
		setHasSubmitted(true);
		const isPrivate = privacy === "Private";
		if (!hasErrors) {
			const [city, state] = handleLocation(location);
			const createGroup = { name, about, type, private: isPrivate, city, state };
			const createImage = { url: imgUrl, preview: true };
			try {
				const group = await dispatch(updateGroup(id, createGroup));
				if (previewImg.url !== imgUrl) {
					await dispatch(addImage(group.id, createImage));
				}
				setHasSubmitted(false);
				hasErrors = false;
				navigate(`/groups/${group.id}`);
			} catch (res) {
				const data = await res.json();
				if (data) {
					setErrors(data);
				}
			}
		}
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
		setErrors(validationErrors);
	}, [location, name, about, privacy, type, imgUrl, dispatch, id]);

	return (
		<>
			<div className='cgFormContainer'>
				<div></div>
				<form onSubmit={onSubmit}>
					<div div className='cgTop'>
						<h4>UPDATE YOUR GROUPS INFORMATION</h4>
						<h2>We&apos;ll walk you through a few steps to build your local community</h2>
					</div>
					<div className='cgLocation'>
						<h2>First, set your group&apos;s location</h2>
						<p>
							Meetup groups meet locally, in person and online. We&apos;ll connect you with people in your area, and
							more can join you online.
						</p>
						<input
							type='text'
							onChange={(e) => setLocation(e.target.value)}
							value={location}
							placeholder='City, STATE'
							name='location'
						></input>
						{errors.location && hasSubmitted && <p className='cgError'>{errors.location}</p>}
						{errors.locationFormat && hasSubmitted && <p className='cgError'>{errors.locationFormat}</p>}
					</div>
					<div className='cgName'>
						<h2>What will your group&apos;s name be?</h2>
						<p>
							Choose a name that will give people a clear idea of what the group is about. Feel free to get creative!
							You can edit this later if you change your mind.
						</p>
						<input
							type='text'
							onChange={(e) => setName(e.target.value)}
							value={name}
							placeholder="What is your group's name?"
							name='name'
						></input>
						{errors.name && hasSubmitted && <p className='cgError'>{errors.name}</p>}
					</div>
					<div div className='cgAbout'>
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
						{errors.about && hasSubmitted && <p className='cgError'>{errors.about}</p>}
					</div>
					<div div className='cgBottom'>
						<h2>Final steps...</h2>
						<p>Is this an in person or online group?</p>
						<div className='cgSelect'>
							<select onChange={(e) => setType(e.target.value)} value={type}>
								<option disabled value={""}>
									(select one)
								</option>
								<option value={"In person"}>In person</option>
								<option value={"Online"}>Online</option>
							</select>
							{errors.type && hasSubmitted && <p className='cgError'>{errors.type}</p>}
						</div>
						<p>Is this group private or public?</p>
						<div className='cgSelect'>
							<select onChange={(e) => setPrivacy(e.target.value)} value={privacy}>
								<option disabled value={""}>
									(select one)
								</option>
								<option value={"Private"}>Private</option>
								<option value={"Public"}>Public</option>
							</select>
							{errors.privacy && hasSubmitted && <p className='cgError'>{errors.privacy}</p>}
						</div>
						<p>Please add in image url for your group below:</p>
						<input
							type='text'
							placeholder='https://somewhere.com/image.png'
							value={imgUrl}
							onChange={(e) => setImgUrl(e.target.value)}
						></input>
						{errors.imgUrl && hasSubmitted && <p className='cgError'>{errors.imgUrl}</p>}
					</div>
					<div className='cgButton'>
						<button type='submit'>Update group</button>
					</div>
				</form>
				<div></div>
			</div>
		</>
	);
}

export default UpdateGroupForm;
