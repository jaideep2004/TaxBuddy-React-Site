import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const CDocumentUpload = () => {
	const [files, setFiles] = useState([]);
	const [imagePreviews, setImagePreviews] = useState([]);
	const { uploadDocuments, message, services } = useCustomerAuth();
	const [selectedServiceName, setSelectedServiceName] = useState("");
	const [uploadError, setUploadError] = useState("");
	const [uploadedDocuments, setUploadedDocuments] = useState([]);

	useEffect(() => {
		if (services && services.length > 0) {
			setSelectedServiceName(services[0].serviceName);
			setUploadedDocuments(services[0].documents || []);
		}
	}, [services]);

	useEffect(() => {
		// Update uploaded documents when the selected service changes
		const selectedService = services.find(
			(service) => service.serviceName === selectedServiceName
		);
		setUploadedDocuments(selectedService?.documents || []);
	}, [selectedServiceName, services]);

	const handleFileChange = (e) => {
		const selectedFiles = Array.from(e.target.files);
		setFiles(selectedFiles);

		const previews = selectedFiles.map((file) => {
			return file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
		});
		setImagePreviews(previews);
	};

	const handleUpload = async () => {
		if (!selectedServiceName) {
			setUploadError("Please select a service first");
			return;
		}
		if (files.length === 0) {
			setUploadError("Please select files to upload");
			return;
		}

		try {
			setUploadError("");
			await uploadDocuments(selectedServiceName, files);
			setFiles([]);
			setImagePreviews([]);
			alert("Documents uploaded successfully!");
		} catch (error) {
			setUploadError(
				error.message || "Failed to upload documents. Please try again."
			);
		}
	};

	// Add service selection dropdown if user has multiple services
	const renderServiceSelection = () => {
		if (services.length > 1) {
			return (
				<select
					value={selectedServiceName}
					onChange={(e) => setSelectedServiceName(e.target.value)}
					className='service-select'>
					{services.map((service, index) => (
						<option key={index} value={service.serviceName}>
							{service.serviceName}
						</option>
					))}
				</select>
			);
		}
		return <h4>Service: {selectedServiceName || "No Service Selected"}</h4>;
	};

	const renderUploadedDocuments = () => {
		const customerId = services[0]?.customerId || "unknown";
		const baseUrl = `http://localhost:5000/uploads/${customerId}/`;

		return (
			<div className='uploaded-documents'>
				<h4>Previously Uploaded Documents:</h4>
				{uploadedDocuments.length > 0 ? (
					<div className='uploaded-previews'>
						{uploadedDocuments.map((doc, index) => {
							const fileUrl = `${baseUrl}${doc.filename}`; // Construct the full URL to the file

							return (
								<div key={index} className='uploaded-item'>
									{/* Check if it's an image based on the mimetype */}
									{doc.mimetype.startsWith("image/") ? (
										<img
											src={fileUrl}
											alt={doc.originalName || `Document ${index + 1}`}
											style={{
												width: "100px",
												height: "100px",
												objectFit: "cover",
												marginRight: "10px",
											}}
										/>
									) : (
										<a
											href={fileUrl}
											target='_blank'
											rel='noopener noreferrer'
											style={{ marginRight: "10px" }}>
											{doc.originalName || `Document ${index + 1}`}
										</a>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<p>No documents uploaded yet.</p>
				)}
			</div>
		);
	};

	return (
		<div className='document-upload-container'>
			<h3>Upload Documents</h3>

			<div className='service-selection'>{renderServiceSelection()}</div>

			{renderUploadedDocuments()}

			<div className='file-input'>
				<input
					type='file'
					multiple
					onChange={handleFileChange}
					accept='application/pdf,image/*'
				/>
			</div>

			{files.length > 0 && (
				<div className='file-preview'>
					<h4>Selected Files:</h4>
					<ul>
						{Array.from(files).map((file, index) => (
							<li key={index}>{file.name}</li>
						))}
					</ul>

					<div className='image-previews'>
						{imagePreviews.map(
							(preview, index) =>
								preview && (
									<img
										key={index}
										src={preview}
										alt={`Preview ${index}`}
										style={{
											width: "100px",
											height: "100px",
											objectFit: "cover",
										}}
									/>
								)
						)}
					</div>
				</div>
			)}

			<button
				onClick={handleUpload}
				disabled={files.length === 0 || !selectedServiceName}
				className='upload-button'>
				Upload Documents
			</button>

			{uploadError && <p className='error'>{uploadError}</p>}
			{message && <p className='message'>{message}</p>}
		</div>
	);
};

export default CDocumentUpload;
