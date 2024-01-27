
function EventDetailsGroupCard({group}) {
  return (
   <>
        <div className="edgcContainer">
            <div className="edgcImg">
                <img src={group && group.GroupImages[0].url}></img>
            </div>
            <div className="edgcInfo">
                <h4>{group && group.name}</h4>
                <p>{group.private ? "Private" : "Public"}</p>
            </div>
        </div>
   </>
  )
}

export default EventDetailsGroupCard
