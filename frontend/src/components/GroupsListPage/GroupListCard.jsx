import "./GroupListCard.css";

function GroupListCard({ group }) {
	const noImgUrl =
		"https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019";
	return (
		<>
			<div className='glcContainer'>
				<div className='glcImg'>
					<img src={group.previewImage ? group.previewImage : noImgUrl}></img>
				</div>
				<div className='glcInfo'>
					<div>
						<h2>{group.name}</h2>
						<span className="glcSpan">{`${group.city}, ${group.state}`}</span>
					</div>
					<p className="glcAbout">{group.about}</p>
					<span className='glcSpan'>{`${
						group.private ? "Private" : "Public"
					}`}</span>
				</div>
			</div>
		</>
	);
}

export default GroupListCard;
