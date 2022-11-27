import express from "express";
import { createPaymentRequest } from "./createMomoPayment.js";
const app = express();

app.get("/", async function (req, res) {
	const { orderInfo, amount } = req.query;
	if (!orderInfo || !amount) res.send("must provide orderInfo and amount");
	else {
		const payment = {
			orderInfo,
			amount
		};

		const payUrl = await createPaymentRequest(payment);
		res.send(payUrl);
	}
});

app.listen(8080, () => {
	console.log("server running on port 8080");
});

export default app;
