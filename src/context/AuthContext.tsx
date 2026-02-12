import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

interface User {
	id: number;
	email: string;
	username: string;
	name: string;
	role: 'STANDARD' | 'ADMIN';
}

interface AuthContextType {
	user: User | null;
	login: (data: any) => Promise<void>;
	register: (data: any) => Promise<void>;
	logout: () => Promise<void>;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			const { data } = await api.get('/auth/me');
			setUser(data);
		} catch (e) {
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (credentials: any) => {
		const { data } = await api.post('/auth/login', credentials);
		setUser(data.user);
	};

	const register = async (userData: any) => {
		const { data: _data } = await api.post('/auth/register', userData);
		// Auto login or redirect to login? Requirements say Register -> Login usually
		// but we can auto-login if the API returns token.
		// My API implementation returns user on register? No, just result.
		// Let's assume user needs to login.
	};

	const logout = async () => {
		await api.post('/auth/logout');
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, login, register, logout, isLoading }}
		>
			{!isLoading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
