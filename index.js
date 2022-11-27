import express from "express";
import { createPaymentRequest } from "./createMomoPayment.js";
const app = express();

app.get("/", async function (req, res) {
	const { orderInfo, amount } = req.query;
	const payment = {
		orderInfo,
		amount
	};
	const payUrl = await createPaymentRequest(payment);
	res.send(payUrl);
});

app.listen(9000);
