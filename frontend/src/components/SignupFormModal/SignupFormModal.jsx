import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import validator from "validator";
import "./SignupForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
	let [userInteraction, setUserInteraction] = useState({
		email: false,
		username: false,
		firstName: false,
		lastName: false,
		password: false,
		confirmPassword: false,
	});

	let submitDisabled = true;

	const { closeModal } = useModal();

	useEffect(() => {
		const validationErrors = {};
		if (!validator.isEmail(email))
			validationErrors["isEmail"] = "*Please enter a valid email";
		if (username.length <= 3)
			validationErrors["usernameLength"] =
				"*Username must be 4 or more characters";
		if (validator.isEmpty(firstName))
			validationErrors["firstName"] = "*First Name is required";
		if (validator.isEmpty(lastName))
			validationErrors["lastName"] = "*Last Name is required";
    if(password.length <= 5)
      validationErrors["passwordLength"]="*Password should contain at least 6 characters"
		if (!validator.equals(password, confirmPassword))
			validationErrors["passwordMatch"] = "*Passwords must match";
		setErrors(validationErrors);
	}, [email, username, firstName, lastName, password, confirmPassword]);

	submitDisabled = Object.values(errors).length === 0 ? false : true;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			setErrors({});
			return dispatch(
				sessionActions.signup({
					email,
					username,
					firstName,
					lastName,
					password,
				})
			)
				.then(closeModal)
				.catch(async (res) => {
					const data = await res.json();
					if (data?.errors) {
						setErrors(data.errors);
					}
				});
		}
		return setErrors({
			confirmPassword:
				"Confirm Password field must be the same as the Password field",
		});
	};

	console.log(userInteraction);

	return (
		<>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<label>
					<input
						type='text'
						placeholder='Email'
						value={email}
						onChange={(e) => {
							setEmail(e.target.value), setUserInteraction(prevState => ({
                ...prevState,
                email: true,
              }));
						}}
						required
					/>
				</label>
				{errors.isEmail && userInteraction.email && (
					<p className='error'>{errors.isEmail}</p>
				)}
				{errors.email && (
					<p className='error'>{`*${errors.email}`}</p>
				)}
				<label>
					<input
						type='text'
						placeholder='Username'
						value={username}
						onChange={(e) => {
							setUsername(e.target.value),
              setUserInteraction(prevState => ({
                ...prevState,
                username: true,
              }));
						}}
						required
					/>
				</label>
				{errors.usernameLength && userInteraction.username && (
					<p className='error'>{errors.usernameLength}</p>
				)}
				{errors.username && <p className='error'>{`*${errors.username}`}</p>}
				<label>
					<input
						type='text'
						placeholder='First Name'
						value={firstName}
						onChange={(e) => {
							setFirstName(e.target.value),
              setUserInteraction(prevState => ({
                ...prevState,
                firstName: true,
              }));
						}}
						required
					/>
				</label>
				{errors.firstName && userInteraction.firstName && (
					<p className='error'>{errors.firstName}</p>
				)}
				<label>
					<input
						type='text'
						placeholder='Last Name'
						value={lastName}
						onChange={(e) => {
							setLastName(e.target.value),
              setUserInteraction(prevState => ({
                ...prevState,
                lastName: true,
              }));
						}}
						required
					/>
				</label>
				{errors.lastName && userInteraction.lastName && (
					<p className='error'>{errors.lastName}</p>
				)}
				<label>
					<input
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => {setPassword(e.target.value), setUserInteraction(prevState => ({
              ...prevState,
              password: true,
            }));
          }}
						required
					/>
				</label>
        {errors.passwordLength && userInteraction.password && (
					<p className='error'>{errors.passwordLength}</p>
				)}
				<label>
					<input
						type='password'
						placeholder='Confirm Password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				{errors.passwordMatch && (
					<p className='error'>{errors.passwordMatch}</p>
				)}

				<button
					disabled={submitDisabled}
					className='modal-button'
					type='submit'
				>
					Sign Up
				</button>
			</form>
		</>
	);
}

export default SignupFormModal;
