import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useNavigate, Navigate, useParams } from "react-router-dom";
const CSettings = () => {
	// const { isLoggedIn, error } = useCustomerAuth();
	// if (!isLoggedIn) {
	// 	return <Navigate to='/customers/login' replace />;
	// }
	// const navigate = useNavigate();
	// if (error) {
	// 	return (
	// 		<div className='error-message'>
	// 			<p>{error}</p>
	// 			<button onClick={handleLoginAgain}>Login Again</button>
	// 		</div>
	// 	);
	// }

	// const handleLoginAgain = () => {
	// 	navigate("/customers/login");
	// };
	return <div>CSettings</div>;
};

export default CSettings;
