import { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Paper,
	CircularProgress,
	Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import api from '../api/axios';

const Admin = () => {
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchUsers = async () => {
		try {
			const { data } = await api.get('/users');
			setUsers(data);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleDelete = async (id: number) => {
		if (!window.confirm('Delete user?')) return;
		await api.delete(`/users/${id}`);
		fetchUsers();
	};

	const MakeAdmin = async (id: number) => {
		await api.patch(`/users/${id}/role`, { role: 'ADMIN' });
		fetchUsers();
	};

	return (
		<Box sx={{ p: 2 }}>
			<Typography
				variant='h5'
				gutterBottom
			>
				User Management
			</Typography>

			{loading ? (
				<CircularProgress />
			) : (
				<Paper>
					<List>
						{users.map((user) => (
							<ListItem
								key={user.id}
								secondaryAction={
									<Box>
										<IconButton
											edge='end'
											onClick={() => MakeAdmin(user.id)}
										>
											<AdminPanelSettingsIcon
												color={
													user.role === 'ADMIN'
														? 'primary'
														: 'disabled'
												}
											/>
										</IconButton>
										<IconButton
											edge='end'
											onClick={() =>
												handleDelete(user.id)
											}
										>
											<DeleteIcon />
										</IconButton>
									</Box>
								}
							>
								<ListItemText
									primary={user.name}
									secondary={user.email}
								/>
								<Chip
									label={user.role}
									size='small'
									color={
										user.role === 'ADMIN'
											? 'primary'
											: 'default'
									}
									sx={{ ml: 1 }}
								/>
							</ListItem>
						))}
					</List>
				</Paper>
			)}
		</Box>
	);
};

export default Admin;
