import { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Paper,
	CircularProgress,
	Button,
} from '@mui/material';
import api from '../api/axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const Dashboard = () => {
	const [ranking, setRanking] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchYearly = async () => {
			try {
				const { data } = await api.get('/rankings/yearly');
				setRanking(data);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		};
		fetchYearly();
	}, []);

	return (
		<Box sx={{ p: 2 }}>
			<Typography
				variant='h5'
				gutterBottom
			>
				Hall of Fame {new Date().getFullYear()}
			</Typography>
			<Typography
				variant='subtitle2'
				color='text.secondary'
				gutterBottom
			>
				Ranking by total sessions this year
			</Typography>

			{loading ? (
				<CircularProgress />
			) : (
				<Paper>
					<List>
						{ranking.length === 0 ? (
							<ListItem
								sx={{ flexDirection: 'column', py: 4, gap: 2 }}
							>
								<ListItemText
									primary='No check-ins yet today. Be the first!'
									primaryTypographyProps={{
										variant: 'h6',
										textAlign: 'center',
									}}
								/>
								<Button
									variant='contained'
									size='large'
									startIcon={<AddPhotoAlternateIcon />}
									onClick={() => navigate('/checkin')}
								>
									Check-In Now
								</Button>
							</ListItem>
						) : null}
						{ranking.map((item, index) => (
							<ListItem
								key={item.userId}
								divider
							>
								<ListItemAvatar>
									<Avatar
										sx={{
											bgcolor:
												index === 0
													? 'gold'
													: index === 1
														? 'silver'
														: index === 2
															? '#cd7f32'
															: 'secondary.main',
										}}
									>
										{index + 1}
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={item.name}
									secondary={
										<>
											<Typography
												component='span'
												variant='body2'
												color='primary.main'
												sx={{ fontWeight: 'bold' }}
											>
												{item.count} total attendances
											</Typography>
											<br />
											<Typography
												component='span'
												variant='caption'
												color='text.secondary'
											>
												Last:{' '}
												{format(
													new Date(item.lastCheckin),
													'PPP p',
												)}
											</Typography>
										</>
									}
								/>
							</ListItem>
						))}
					</List>
				</Paper>
			)}
		</Box>
	);
};

export default Dashboard;
