import React from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const PaymentHistory = () => {
	const { user, paymentHistory, loading } = useCustomerAuth();

	if (loading) {
		return <div>Loading...</div>;
	}

	// Calculate total payments (if paymentHistory exists and is an array)
	const totalPayments =
		user?.paymentHistory?.reduce(
			(total, payment) => total + payment.amount,
			0
		) || 0;

	return (
		<div className='ctax-dashboard-section'>
			<div className='cdashboard-summary'>
				<h3>Recent Payments</h3>
				<div className='cpayemnt-history'>
					{user?.paymentHistory?.length > 0 ? (
						<table className='payment-history-table'>
							<thead>
								<tr>
									<th>Date</th>
									<th>Payment ID</th>
									<th>Amount</th>
									<th>Method</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{user.paymentHistory.map((payment, index) => (
									<tr key={index}>
										<td>{new Date(payment.date).toLocaleDateString()}</td>
										<td>{payment.paymentId}</td>
										<td>₹{payment.amount}</td>
										<td>{payment.paymentMethod}</td>
										<td>{payment.status}</td>
										
										
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>No recent activity</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default PaymentHistory;
