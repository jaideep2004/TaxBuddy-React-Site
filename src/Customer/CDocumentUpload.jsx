import React, { useState } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const CDocumentUpload = ({ serviceId }) => {
	const [files, setFiles] = useState([]);
	const { uploadDocuments, message } = useCustomerAuth(); // Access context

	// Handle file selection
	const handleFileChange = (e) => {
		setFiles(e.target.files);
	};

	// Handle upload
	const handleUpload = () => {
		uploadDocuments(serviceId, files); // Delegate to context function
	};

	return (
		<div>
			<input type='file' multiple onChange={handleFileChange} />{" "}
			{/* File input */}
			<button onClick={handleUpload}>Upload Documents</button>{" "}
			{/* Upload button */}
			<p>{message}</p> {/* Display message from context */}
		</div>
	);
};

export default CDocumentUpload;
