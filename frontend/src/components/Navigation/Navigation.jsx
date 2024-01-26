import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./Navigation.css";
import logo from "../images/logo.png";

function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);
	const navigate = useNavigate();

	const callNavigate = () => {
		return navigate(`/`);
	};

	let sessionLinks;
	if (sessionUser) {
		sessionLinks = (
			<>
				<Link className='navNewGroup' to={"/groups/new"}>
					Start a new group
				</Link>

				<li className='navListItem' id='profileButton'>
					<ProfileButton user={sessionUser} navigate={callNavigate} />
				</li>
			</>
		);
	} else {
		sessionLinks = (
			<>
				<li className='navListItem' id='signUp'>
					<OpenModalButton cssClass={"modalButton"} buttonText='Sign Up' modalComponent={<SignupFormModal />} />
				</li>
				<li className='navListItem' id='signIn'>
					<OpenModalButton cssClass={"modalButton"} buttonText='Log In' modalComponent={<LoginFormModal />} />
				</li>
			</>
		);
	}

	return (
		<nav>
			<ul className='navList'>
				<div className='navListContainer'>
					<div>
						<li className='navListItem'>
							<NavLink to='/'>
								<a>
									<img className='logo' src={logo}></img>
								</a>
							</NavLink>
						</li>
					</div>
					<div className='sessionLinks'>{isLoaded && sessionLinks}</div>
				</div>
			</ul>
		</nav>
	);
}

export default Navigation;
