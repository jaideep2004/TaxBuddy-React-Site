
// import React, { useState, useEffect, useContext, useRef } from "react";
// import axios from "./utils/axiosConfig";
// import { AdminDashboardContext } from "./AdminDashboardContext";

// const AdminMessageCenter = () => {
// 	const [messages, setMessages] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState(null);
// 	const [replyFiles, setReplyFiles] = useState([]);
// 	const { isAuthenticated } = useContext(AdminDashboardContext);
// 	const messageEndRef = useRef(null); // Reference for scrolling
// 	const formatDate = (date) => {
// 		const options = { day: "2-digit", month: "short", year: "numeric" };
// 		const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
// 		return formattedDate.replace(/ /g, " ").replace(",", "");
// 	};

// 	useEffect(() => {
// 		let interval;
// 		if (isAuthenticated) {
// 			fetchMessages();
// 			// Fetch messages every 10 seconds
// 			interval = setInterval(fetchMessages, 1000);
// 		} else {
// 			console.log("User is not authenticated.");
// 		}

// 		// Cleanup interval on unmount
// 		return () => clearInterval(interval);
// 	}, [isAuthenticated]); // Re-fetch when authentication state changes

// 	useEffect(() => {
// 		// Scroll to the bottom whenever messages change
// 		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
// 	}, [messages]);

// 	const fetchMessages = async () => {
// 		try {
// 			setLoading(true);
// 			const token = localStorage.getItem("token");
// 			const response = await axios.get("http://localhost:5000/api/messages", {
// 				headers: { Authorization: `Bearer ${token}` },
// 			});
// 			setMessages(response.data.messages.reverse()); // Reverse to show newest messages at the bottom
// 		} catch (error) {
// 			console.error("Error fetching messages:", error);
// 			setError("Failed to load messages");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleMarkAsRead = async (messageId) => {
// 		try {
// 			await axios.patch(
// 				`http://localhost:5000/api/messages/${messageId}/read`,
// 				{},
// 				{
// 					headers: {
// 						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
// 					},
// 				}
// 			);
// 			setMessages((prevMessages) =>
// 				prevMessages.map((msg) =>
// 					msg._id === messageId ? { ...msg, status: "read" } : msg
// 				)
// 			);
// 		} catch (err) {
// 			setError("Failed to mark message as read.");
// 		}
// 	};

// 	const handleReply = async (messageId, replyContent, replyFiles) => {
// 		if (!replyContent) {
// 			alert("Please enter a reply.");
// 			return;
// 		}

// 		const formData = new FormData();
// 		formData.append("replyContent", replyContent);

// 		// Append files
// 		replyFiles.forEach((file) => formData.append("files", file));

// 		try {
// 			await axios.patch(
// 				`http://localhost:5000/api/messages/${messageId}/reply`,
// 				formData,
// 				{
// 					headers: {
// 						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
// 						"Content-Type": "multipart/form-data",
// 					},
// 				}
// 			);
// 			fetchMessages(); // Refresh messages after replying
// 		} catch (error) {
// 			console.error("Failed to send reply:", error);
// 		}
// 	};

// 	return (
// 		<div className='message-container'>
// 		<h2 className='message-center-header'>Message Center</h2>
		
// 		<ul className='message-list'>
// 		  {messages.map((message) => (
// 			<li key={message._id} className='message-item'>
// 			  {/* Initial message */}
// 			  <div className='initial-message'>
// 				<div className='message-info'>
// 				  <span>
// 					<strong>{message.sender.name}</strong> to{" "}
// 					<strong>{message.recipient.name}</strong>
// 				  </span>
// 				  <small className='message-timestamp'>
// 					{formatDate(message.createdAt)}
// 				  </small>
// 				</div>
// 				<p className='message-content'>{message.content}</p>
  
// 				{/* Message files */}
// 				{message.files &&
// 				  message.files.map((file, idx) => (
// 					<div key={idx} className='reply-file'>
// 					  {file.fileType?.startsWith("image/") ? (
// 						<img
// 						  src={file.fileUrl}
// 						  alt={file.fileName}
// 						  className='reply-image'
// 						/>
// 					  ) : (
// 						<a
// 						  href={file.fileUrl}
// 						  target='_blank'
// 						  rel='noopener noreferrer'
// 						  className='reply-file-link'>
// 						  {file.fileName}
// 						</a>
// 					  )}
// 					</div>
// 				  ))}
  
// 				{/* Mark as read button */}
// 				{message.status !== "read" && !message.reply && (
// 				  <button
// 					className='mark-read-button'
// 					onClick={() => handleMarkAsRead(message._id)}>
// 					Mark as Read
// 				  </button>
// 				)}
// 			  </div>
  
// 			  {/* Replies section */}
// 			  <div className='replies-container'>
// 				{message.replyContent.map((reply, index) => (
// 				  <div
// 					key={index}
// 					className={`reply-item ${reply.repliedBy === "admin" ? "admin" : "others"}`}>
// 					<p className='reply-info'>
// 					  {reply.repliedBy === "admin" ? "You" : reply.repliedBy}
// 					</p>
// 					<p className='reply-content'>{reply.content}</p>
  
