import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';
import api from '../api/axios';

const Ranking = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchYearly = async () => {
			try {
				const { data } = await api.get('/rankings/yearly');
				setData(data); // Expects [{ name, count }]
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		};
		fetchYearly();
	}, []);

	return (
		<Box
			sx={{
				p: 2,
				height: '80vh',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Typography
				variant='h5'
				gutterBottom
			>
				Yearly Race
			</Typography>

			{loading ? (
				<CircularProgress />
			) : (
				<Paper sx={{ flexGrow: 1, p: 2 }}>
					<ResponsiveContainer
						width='100%'
						height='100%'
					>
						<BarChart
							data={data}
							layout='vertical'
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						>
							<XAxis
								type='number'
								hide
							/>
							<YAxis
								dataKey='name'
								type='category'
								width={100}
							/>
							<Tooltip />
							<Bar
								dataKey='count'
								fill='#8884d8'
								radius={[0, 10, 10, 0]}
							>
								{data.map((_entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={
											index === 0 ? '#FFD700' : '#8884d8'
										}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</Paper>
			)}
		</Box>
	);
};

export default Ranking;
