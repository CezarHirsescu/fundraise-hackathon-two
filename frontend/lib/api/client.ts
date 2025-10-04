import axios, { AxiosInstance, AxiosError } from "axios"
import type { ApiResponse } from "@/types/api"

// Base API URL - matches backend server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000, // 30 seconds
})

// Request interceptor - add auth token if needed in the future
apiClient.interceptors.request.use(
	(config) => {
		// Future: Add authentication token here
		// const token = localStorage.getItem('token');
		// if (token) {
		//   config.headers.Authorization = `Bearer ${token}`;
		// }
		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
	(response) => {
		return response
	},
	(error: AxiosError<ApiResponse<any>>) => {
		// Handle common errors
		if (error.response) {
			// Server responded with error status
			const apiError = error.response.data
			console.error("API Error:", apiError.error || apiError.message)
		} else if (error.request) {
			// Request made but no response
			console.error("Network Error: No response from server")
		} else {
			// Something else happened
			console.error("Error:", error.message)
		}
		return Promise.reject(error)
	}
)

export default apiClient

// Helper function to extract data from API response
export function extractData<T>(response: ApiResponse<T>): T {
	if (!response.success) {
		throw new Error(response.error || response.message || "API request failed")
	}
	if (!response.data) {
		throw new Error("No data in API response")
	}
	return response.data
}

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const apiError = error.response?.data as ApiResponse<any> | undefined
		return apiError?.error || apiError?.message || error.message
	}
	if (error instanceof Error) {
		return error.message
	}
	return "An unknown error occurred"
}

