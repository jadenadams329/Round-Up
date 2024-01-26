import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../store/groups";
import { Link } from "react-router-dom";
import GroupListCard from "./GroupListCard";
import "./GroupsListPage.css";
import Spinner from "../Spinner/Spinner";

function GroupsListPage() {
	const [isLoaded, setIsLoaded] = useState(false);
	const dispatch = useDispatch();
	const groups = useSelector((state) => state.groups.data);
	const groupsList = Object.values(groups);

	useEffect(() => {
		dispatch(getAllGroups()).then(() => {
			setIsLoaded(true)
		})

	}, [dispatch]);

	return (
		<>
			<div className='glpGridContainer'>
				<div className='glpCol'></div>
				<div className='glpMenuContainer'>
					<div className='glpMenu'>
						<h2>
							<Link className="glpMenuEvents" to='/events'>Events</Link>
						</h2>
						<h2 className="glpMenuActive">Groups</h2>
					</div>
					<p className="glpMenuP">Groups in Roundup</p>
					<div id='spinner'>{!isLoaded && <Spinner />}</div>
                    {isLoaded && groupsList.map((group) => (
                        <Link key={group.id} className="glpCardLink" to={`/groups/${group.id}`}><GroupListCard group={group} key={group.id}/></Link>
                    ))}
				</div>
                <div className='glpCol'></div>
			</div>
		</>
	);
}

export default GroupsListPage;
