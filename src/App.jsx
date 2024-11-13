import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Section1 from "./components/Section1/Section1";
import About from "./components/AboutUs/About";
import Services from "./components/Services/Services";
import ContactUs from "./components/ContactUs/ContactUs";
import Section2 from "./components/Section2/Section2";
import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";

function App() {
	return (
		<Router>
			<Header />
			<Routes>
				<Route path='/' element={<Home />} />

				<Route path='/section1' element={<Section1 />} />
				<Route path='/section2' element={<Section2 />} />
				<Route path='/about' element={<About />} />
				<Route path='/services' element={<Services />} />
				<Route path='/contact' element={<ContactUs />} />
			</Routes>
			<Footer/>
		</Router>
	);
}

export default App;
