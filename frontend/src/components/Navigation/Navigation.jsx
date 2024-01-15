import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./Navigation.css";
import logo from "../images/logo.png";

function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);

	let sessionLinks;
	if (sessionUser) {
		sessionLinks = (
			<li className='navListItem' id='profileButton'>
				<ProfileButton user={sessionUser} />
			</li>
		);
	} else {
		sessionLinks = (
			<>
				<li className='navListItem' id='signUp'>
					<OpenModalButton
						className='modalButton'
						buttonText='Sign Up'
						modalComponent={<SignupFormModal />}
					/>
				</li>
				<li className='navListItem' id='signIn'>
					<OpenModalButton
						className='modalButton'
						buttonText='Log In'
						modalComponent={<LoginFormModal />}
					/>
				</li>
			</>
		);
	}

	return (
		<nav>
			<ul className='navList'>
				<li className='navListItem'>
					<NavLink to='/'>
						<a>
							<img className='logo' src={logo}></img>
						</a>
					</NavLink>
				</li>
				{isLoaded && sessionLinks}
			</ul>
		</nav>
	);
}

export default Navigation;
