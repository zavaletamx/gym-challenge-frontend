import { useState } from 'react';
import {
	Box,
	TextField,
	Button,
	Typography,
	Paper,
	Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		try {
			await login({ username, password });
			navigate('/');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Login failed');
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				p: 2,
			}}
		>
			<Paper sx={{ p: 4, width: '100%', maxWidth: 400 }}>
				<Typography
					variant='h4'
					gutterBottom
				>
					Login
				</Typography>
				{error && (
					<Alert
						severity='error'
						sx={{ mb: 2 }}
					>
						{error}
					</Alert>
				)}
				<form onSubmit={handleSubmit}>
					<TextField
						label='Username'
						fullWidth
						margin='normal'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
					<TextField
						label='Password'
						fullWidth
						margin='normal'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						type='password'
					/>
					<Button
						type='submit'
						variant='contained'
						fullWidth
						sx={{ mt: 2 }}
						size='large'
					>
						Login
					</Button>
				</form>
				<Typography
					sx={{ mt: 2, textAlign: 'center', display: 'none' }}
				>
					Don't have an account? <Link to='/register'>Register</Link>
				</Typography>
			</Paper>
		</Box>
	);
};

export default Login;
