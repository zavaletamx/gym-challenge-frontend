import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Checkin from './pages/Checkin';
import History from './pages/History';
import Detail from './pages/Detail';
import Ranking from './pages/Ranking';
import Admin from './pages/Admin';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user } = useAuth();
	if (!user) {
		return (
			<Navigate
				to='/login'
				replace
			/>
		);
	}
	return children;
};

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route
							path='/login'
							element={<Login />}
						/>
						<Route
							path='/register'
							element={<Register />}
						/>
						<Route
							path='/'
							element={
								<ProtectedRoute>
									<Layout />
								</ProtectedRoute>
							}
						>
							<Route
								index
								element={<Dashboard />}
							/>
							<Route
								path='checkin'
								element={<Checkin />}
							/>
							<Route
								path='history'
								element={<History />}
							/>
							<Route
								path='history/:id'
								element={<Detail />}
							/>
							<Route
								path='ranking'
								element={<Ranking />}
							/>
							<Route
								path='admin'
								element={<Admin />}
							/>
						</Route>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
