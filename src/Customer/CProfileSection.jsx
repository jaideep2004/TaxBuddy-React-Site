import React, { useEffect, useState } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const CProfileSection = () => {
	const { user, services, loading } = useCustomerAuth(); // Get user and services data from context

	const [profile, setProfile] = useState(null);

	useEffect(() => {
		if (user) {
			setProfile(user);
		}
	}, [user]);

	if (loading) return <div>Loading...</div>;
	if (!profile) return <div>No profile data available.</div>;

	return (
		<div className='profile-container'>
			<div className='profile-header'>
				<h2>Profile Overview</h2>
				<button className='edit-button'>Edit</button>
			</div>

			<div className='profile-card'>
				<div>
					<div className='profile-avatar'>
						{/* Avatar Placeholder or image */}
						<div className='avatar-placeholder'>{profile.name[0]}</div>
					</div>
					<div className='profile-item'>
						<label>Username</label>
						<input type='text' value={profile.username} readOnly />
					</div>
					<div className='profile-item'>
						<label>Email</label>
						<input type='text' value={profile.email} readOnly />
					</div>
					<div className='profile-item'>
						<label>Mobile</label>
						<input type='text' value={profile.mobile} readOnly />
					</div>
					<div className='profile-item'>
						<label>Date of Birth</label>
						<input
							type='text'
							value={new Date(profile.dob).toLocaleDateString()}
							readOnly
						/>
					</div>
					<div className='profile-item'>
						<label>Gender</label>
						<input type='text' value={profile.gender} readOnly />
					</div>
					<div className='profile-item'>
						<label>Address</label>
						<input type='text' value={profile.address} readOnly />
					</div>
					<div className='profile-item'>
						<label>City</label>
						<input type='text' value={profile.city} readOnly />
					</div>
					<div className='profile-item'>
						<label>State</label>
						<input type='text' value={profile.state} readOnly />
					</div>
				</div>
				<div>
					<div className='profile-item'>
						<label>Country</label>
						<input type='text' value={profile.country} readOnly />
					</div>
					<div className='profile-item'>
						<label>Postal Code</label>
						<input type='text' value={profile.postalcode} readOnly />
					</div>

					{/* Financial Information */}
					<div className='profile-item'>
						<label>Annual Income</label>
						<input type='text' value={profile.annualIncome} readOnly />
					</div>
					<div className='profile-item'>
						<label>Nature of Employment</label>
						<input type='text' value={profile.natureEmployement} readOnly />
					</div>
					<div className='profile-item'>
						<label>Education</label>
						<input type='text' value={profile.education} readOnly />
					</div>
					<div className='profile-item'>
						<label>Certifications</label>
						<input type='text' value={profile.certifications} readOnly />
					</div>
					<div className='profile-item'>
						<label>Institute</label>
						<input type='text' value={profile.institute} readOnly />
					</div>
					<div className='profile-item'>
						<label>Completion Date</label>
						<input
							type='text'
							value={new Date(profile.completiondate).toLocaleDateString()}
							readOnly
						/>
					</div>

					{/* Services Purchased */}
					<div className='profile-item'>
						<label>Services Purchased</label>
						<ul>
							{profile.services && profile.services.length > 0 ? (
								profile.services.map((service, index) => (
									<li key={index}>
										{services[service.serviceId] ||
											"Service name not available"}
									</li>
								))
							) : (
								<li>No services purchased</li>
							)}
						</ul>
					</div>

					{/* Payment History */}
					<div className='profile-item'>
						<label>Payment History</label>
						<ul>
							{profile.paymentHistory && profile.paymentHistory.length > 0 ? (
								profile.paymentHistory.map((payment, index) => (
									<li key={index}>
										Payment ID: {payment.paymentId}, Status: {payment.status},
										Date: {new Date(payment.date).toLocaleDateString()}, Method:{" "}
										{payment.paymentMethod || "N/A"}
									</li>
								))
							) : (
								<li>No payment history available</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CProfileSection;
