// import "./App.css";
// import {
// 	BrowserRouter as Router,
// 	Routes,
// 	Route,
// 	Navigate,
// } from "react-router-dom";
// import Header from "./components/Header/Header";
// import Section1 from "./components/Section1/Section1";
// import About from "./components/AboutUs/About";
// import ContactUs from "./components/ContactUs/ContactUs";
// import Section2 from "./components/Section2/Section2";
// import Home from "./components/Home/Home";
// import Footer from "./components/Footer/Footer";
// import LoginPage from "./Admin/utils/LoginPage";

// import AdminDashboard from "./Admin/AdminDashboard";
// import ProtectedRoute from "./Admin/utils/ProtectedRoute";
// import {
// 	AdminDashboardContext,
// 	AdminDashboardProvider,
// } from "./Admin/AdminDashboardContext";
// import ServicePage from "./components/Services/ServicePage";

// function App() {
// 	return (
// 		<AdminDashboardProvider>
// 			<Router>
// 				<Header />
// 				<Routes>
// 					<Route path='/' element={<Home />} />
// 					<Route path='/section1' element={<Section1 />} />
// 					<Route path='/section2' element={<Section2 />} />
// 					<Route path='/about' element={<About />} />
// 					<Route path='/services/:id' element={<ServicePage />} />
// 					<Route path='/contact' element={<ContactUs />} />
// 					<Route path='/admin/login' element={<LoginPage />} />
// 					<Route
// 						path='/admin/dashboard'
// 						element={<ProtectedRoute element={<AdminDashboard />} />}
// 					/>
// 					<Route path='*' element={<Navigate to='/admin/login' replace />} />
// 				</Routes>
// 				<Footer />
// 			</Router>
// 		</AdminDashboardProvider>
// 	);
// }

// export default App;

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <AdminDashboardProvider>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/section1' element={<Section1 />} />
          <Route path='/section2' element={<Section2 />} />
          <Route path='/about' element={<About />} />
          <Route path='/services/:serviceId' element={<ServicePage />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/admin/login' element={<LoginPage />} />
          <Route path='/admin/dashboard' element={<ProtectedRoute element={<AdminDashboard />} />} />
          <Route path='/admin/*' element={<Navigate to='/admin/login' replace />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
        <Footer />
      </Router>
    </AdminDashboardProvider>
  );
}

export default App;
