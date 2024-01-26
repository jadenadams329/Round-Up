import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import * as sessionActions from "../../store/session";

function ProfileButton({ user, navigate }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const [iconClass, setIconClass] = useState(false);
	const ulRef = useRef();

	const toggleMenu = (e) => {
		e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
		// if (!showMenu) setShowMenu(true);
		setShowMenu(!showMenu);
		setIconClass(!showMenu);
	};

	useEffect(() => {
		if (!showMenu) {
			return;
		}

		const closeMenu = (e) => {
			if (ulRef.current && !ulRef.current.contains(e.target)) {
				setShowMenu(false);
				setIconClass(false);
			}
		};

		document.addEventListener("click", closeMenu);

		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	const logout = (e) => {
		e.preventDefault();
		dispatch(sessionActions.logout()).then(() => {
			navigate();
		});
	};

	const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

	return (
		<>
			<div className='profileButtonContainer'>
				<button className='userProfileButton' onClick={toggleMenu}>
					<i className='fas fa-user-circle' />
				</button>
				<i className={iconClass ? "fa-solid fa-angle-down" : "fa-solid fa-angle-up"}></i>
			</div>
			<ul className={ulClassName} ref={ulRef}>
				<li>{`Hello, ${user.username}`}</li>

				<li>{user.email}</li>
				<li>
					<Link className='userProfileLink' onClick={toggleMenu} to={"/groups"}>
						View groups
					</Link>
				</li>
				<li>
					<Link className='userProfileLink' onClick={toggleMenu} to={"/events"}>
						View events
					</Link>
				</li>
				<div className='upButtonDiv'>
					<button onClick={logout}>Log Out</button>
				</div>
			</ul>
		</>
	);
}

export default ProfileButton;
