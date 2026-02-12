import { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	Paper,
	CircularProgress,
	Grid,
	TextField,
	MenuItem,
	FormControl,
	InputLabel,
	Select,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Avatar,
	Chip,
} from '@mui/material';
import api from '../api/axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const History = () => {
	const [checkins, setCheckins] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [filters, setFilters] = useState({
		userId: '',
		fromDate: '',
		toDate: '',
	});

	const navigate = useNavigate();

	const fetchUsers = async () => {
		try {
			const { data } = await api.get('/users');
			setUsers(data);
		} catch (e) {
			console.error('Error fetching users', e);
		}
	};

	const fetchHistory = async () => {
		setLoading(true);
		try {
			const params: any = {
				limit: rowsPerPage,
				offset: page * rowsPerPage,
			};
			if (filters.userId) params.userId = filters.userId;
			if (filters.fromDate) params.from = filters.fromDate;
			if (filters.toDate) params.to = filters.toDate;

			const { data } = await api.get('/checkins', { params });
			// Backend now returns { data: [], total: number }
			setCheckins(data.data);
			setTotal(data.total);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	useEffect(() => {
		fetchHistory();
	}, [filters, page, rowsPerPage]);

	const handleClear = () => {
		setFilters({ userId: '', fromDate: '', toDate: '' });
		setPage(0);
	};

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		_event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRowsPerPage(parseInt(_event.target.value, 10));
		setPage(0);
	};

	return (
		<Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
			<Typography variant='h5'>Check-in History</Typography>

			<Paper sx={{ p: 2 }}>
				<Grid
					container
					spacing={2}
					alignItems='center'
				>
					<Grid size={{ xs: 12, sm: 4 }}>
						<FormControl
							fullWidth
							size='small'
							sx={{ minWidth: 100 }}
						>
							<InputLabel>User</InputLabel>
							<Select
								value={filters.userId}
								label='User'
								onChange={(e) => {
									setFilters({
										...filters,
										userId: e.target.value,
									});
									setPage(0);
								}}
							>
								<MenuItem value=''>
									<em>All Users</em>
								</MenuItem>
								{users.map((u) => (
									<MenuItem
										key={u.id}
										value={u.id}
									>
										{u.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid size={{ xs: 6, sm: 2.5 }}>
						<TextField
							label='From'
							type='date'
							fullWidth
							size='small'
							InputLabelProps={{ shrink: true }}
							value={filters.fromDate}
							onChange={(e) => {
								setFilters({
									...filters,
									fromDate: e.target.value,
								});
								setPage(0);
							}}
						/>
					</Grid>
					<Grid size={{ xs: 6, sm: 2.5 }}>
						<TextField
							label='To'
							type='date'
							fullWidth
							size='small'
							InputLabelProps={{ shrink: true }}
							value={filters.toDate}
							onChange={(e) => {
								setFilters({
									...filters,
									toDate: e.target.value,
								});
								setPage(0);
							}}
						/>
					</Grid>
					<Grid
						size={{ xs: 12, sm: 3 }}
						sx={{ textAlign: 'right' }}
					>
						<Button
							variant='outlined'
							startIcon={<FilterAltOffIcon />}
							onClick={handleClear}
							disabled={
								!filters.userId &&
								!filters.fromDate &&
								!filters.toDate
							}
						>
							Clear Filters
						</Button>
					</Grid>
				</Grid>
			</Paper>

			<TableContainer component={Paper}>
				{loading ? (
					<Box
						sx={{ display: 'flex', justifyContent: 'center', p: 4 }}
					>
						<CircularProgress />
					</Box>
				) : (
					<>
						<Table sx={{ minWidth: 650 }}>
							<TableHead>
								<TableRow sx={{ bgcolor: 'action.hover' }}>
									<TableCell>Date & Time</TableCell>
									<TableCell>User</TableCell>
									<TableCell>Location</TableCell>
									<TableCell align='right'>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{checkins.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={4}
											align='center'
											sx={{ py: 3 }}
										>
											<Typography
												variant='body1'
												color='text.secondary'
											>
												No records found matching your
												search.
											</Typography>
										</TableCell>
									</TableRow>
								) : (
									checkins.map((checkin) => (
										<TableRow
											key={checkin.id}
											hover
										>
											<TableCell>
												<Typography
													variant='body2'
													sx={{ fontWeight: 'bold' }}
												>
													{format(
														new Date(
															checkin.createdAt,
														),
														'PPP',
													)}
												</Typography>
												<Typography
													variant='caption'
													color='text.secondary'
												>
													{format(
														new Date(
															checkin.createdAt,
														),
														'p',
													)}
												</Typography>
											</TableCell>
											<TableCell>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														gap: 1,
													}}
												>
													<Avatar
														sx={{
															width: 24,
															height: 24,
															fontSize: '0.75rem',
														}}
													>
														{checkin.user.name.charAt(
															0,
														)}
													</Avatar>
													{checkin.user.name}
												</Box>
											</TableCell>
											<TableCell>
												<Chip
													label={`${checkin.latitude.toFixed(4)}, ${checkin.longitude.toFixed(4)}`}
													size='small'
													variant='outlined'
												/>
											</TableCell>
											<TableCell align='right'>
												<Button
													size='small'
													startIcon={
														<VisibilityIcon />
													}
													onClick={() =>
														navigate(
															`/history/${checkin.id}`,
														)
													}
												>
													View
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
						<TablePagination
							rowsPerPageOptions={[10, 20, 50]}
							component='div'
							count={total}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
							labelRowsPerPage='Results per page:'
						/>
					</>
				)}
			</TableContainer>
		</Box>
	);
};

export default History;
