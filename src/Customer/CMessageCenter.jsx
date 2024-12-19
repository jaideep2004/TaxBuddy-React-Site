// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useCustomerAuth } from "./CustomerAuthContext";

// const CMessageCenter = () => {
// 	const { user, services, serviceMap } = useCustomerAuth(); // Access service map for quick lookups
// 	const [selectedService, setSelectedService] = useState("");
// 	const [query, setQuery] = useState("");
// 	const [messages, setMessages] = useState([]);
// 	const [loading, setLoading] = useState(true);

// 	// Fetch messages for the customer
// 	useEffect(() => {
// 		fetchMessages();
// 	}, []);

// 	const fetchMessages = async () => {
// 		try {
// 			const token = localStorage.getItem("token");
// 			const response = await axios.get("http://localhost:5000/api/messages/", {
// 				headers: { Authorization: `Bearer ${token}` },
// 			});
// 			setMessages(response.data.messages);
// 		} catch (error) {
// 			console.error("Error fetching messages:", error);
// 		}
// 	};

// 	const sendMessage = async () => {
// 		if (!selectedService || !query) {
// 			alert("Please select a service and type your message.");
// 			return;
// 		}

// 		try {
// 			const token = localStorage.getItem("token");
// 			await axios.post(
// 				"http://localhost:5000/api/messages/send",
// 				{
// 					recipientId: "admin_or_employee_id", // Replace dynamically
// 					content: query,
// 					service: selectedService,
// 				},
// 				{ headers: { Authorization: `Bearer ${token}` } }
// 			);

// 			setQuery(""); // Reset query field
// 			fetchMessages(); // Refresh message list
// 		} catch (error) {
// 			console.error("Error sending message:", error);
// 		}
// 	};

// 	return (
// 		<div>
// 			<h1>Message Center</h1>
// 			<form onSubmit={(e) => e.preventDefault()}>
// 				<label>Service</label>
// 				<select
// 					value={selectedService}
// 					onChange={(e) => setSelectedService(e.target.value)}>
// 					<option value=''>Select a Service</option>
// 					{services.map((service, index) => (
// 						<option key={index} value={service.serviceId}>
// 							{serviceMap[service.serviceId] || "Unknown Service"}
// 						</option>
// 					))}
// 				</select>

// 				<label>Message</label>
// 				<textarea
// 					value={query}
// 					onChange={(e) => setQuery(e.target.value)}
// 					placeholder='Type your query here'
// 				/>

// 				<button onClick={sendMessage}>Send</button>
// 			</form>

// 			<h2>Your Queries</h2>
// 			{messages.length > 0 ? (
// 				messages.map((msg, index) => (
// 					<div
// 						key={index}
// 						style={{
// 							margin: "1em 0",
// 							padding: "1em",
// 							border: "1px solid #ccc",
// 						}}>
// 						<p>
// 							<strong>Service:</strong>{" "}
// 							{serviceMap[msg.service] || "Unknown Service"}
// 						</p>
// 						<p>
// 							<strong>Message:</strong> {msg.content}
// 						</p>
// 						{msg.isReplied && (
// 							<div>
// 								<p>
// 									<strong>Reply:</strong> {msg.replyContent}
// 								</p>
// 							</div>
// 						)}
// 					</div>
// 				))
// 			) : (
// 				<p>No messages yet.</p>
// 			)}
// 		</div>
// 	);
// };

// export default CMessageCenter;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCustomerAuth } from "./CustomerAuthContext";

const CMessageCenter = () => {
	const { user, services, serviceMap } = useCustomerAuth();
	const [selectedService, setSelectedService] = useState("");
	const [query, setQuery] = useState("");
	const [files, setFiles] = useState([]);
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchMessages();
	}, []);

	const fetchMessages = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get("http://localhost:5000/api/messages", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessages(response.data.messages);
		} catch (error) {
			console.error("Error fetching messages:", error);
		}
	};

	const sendMessage = async () => {
		if (!selectedService || !query) {
			alert("Please select a service and type your message.");
			return;
		}

		const formData = new FormData();
		formData.append("recipientId", "admin_or_employee_id"); // Replace dynamically
		formData.append("content", query);
		formData.append("service", selectedService);

		// Append files
		files.forEach((file) => formData.append("files", file));

		try {
			const token = localStorage.getItem("token");
			await axios.post("http://localhost:5000/api/messages/send", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			setQuery("");
			setFiles([]);
			fetchMessages(); // Refresh messages
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	return (
		<div>
			<h1>Message Center</h1>
			<form onSubmit={(e) => e.preventDefault()}>
				<label>Service</label>
				<select
					value={selectedService}
					onChange={(e) => setSelectedService(e.target.value)}>
					<option value=''>Select a Service</option>
					{services.map((service, index) => (
						<option key={index} value={service.serviceId}>
							{serviceMap[service.serviceId] || "Unknown Service"}
						</option>
					))}
				</select>

				<label>Message</label>
				<textarea
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder='Type your query here'
				/>

				<label>Upload Files</label>
				<input
					type='file'
					multiple
					onChange={(e) => setFiles([...e.target.files])}
				/>

				<button onClick={sendMessage}>Send</button>
			</form>

			<h2>Your Queries</h2>
			{messages.length > 0 ? (
				messages.map((msg, index) => (
					<div
						key={index}
						style={{
							margin: "1em 0",
							padding: "1em",
							border: "1px solid #ccc",
						}}>
						<p>
							<strong>Service:</strong>{" "}
							{serviceMap[msg.service] || "Unknown Service"}
						</p>
						<p>
							<strong>Message:</strong> {msg.content}
						</p>

						{/* Display uploaded files */}
						{msg.files &&
							msg.files.map((file, idx) => (
								<p key={idx}>
									<a
										href={file.fileUrl}
										target='_blank'
										rel='noopener noreferrer'>
										{file.fileName}
									</a>
								</p>
							))}

						{msg.isReplied && (
							<div>
								<p>
									<strong>Reply:</strong> {msg.replyContent.content}
								</p>

								{/* {msg.replyContent.files &&
									msg.replyContent.files.map((file, idx) => (
										<p key={idx}>
											<a
												href={file.fileUrl}
												target='_blank'
												rel='noopener noreferrer'>
												{file.fileName}
											</a>
										</p>
									))} */}
								{/* Display replies if any */}
								{msg.replyContent && msg.replyContent.length > 0 && (
									<div>
										<h4>Replies:</h4>
										{msg.replyContent.map((reply, index) => (
											<div
												key={index}
												style={{
													margin: "1em 0",
													padding: "1em",
													border: "1px solid #ccc",
												}}>
												<p>
													<strong>Replied By:</strong> {reply.repliedBy}
												</p>
												<p>
													<strong>Content:</strong> {reply.content}
												</p>

												{/* Display Images */}
												{reply.files &&
													reply.files.map((file, fileIndex) => (
														<div key={fileIndex}>
															{file.fileType.startsWith("image/") ? (
																<img
																	src={`http://localhost:5000${file.fileUrl}`}
																	alt={file.fileName}
																	style={{
																		maxWidth: "200px",
																		marginTop: "1em",
																	}}
																/>
															) : (
																<a
																	href={`http://localhost:5000${file.fileUrl}`}
																	target='_blank'
																	rel='noopener noreferrer'>
																	{file.fileName}
																</a>
															)}
														</div>
													))}
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				))
			) : (
				<p>No messages yet.</p>
			)}
		</div>
	);
};

export default CMessageCenter;