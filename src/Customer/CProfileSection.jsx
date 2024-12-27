import React, { useState } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import "./customer.css"; // Import CSS for styling

const CProfileSection = () => {
	const { user, formData, handleSaveProfile, setFormData } = useCustomerAuth();
	const [editableField, setEditableField] = useState(""); // Track which field is currently editable

	const handleFieldEdit = (field) => {
		setEditableField(field); // Set the field as editable
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	const getProfileInitial = () => {
		return user.name ? user.name.charAt(0) : "?";
	};

	const renderTabContent = (tab) => {
		const fields = {
			profile: [
				{ label: "Full Name", name: "name", value: formData.name || user.name },
				{ label: "Email", name: "email", value: formData.email || user.email },
				{
					label: "Phone",
					name: "mobile",
					value: formData.mobile || user.mobile,
				},
				{
					label: "Date of Birth",
					name: "dob",
					value: formData.dob || user.dob,
				},
				{
					label: "Gender",
					name: "gender",
					value: formData.gender || user.gender,
				},
			],
			taxInfo: [
				{ label: "PAN", name: "pan", value: formData.pan || user.pan },
				{ label: "GST", name: "gst", value: formData.gst || user.gst },
			],
			communicationInfo: [
				{
					label: "Address",
					name: "address",
					value: formData.address || user.address,
				},
				{ label: "City", name: "city", value: formData.city || user.city },
				{ label: "State", name: "state", value: formData.state || user.state },
				{
					label: "Country",
					name: "country",
					value: formData.country || user.country,
				},
				{
					label: "Postal Code",
					name: "postalcode",
					value: formData.postalcode || user.postalcode,
				},
			],
			employmentInfo: [
				{
					label: "Nature of Employment",
					name: "natureEmployement",
					value: formData.natureEmployement || user.natureEmployement,
				},
				{
					label: "Annual Income",
					name: "annualIncome",
					value: formData.annualIncome || user.annualIncome,
				},
			],
			educationInfo: [
				{
					label: "Education",
					name: "education",
					value: formData.education || user.education,
				},
				{
					label: "Institute",
					name: "institute",
					value: formData.institute || user.institute,
				},
				{
					label: "Certifications",
					name: "certifications",
					value: formData.certifications || user.certifications,
				},
				{
					label: "Completion Date",
					name: "completiondate",
					value: formData.completiondate || user.completiondate,
				},
			],
		};

		return (
			<div className='tab-content'>
				<h3>{tab.replace(/([A-Z])/g, " $1")}</h3>
				{fields[tab].map((field) => (
					<div key={field.name} className='field-row'>
						<label htmlFor={field.name}>{field.label}:</label>

						<input
							id={field.name}
							name={field.name}
							value={field.value}
							onChange={handleInputChange}
							className={editableField === field.name ? "editable" : ""}
							disabled={editableField !== field.name}
						/>
						<i
							className='fa-solid fa-pen-to-square edit-icon'
							onClick={() => handleFieldEdit(field.name)}
						/>
					</div>
				))}
			</div>
		);
	};

	const [activeTab, setActiveTab] = useState("profile"); // Track active tab

	return (
		<div className='profile-container'>
			<div className='psidebar'>
				<ul>
					<li onClick={() => setActiveTab("profile")}>Customer Profile</li>
					<li onClick={() => setActiveTab("taxInfo")}>Tax Info</li>
					<li onClick={() => setActiveTab("communicationInfo")}>
						Communication Info
					</li>
					<li onClick={() => setActiveTab("employmentInfo")}>
						Employment Info
					</li>
					<li onClick={() => setActiveTab("educationInfo")}>Education Info</li>
				</ul>
			</div>
			<div className='content'>
				<div className='profile-header'>
					<div className='profile-icon'>{getProfileInitial()}</div>
					<h2>{user.name}</h2>
				</div>
				{renderTabContent(activeTab)}
				<div className='save-button-container'>
					<button className='save-button' onClick={handleSaveProfile}>
						Save Profile
					</button>
				</div>
			</div>
		</div>
	);
};

export default CProfileSection;
