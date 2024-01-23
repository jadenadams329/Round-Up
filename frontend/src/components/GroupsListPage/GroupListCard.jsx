import "./GroupListCard.css";

function GroupListCard({ group }) {
	const noImgUrl =
		"https://t4.ftcdn.net/jpg/05/17/53/57/240_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg";
	return (
		<>
			<div className='glcContainer'>
				<div className='glcImg'>
					<img src={group.previewImage ? group.previewImage : noImgUrl}></img>
				</div>
				<div className='glcInfo'>
					<div>
						<h2>{group.name}</h2>
						<span className='glcSpan'>{`${group.city}, ${group.state}`}</span>
					</div>
					<p className='glcAbout'>{group.about}</p>
					<span className='glcSpan'>{`${group.numEvents} ${
						group.numEvents === 1 ? "event" : "events"
					} · ${group.private ? "Private" : "Public"}`}</span>
				</div>
			</div>
		</>
	);
}

export default GroupListCard;
