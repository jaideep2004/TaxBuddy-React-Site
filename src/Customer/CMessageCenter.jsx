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
		let interval;

		fetchMessages();
		// Fetch messages every 10 seconds
		interval = setInterval(fetchMessages, 1000);

		return () => clearInterval(interval);
	}, []);

	const formatDate = (date) => {
		const options = { day: "2-digit", month: "short", year: "numeric" };
		const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
		return formattedDate.replace(/ /g, " ").replace(",", "");
	};

	const fetchMessages = async () => {
		try {
			const token = localStorage.getItem("customerToken");
			const response = await axios.get("http://localhost:5000/api/messages", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessages(response.data.messages.reverse());
			setLoading(false);
		} catch (error) {
			console.error("Error fetching messages:", error);
			setLoading(false);
		}
	};

	const sendMessage = async () => {
		if (!selectedService || !query) {
			alert("Please select a service and type your message.");
			return;
		}

		console.log("User object:", user); // Log the entire user object
		console.log("User ID:", user._id); // Log specifically the ID

		const formData = new FormData();
		formData.append("sender", user._id);
		formData.append("recipientId", "admin");
		formData.append("content", query);
		formData.append("service", selectedService);

		// Log the FormData (needs special handling)
		for (let pair of formData.entries()) {
			console.log(pair[0], pair[1]);
		}

		files.forEach((file) => formData.append("files", file));

		try {
			const token = localStorage.getItem("customerToken");
			const response = await axios.post(
				"http://localhost:5000/api/messages/send",
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			console.log("Response:", response.data); // Log the response

			setQuery("");
			setFiles([]);
			fetchMessages();
		} catch (error) {
			console.error("Full error object:", error);
			console.error("Error response data:", error.response?.data);
			alert(error.response?.data?.message || "Failed to send message");
		}
	};
	return (
		<div className='message-container'>
			<div className='messages-section'>
				<ul className='message-list'>
					{messages.map((msg, index) => (
						<li key={index} className='message-item'>
							{/* Original message from customer */}
							<div className='message-wrapper customer'>
								<div className='message-content-wrapper'>
									<div className='message-info'>
										<span>
											<strong>{user?.name || "You"}</strong> to{" "}
											<strong>Support Team</strong>
										</span>
										<small className='message-timestamp'>
											{formatDate(msg.createdAt)}
										</small>
									</div>

									<p className='message-content'>{msg.content}</p>

									{msg.files &&
										msg.files.map((file, idx) => (
											<div key={idx} className='message-file'>
												{file.fileType?.startsWith("image/") ? (
													<img
														src={file.fileUrl}
														alt={file.fileName}
														className='message-image'
													/>
												) : (
													<a
														href={file.fileUrl}
														target='_blank'
														rel='noopener noreferrer'
														className='file-link'>
														{file.fileName}
													</a>
												)}
											</div>
										))}
								</div>
							</div>

							{/* Replies from admin */}
							{msg.replyContent && msg.replyContent.length > 0 && (
								<div className='replies-container'>
									{msg.replyContent.map((reply, replyIdx) => (
										<div key={replyIdx} className='message-wrapper admin'>
											<div className='message-content-wrapper'>
												<div className='message-info'>
													<span>
														<strong>{reply.repliedBy}</strong>
													</span>
												</div>
												<p className='message-content'>{reply.content}</p>

												{reply.files &&
													reply.files.map((file, fileIdx) => (
														<div key={fileIdx} className='message-file'>
															{file.fileType?.startsWith("image/") ? (
																<img
																	src={`http://localhost:5000${file.fileUrl}`}
																	alt={file.fileName}
																	className='message-image'
																/>
															) : (
																<a
																	href={`http://localhost:5000${file.fileUrl}`}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='file-link'>
																	{file.fileName}
																</a>
															)}
														</div>
													))}
											</div>
										</div>
									))}
								</div>
							)}
						</li>
					))}
				</ul>
			</div>

			<div className='new-message-section'>
				<form onSubmit={(e) => e.preventDefault()} className='message-form'>
					<div className='form-inputs'>
						<select
							value={selectedService}
							onChange={(e) => setSelectedService(e.target.value)}
							className='service-select'>
							<option value=''>Select Service</option>
							{services.map((service, index) => (
								<option key={index} value={service.serviceId}>
									{serviceMap[service.serviceId] || "Unknown Service"}
								</option>
							))}
						</select>

						<textarea
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder='Type your message here...'
							className='message-textarea'
							rows='2'
						/>
					</div>

					<div className='form-actions'>
						<input
							type='file'
							multiple
							onChange={(e) => setFiles([...e.target.files])}
							className='file-input'
						/>
						<button onClick={sendMessage} className='send-button'>
							Send ➤
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CMessageCenter;