// 					{/* Reply files */}
// 					{reply.files &&
// 					  reply.files.map((file, fileIndex) => (
// 						<div key={fileIndex} className='reply-file'>
// 						  {file.fileType?.startsWith("image/") ? (
// 							<img
// 							  src={file.fileUrl}
// 							  alt={file.fileName}
// 							  className='reply-image'
// 							/>
// 						  ) : (
// 							<a
// 							  href={file.fileUrl}
// 							  target='_blank'
// 							  rel='noopener noreferrer'
// 							  className='reply-file-link'>
// 							  {file.fileName}
// 							</a>
// 						  )}
// 						</div>
// 					  ))}
// 				  </div>
// 				))}
// 			  </div>
// 			  {/* <div ref={messageEndRef} /> */}
// 			  {/* Reply input section */}
// 			  {message.isRead && !message.reply && (
// 				<div className='reply-section'>
// 				  <textarea
// 					placeholder='Type your reply here...'
// 					id={`reply-${message._id}`}
// 					className='reply-textarea'
// 				  />
// 				  <input
// 					type='file'
// 					multiple
// 					onChange={(e) => setReplyFiles([...e.target.files])}
// 					className='file-input'
// 					id={`file-${message._id}`}
// 				  />
// 				  <button
// 					className='reply-button'
// 					onClick={() =>
// 					  handleReply(
// 						message._id,
// 						document.getElementById(`reply-${message._id}`).value,
// 						replyFiles
// 					  )
// 					}>
// 					➤
// 				  </button>
// 				</div>
// 			  )}
// 			</li>
// 		  ))}
// 		</ul>
  
// 		{/* Scroll to the bottom ref */}
// 	  </div>
// 	);
// };

// export default AdminMessageCenter;


import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const AdminMessageCenter = () => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [replyFiles, setReplyFiles] = useState([]);
	const { isAuthenticated } = useContext(AdminDashboardContext);
	const messageEndRef = useRef(null); // Reference for scrolling

	// Format the date for messages
	const formatDate = (date) => {
		const options = { day: "2-digit", month: "short", year: "numeric" };
		const formattedDate = new Date(date).toLocaleDateString("en-GB", options);
		return formattedDate.replace(/ /g, " ").replace(",", "");
	};

	// Fetch messages from the backend
	useEffect(() => {
		let interval;
		if (isAuthenticated) {
			fetchMessages();
			// Fetch messages every 10 seconds
			interval = setInterval(fetchMessages, 1000);
		} else {
			console.log("User is not authenticated.");
		}

		// Cleanup interval on unmount
		return () => clearInterval(interval);
	}, [isAuthenticated]); // Re-fetch when authentication state changes

	// Scroll to the bottom whenever messages change
	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Fetch messages from the backend API
	const fetchMessages = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const response = await axios.get("http://localhost:5000/api/messages", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessages(response.data.messages.reverse()); // Reverse to show newest messages at the bottom
		} catch (error) {
			console.error("Error fetching messages:", error);
			setError("Failed to load messages");
		} finally {
			setLoading(false);
		}
	};

	// Mark a message as read
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

	// Handle reply with files
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
		<div className="message-container">
			<h2 className="message-center-header">Message Center</h2>
			<ul className="message-list">
				{messages.map((message) => (
					<li key={message._id} className="message-item">
						{/* Initial message */}
						<div className="initial-message">
							<div className="message-info">
								<span>
									<strong>{message.sender.name}</strong> to{" "}
									<strong>{message.recipient.name}</strong>
								</span>
								<small className="message-timestamp">
									{formatDate(message.createdAt)}
								</small>
							</div>
							<p className="message-content">{message.content}</p>

							{/* Message files */}
							{message.files &&
								message.files.map((file, idx) => (
									<div key={idx} className="reply-file">
										{file.fileType?.startsWith("image/") ? (
											<img
												src={file.fileUrl}
												alt={file.fileName}
												className="reply-image"
											/>
										) : (
											<a
												href={file.fileUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="reply-file-link"
											>
												{file.fileName}
											</a>
										)}
									</div>
								))}

							{/* Mark as read button */}
							{message.status !== "read" && !message.reply && (
								<button
									className="mark-read-button"
									onClick={() => handleMarkAsRead(message._id)}
								>
									Mark as Read
								</button>
							)}
						</div>

						{/* Replies section */}
						<div className="replies-container">
							{message.replyContent.map((reply, index) => (
								<div
									key={index}
									className={`reply-item ${
										reply.repliedBy === "admin" ? "admin" : "others"
									}`}
								>
									<p className="reply-info">
										{reply.repliedBy === "admin" ? "You" : reply.repliedBy}
									</p>
									<p className="reply-content">{reply.content}</p>

									{/* Reply files */}
									{reply.files &&
										reply.files.map((file, fileIndex) => (
											<div key={fileIndex} className="reply-file">
												{file.fileType?.startsWith("image/") ? (
													<img
														src={file.fileUrl}
														alt={file.fileName}
														className="reply-image"
													/>
												) : (
													<a
														href={file.fileUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="reply-file-link"
													>
														{file.fileName}
													</a>
												)}
											</div>
										))}
								</div>
							))}
						</div>

						{/* Reply input section */}
						{message.isRead && !message.reply && (
							<div className="reply-section">
								<textarea
									placeholder="Type your reply here..."
									id={`reply-${message._id}`}
									className="reply-textarea"
									
								/>
								<input
									type="file"
									multiple
									onChange={(e) => setReplyFiles([...e.target.files])}
									className="file-input"
									id={`file-${message._id}`}
								/>
								<button
									className="reply-button"
									onClick={() =>
										handleReply(
											message._id,
											document.getElementById(`reply-${message._id}`).value,
											replyFiles
										)
									}
								>
									➤
								</button>
							</div>
						)}
					</li>
				))}
			</ul>

			{/* Scroll to the bottom ref */}
		</div>
	);
};

export default AdminMessageCenter;
