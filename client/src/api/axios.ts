import axios from 'axios'

const axiosInstance : any = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	withCredentials: true
})

export default axiosInstance;