import { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();
	let submitDisabled = true;

	useEffect(() => {
		const validationErrors = {};

		if (credential.length <= 3)
			validationErrors["usernameLength"] =
				"*Username must be 4 or more characters";
		if (password.length <= 5)
			validationErrors["passwordLength"] =
				"*Password should contain at least 6 characters";
		setErrors(validationErrors);
	}, [credential, password]);

	submitDisabled = Object.values(errors).length === 0 ? false : true;

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});
		return dispatch(sessionActions.login({ credential, password }))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data) {
					setErrors(data);
				}
			});
	};

	const demoUserOnClick = (e) => {
		e.preventDefault();
		return dispatch(sessionActions.login({ credential: "member", password: "password" }))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data) {
					setErrors(data);
				}
			});
	}

	return (
		<>
			<h1>Log In</h1>
			{errors.message && <p className='error'>{errors.message}</p>}
			<form onSubmit={handleSubmit}>
				<div className='form'>
					<input
            className="modal-input"
						type='text'
						placeholder='Username or Email'
						value={credential}
						onChange={(e) => setCredential(e.target.value)}
						required
					/>

					<input
          className="modal-input"
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<button
						disabled={submitDisabled}
						className='modal-button'
						type='submit'
					>
						Log In
					</button>
					<button className="demo" onClick={demoUserOnClick}>Log in as Demo User</button>
				</div>
			</form>
		</>
	);
}

export default LoginFormModal;
