// import React, { useState, useEffect, useContext } from "react";
// import axios from "./utils/axiosConfig";
// import { AdminDashboardContext } from "./AdminDashboardContext";

// const AdminMessageCenter = () => {
// 	const [messages, setMessages] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);

// 	const { isAuthenticated } = useContext(AdminDashboardContext);

// 	useEffect(() => {
// 		if (isAuthenticated) {
// 			fetchMessages();
// 		} else {
// 			console.log("User is not authenticated.");
// 		}
// 	}, [isAuthenticated]);

// 	const fetchMessages = async () => {
// 		try {
// 			setLoading(true);
// 			const token = localStorage.getItem("token");
// 			const response = await axios.get(`http://localhost:5000/api/messages`, {
// 				headers: { Authorization: `Bearer ${token}` },
// 			});
// 			setMessages(response.data.messages);
// 		} catch (error) {
// 			console.error("Error fetching messages:", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleMarkAsRead = async (messageId) => {
// 		try {
// 			// Correct URL without the colon `:messageId`
// 			await axios.patch(
// 				`http://localhost:5000/api/messages/${messageId}/read`, // Corrected URL
// 				{},
// 				{
// 					headers: {
// 						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
// 					},
// 				}
// 			);
// 			// Update the status of the message in the frontend
// 			setMessages((prevMessages) =>
// 				prevMessages.map((msg) =>
// 					msg._id === messageId ? { ...msg, status: "read" } : msg
// 				)
// 			);
// 		} catch (err) {
// 			setError("Failed to mark message as read.");
// 		}
// 	};

// 	const handleReply = async (messageId, replyContent) => {
// 		try {
// 			await axios.patch(
// 				`http://localhost:5000/api/messages/${messageId}/reply`,
// 				{ replyContent },
// 				{
// 					headers: {
// 						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
// 					},
// 				}
// 			);
// 			fetchMessages(); // Reload messages after replying
// 		} catch (err) {
// 			setError("Failed to send reply.");
// 		}
// 	};
// 	return (
// 		<div>
// 			<h2>Message Center</h2>
// 			{loading && <p>Loading messages...</p>}
// 			{error && <p>{error}</p>}
// 			<ul>
// 				{messages.map((message) => (
// 					<li key={message._id}>
// 						<div>
// 							<strong>{message.sender.name}</strong> to{" "}
// 							<strong>{message.recipient.name}</strong>
// 						</div>
// 						<p>{message.content}</p>
// 						<small>{message.createdAt}</small>
// 						<p>Status: {message.status}</p>
// 						{message.status !== "read" && (
// 							<button onClick={() => handleMarkAsRead(message._id)}>
// 								Mark as Read
// 							</button>
// 						)}
// 						{message.status === "read" && !message.reply && (
// 							<div>
// 								<textarea
// 									placeholder='Type your reply here...'
// 									id={`reply-${message._id}`}></textarea>
// 								<button
// 									onClick={() =>
// 										handleReply(
// 											message._id,
// 											document.getElementById(`reply-${message._id}`).value
// 										)
// 									}>
// 									Reply
// 								</button>
// 							</div>
// 						)}
// 						{message.reply && (
// 							<div>
// 								<strong>Admin Reply:</strong>
// 								<p>{message.reply}</p>
// 							</div>
// 						)}
// 					</li>
// 				))}
// 			</ul>
// 		</div>
// 	);
// };

// export default AdminMessageCenter;

