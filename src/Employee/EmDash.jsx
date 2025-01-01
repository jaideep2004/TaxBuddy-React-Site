import React from "react";
import { useParams } from "react-router-dom";

const EmDash = () => {
	const { email } = useParams();
    return <div className='ctax-dashboard-section'>
        <h2>Welcome, {email}</h2>
    </div>;
};

export default EmDash;
