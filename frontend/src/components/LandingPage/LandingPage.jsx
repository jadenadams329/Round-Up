import landingPageOne from "../images/landing-page-1.jpg";
import landingPageTwo from "../images/landing-page-2.jpg";
import landingPageThree from "../images/landing-page-3.jpg";
import landingPageFour from "../images/landing-page-4.jpg"
import "./LandingPage.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function LandingPage() {
    const sessionUser = useSelector((state) => state.session.user);
    let groupLinkClass = 'lpBottomLink'
    sessionUser ? groupLinkClass : groupLinkClass = 'lpBottomLinkDisabled'
	return (
		<>
			<div className='lpContainerTop'>
				<div className='lpTop'>
					<h1 className='lpHeading'>
						The people platform-<br></br>Where interests<br></br>become
						friendships
					</h1>
					<p className='lpHeadingParagraph'>
						Whatever your interest, from hiking and reading to networking and
						skill sharing, there are thousands of people who share it on Roundup.
						Events are happening every day—sign up to join the fun.
					</p>
				</div>
				<img className='landingPageImg' src={landingPageOne}></img>
			</div>
            <div className="lpContainerMid">
                <h2>How Roundup works</h2>
                <p>Discover events and groups or start a group to host events</p>
            </div>
            <div className="lpContainerBottom">
                <div className="lpBottomDiv">
                    <img src={landingPageTwo} className="lpBottomImg"></img>
                    <Link to={'/groups'} className="lpBottomLink">See all Groups</Link>
                </div>
                <div className="lpBottomDiv">
                    <img className="lpBottomImg" src={landingPageFour}></img>
                    <Link to={'/events'} className="lpBottomLink">Find an event</Link>

                </div>
                <div className="lpBottomDiv">
                    <img src={landingPageThree} className="lpBottomImg" ></img>
                    <Link to={'/groups/new'}className={groupLinkClass}>Start a new group</Link>

                </div>
            </div>
            <div className="lpButtonDiv">
                <button className="lpButton">
                    Join Roundup
                </button>
            </div>
		</>
	);
}

export default LandingPage;
