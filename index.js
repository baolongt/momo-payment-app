import express from "express";
import cors from "cors";
import { createPaymentRequest } from "./createMomoPayment.js";
import { validatePayment } from "./validatePayment.js";
const app = express();

app.use(cors());

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

app.get("/check", async function (req, res) {
	const { requestId, orderId } = req.query;
	if (!requestId || !orderId) res.send("must provide requestId and orderId");
	else {
		const trans = await validatePayment(requestId, orderId);
		res.send(trans);
	}
});

app.listen(8080, () => {
	console.log("server running on port 8080");
});

export default app;
