import "./App.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Section1 from "./components/Section1/Section1";
import About from "./components/AboutUs/About";
import ContactUs from "./components/ContactUs/ContactUs";
import Section2 from "./components/Section2/Section2";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import LoginPage from "./Admin/utils/LoginPage";
import AdminDashboard from "./Admin/AdminDashboard";
import ProtectedRoute from "./Admin/utils/ProtectedRoute";
import { AdminDashboardProvider } from "./Admin/AdminDashboardContext";
import ServicePage from "./components/Services/ServicePage";
// import { colorThemes, applyTheme } from "./components/Header/themes";
import { useState } from "react";
import CustomerDashboard from "./Customer/CustomerDashboard";
import CustomerLoginPage from "./Customer/CustomerLoginPage";
import { CustomerAuthProvider } from "./Customer/CustomerAuthContext";
import { useNavigate } from "react-router-dom";
import CustomerProtectedRoute from "./Customer/CustomerProtectedRoute";
import CDashSection from "./Customer/CDashSection";
function App() {
	const [currentTheme, setCurrentTheme] = useState("theme1");

	// const handleThemeChange = (themeName) => {
	// 	setCurrentTheme(themeName);
	// 	applyTheme(colorThemes[themeName]);
	// };

	return (
		<AdminDashboardProvider>
			<CustomerAuthProvider>
				<Router>
					{/* <Header /> */}
					<Routes>
						<Route
							path='/'
							element={
								<>
									<Header />
									<Home />
								</>
							}
						/>
						<Route
							path='/section1'
							element={
								<>
									<Section1 />
								</>
							}
						/>
						<Route path='/section2' element={<Section2 />} />
						<Route
							path='/about'
							element={
								<>
									<Header />
									<About />
								</>
							}
						/>
						<Route
							path='/services/:serviceId'
							element={
								<>
									<Header />
									<ServicePage />
								</>
							}
						/>
						<Route
							path='/contact'
							element={
								<>
									<Header />
									<ContactUs />
								</>
							}
						/>
						<Route
							path='/admin/login'
							element={
								<>
									<Header />
									<LoginPage />
								</>
							}
						/>
						<Route
							path='/admin/dashboard'
							element={<ProtectedRoute element={<AdminDashboard />} />}
						/>
						<Route
							path='/admin/*'
							element={<Navigate to='/admin/login' replace />}
						/>
						<Route path='*' element={<Navigate to='/' replace />} />
						{/* Customer Routes */}

						<Route
							path='/customers/login'
							element={
								<>
									<Header />
									<CustomerLoginPage />
								</>
							}
						/>
						<Route
							path='/customers/dashboard/:email'
							element={
								<CustomerProtectedRoute element={<CustomerDashboard />} />
							}
						/>

						<Route
							path='/customers/*'
							element={<Navigate to='/customers/login' replace />}
						/>
					</Routes>
					<Footer />
				</Router>
			</CustomerAuthProvider>
		</AdminDashboardProvider>
	);
}

export default App;
