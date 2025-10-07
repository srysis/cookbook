import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { disableReactDevTools } from '@fvilers/disable-react-devtools'

import axios from './api/axios.ts'

import BaseLayout from './components/layout/Base'

import Home from './pages/home'
import SearchRecipesPage from './pages/search_recipes'

if (import.meta.env.PROD) {
	disableReactDevTools();
}

function App() {
	return(
		<BrowserRouter basename="/">
			<Routes>
				<Route element={<BaseLayout />} >
					<Route path="/" element={<Home />} />
					<Route path="/search" element={<SearchRecipesPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
