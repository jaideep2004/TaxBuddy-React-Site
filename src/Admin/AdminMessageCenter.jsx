import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "./utils/axiosConfig";
import { AdminDashboardContext } from "./AdminDashboardContext";

const AdminMessageCenter = () => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [replyFiles, setReplyFiles] = useState({});
	const [replyContent, setReplyContent] = useState({});
	const { isAuthenticated, user } = useContext(AdminDashboardContext);
	const messageEndRef = useRef(null);

	const formatDate = (date) => {
		const options = { day: "2-digit", month: "short", year: "numeric" };
		return new Date(date)
			.toLocaleDateString("en-GB", options)
			.replace(/ /g, " ")
			.replace(",", "");
	};

	useEffect(() => {
		let interval;
		fetchMessages();
		interval = setInterval(fetchMessages, 10000);
		return () => clearInterval(interval);
	}, []);

	const fetchMessages = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("adminToken");
			const response = await axios.get("http://localhost:5000/api/messages", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessages(response.data.messages.reverse());
		} catch (error) {
			console.error("Error fetching messages:", error);
			setError("Failed to load messages");
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

	const handleReply = async (messageId) => {
		if (!replyContent[messageId]) {
			alert("Please enter a reply.");
			return;
		}

		const formData = new FormData();
		formData.append("replyContent", replyContent[messageId]);
		(replyFiles[messageId] || []).forEach((file) =>
			formData.append("files", file)
		);
		console.log(formData);

		try {
			// await axios.patch(
			// 	`http://localhost:5000/api/messages/${messageId}/reply`,
			// 	formData,
			// 	{
			// 		headers: {
			// 			Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
			// 			"Content-Type": "multipart/form-data",
			// 		},
			// 	}
			// );
			await axios.patch(
				`http://localhost:5000/api/messages/${messageId}/reply`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
					},
				}
			);

			setReplyContent((prev) => ({ ...prev, [messageId]: "" }));
			setReplyFiles((prev) => ({ ...prev, [messageId]: [] }));
			fetchMessages();
		} catch (error) {
			console.error("Failed to send reply:", error);
		}
	};

	const handleFileChange = (messageId, files) => {
		setReplyFiles((prev) => ({
			...prev,
			[messageId]: [...(files || [])],
		}));
	};

	if (error) return <div>Error: {error}</div>;

	return (
		<div className='message-container'>
			<ul className='message-list'>
				{messages.map((message) => (
					<li key={message._id} className='message-item'>
						<div className='initial-message'>
							<div className='message-info'>
								<span>
									<strong>{message.sender?.name || "Unknown Sender"}</strong> to{" "}
									<strong>
										{message.recipient?.name || "Unknown Recipient"}
									</strong>
								</span>
								<small className='message-timestamp'>
									{formatDate(message.createdAt)}
								</small>
							</div>
							<p className='message-content'>{message.content}</p>
							{message.files?.map((file, idx) => (
								<div key={idx} className='reply-file'>
									{file.fileType?.startsWith("image/") ? (
										<img
											src={file.fileUrl}
											alt={file.fileName}
											className='reply-image'
										/>
									) : (
										<a
											href={file.fileUrl}
											target='_blank'
											rel='noopener noreferrer'
											className='reply-file-link'>
											{file.fileName}
										</a>
									)}
								</div>
							))}
							{message.status !== "read" && (
								<button
									className='mark-read-button'
									onClick={() => handleMarkAsRead(message._id)}>
									Mark as Read
								</button>
							)}
						</div>

						<div className='replies-container'>
							{Array.isArray(message.replyContent) &&
								message.replyContent.map((reply, index) => (
									<div key={index} className='reply-item'>
										<p className='reply-info'>
											{reply.repliedBy === user?._id ? "You" : "Support Team"}
										</p>
										<p className='reply-content'>{reply.content}</p>
										{reply.files?.map((file, fileIndex) => (
											<div key={fileIndex} className='reply-file'>
												{file.fileType?.startsWith("image/") ? (
													<img
														src={file.fileUrl}
														alt={file.fileName}
														className='reply-image'
													/>
												) : (
													<a
														href={file.fileUrl}
														target='_blank'
														rel='noopener noreferrer'
														className='reply-file-link'>
														{file.fileName}
													</a>
												)}
											</div>
										))}
									</div>
								))}
						</div>

						<div className='reply-section'>
							<textarea
								placeholder='Type your reply here...'
								value={replyContent[message._id] || ""}
								onChange={(e) =>
									setReplyContent((prev) => ({
										...prev,
										[message._id]: e.target.value,
									}))
								}
								className='reply-textarea'
							/>
							<input
								type='file'
								multiple
								onChange={(e) =>
									handleFileChange(message._id, Array.from(e.target.files))
								}
								className='file-input'
							/>
							<button
								className='reply-button'
								onClick={() => handleReply(message._id)}>
								➤
							</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AdminMessageCenter;
