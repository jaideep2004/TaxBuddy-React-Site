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
	const [error, setError] = useState(null);

	useEffect(() => {
		let interval;
		fetchMessages();
		interval = setInterval(fetchMessages, 1000); // Fetch messages every 10 seconds
		return () => clearInterval(interval);
	}, []);

	const formatDate = (date) => {
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return new Date(date)
			.toLocaleDateString("en-GB", options)
			.replace(/ /g, " ")
			.replace(",", "");
	};

	const fetchMessages = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("customerToken");
			if (!token) {
				setError("No token found. Please log in again.");
				setLoading(false);
				return;
			}
			const response = await axios.get("http://localhost:5000/api/messages", {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Fetched Messages:", response.data.messages); // Debug log
			setMessages(response.data.messages.reverse());
		} catch (err) {
			console.error("Error fetching messages:", err);
			setError("Failed to load messages.");
		} finally {
			setLoading(false);
		}
	};

	const sendMessage = async () => {
		if (!selectedService || !query) {
			alert("Please select a service and type your message.");
			return;
		}

		const formData = new FormData();
		formData.append("sender", user?.name || "Customer");
		formData.append("recipientId", "admin");
		formData.append("content", query);
		formData.append("service", selectedService);
		files.forEach((file) => formData.append("files", file));

		try {
			const token = localStorage.getItem("customerToken");
			await axios.post("http://localhost:5000/api/messages/send", formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});
			setQuery(""); // Clear query input
			setFiles([]); // Clear files input
			fetchMessages(); // Refresh message list
		} catch (err) {
			console.error("Error sending message:", err);
			alert(err.response?.data?.message || "Failed to send message.");
		}
	};

	// if (loading) return <div>Loading messages...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div className='message-container'>
			{/* Messages Section */}
			<div className='messages-section'>
				<ul className='message-list'>
					{messages.map((msg, index) => (
						<li key={msg._id || index} className='message-item'>
							{/* Original Message */}
							<div className='message-wrapper customer'>
								<div className='message-info'>
									<span>
										<strong>{msg.sender?.name || "You"}</strong> to{" "}
										<strong>Support Team</strong>
									</span>
									<small className='message-timestamp'>
										{formatDate(msg.createdAt)}
									</small>
								</div>
								<p className='message-content'>{msg.content}</p>
								{msg.files?.map((file, idx) => (
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

							{/* Replies */}
							{msg.replyContent?.length > 0 &&
								msg.replyContent.map((reply, replyIdx) => (
									<div key={replyIdx} className='message-wrapper admin'>
										<div className='message-info'>
											<span>
												<strong>{reply.repliedBy || "Support Team"}</strong>
											</span>
											<small className='message-timestamp'>
												{formatDate(reply.createdAt)}
											</small>
										</div>
										<p className='message-content'>{reply.content}</p>
										{reply.files?.map((file, fileIdx) => (
											<div key={fileIdx} className='message-file'>
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
								))}
						</li>
					))}
				</ul>
			</div>

			{/* New Message Section */}
			<div className='new-message-section'>
				<form onSubmit={(e) => e.preventDefault()} className='message-form'>
					<div className='form-inputs'>
						<select
							value={selectedService}
							onChange={(e) => setSelectedService(e.target.value)}
							className='service-select'>
							<option value=''>Select Service</option>
							{services.map((service) => (
								<option key={service._id} value={service.serviceName}>
									{serviceMap[service.serviceName] || service.serviceName}
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