import React, { useState, useEffect, useContext } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const AdminMessageCenter = () => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [replyFiles, setReplyFiles] = useState([]); // To store uploaded files

	const { isAuthenticated } = useContext(AdminDashboardContext);

	// useEffect(() => {
	// 	if (isAuthenticated) {
	// 		fetchMessages();
	// 	} else {
	// 		console.log("User is not authenticated.");
	// 	}
	// }, [isAuthenticated]);
	useEffect(() => {
		let interval;
		if (isAuthenticated) {
			fetchMessages();
			// Fetch messages every 10 seconds
			interval = setInterval(fetchMessages, 10000);
		} else {
			console.log("User is not authenticated.");
		}
	
		// Cleanup interval on unmount
		return () => clearInterval(interval);
	}, [isAuthenticated]);
	

	const fetchMessages = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const response = await axios.get("http://localhost:5000/api/messages", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessages(response.data.messages);
		} catch (error) {
			console.error("Error fetching messages:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsRead = async (messageId) => {
		try {
			await axios.patch(
				`http://localhost:5000/api/messages/${messageId}/read`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
					},
				}
			);
			setMessages((prevMessages) =>
				prevMessages.map((msg) =>
					msg._id === messageId ? { ...msg, status: "read" } : msg
				)
			);
		} catch (err) {
			setError("Failed to mark message as read.");
		}
	};

	// const handleReply = async (messageId, replyContent) => {
	// 	try {
	// 		await axios.patch(
	// 			`http://localhost:5000/api/messages/${messageId}/reply`,
	// 			{ replyContent },
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
	// 				},
	// 			}
	// 		);
	// 		fetchMessages(); // Reload messages after replying
	// 	} catch (err) {
	// 		setError("Failed to send reply.");
	// 	}
	// };

	const handleReply = async (messageId, replyContent, replyFiles) => {
		if (!replyContent) {
			alert("Please enter a reply.");
			return;
		}

		const formData = new FormData();
		formData.append("replyContent", replyContent);

		// Append files
		replyFiles.forEach((file) => formData.append("files", file));

		try {
			await axios.patch(
				`http://localhost:5000/api/messages/${messageId}/reply`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);
			fetchMessages(); // Refresh messages after replying
		} catch (error) {
			console.error("Failed to send reply:", error);
		}
	};

	return (
		<div>
			<h2>Message Center</h2>
			{loading && <p>Loading messages...</p>}
			{error && <p>{error}</p>}
			<ul>
				{messages.map((message) => (
					<li key={message._id}>
						<div>
							<strong>{message.sender.name}</strong> to{" "}
							<strong>{message.recipient.name}</strong>
						</div>
						<p>{message.content}</p>
						<small>{message.createdAt}</small>
						<p>Status: {message.status}</p>

						{message.status !== "read" && !message.reply && (
							<button onClick={() => handleMarkAsRead(message._id)}>
								Mark as Read
							</button>
						)}

						{message.isRead && !message.reply && (
							<div>
								<textarea
									placeholder='Type your reply here...'
									id={`reply-${message._id}`}></textarea>
								<input
									type='file'
									multiple
									onChange={(e) => setReplyFiles([...e.target.files])}
								/>
								<button
									onClick={() =>
										handleReply(
											message._id,
											document.getElementById(`reply-${message._id}`).value,
											replyFiles
										)
									}>
									Reply
								</button>
							</div>
						)}

						{message.files &&
							message.files.map((file, idx) => (
								<p key={idx}>
									<a
										href={file.fileUrl}
										target='_blank'
										rel='noopener noreferrer'>
										{file.fileName}
									</a>
								</p>
							))}

						{/* {message.replyContent && (
							<div>
								<strong>Admin Reply:</strong>
								<p>{message.replyContent.content}</p>
								{message.replyContent.files &&
									message.replyContent.files.map((file, idx) => (
										<p key={idx}>
											<a
												href={file.fileUrl}
												target='_blank'
												rel='noopener noreferrer'>
												{file.fileName}
											</a>
										</p>
									))}
							</div>
						)} */}
						{/* Show admin replies if available */}
						{message.replyContent && message.replyContent.length > 0 && (
							<div>
								<h4>Replies:</h4>
								{message.replyContent.map((reply, index) => (
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
															style={{ maxWidth: "200px", marginTop: "1em" }}
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
					</li>
				))}
			</ul>
		</div>
	);
};

export default AdminMessageCenter;
