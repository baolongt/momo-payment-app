import https from "https";
import * as dotenv from "dotenv";
import { createSignature } from "./createSignature.js";
dotenv.config();

const request = (requestBody) => {
	let url = "";
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "test-payment.momo.vn",
			port: 443,
			path: "/v2/gateway/api/create",
			method: "POST",
			headers: {
				"Content-Type": "application/json"
				// "Content-Length": JSON.stringify(Buffer.byteLength(requestBody))
			}
		};
		//Send the request and get the response
		const req = https.request(options, (res) => {
			res.setEncoding("utf8");
			res.on("data", (body) => {
				url = JSON.parse(body).payUrl;
			});
			res.on("end", () => {
				console.log("url", url);
				resolve(url);
			});
		});

		req.on("error", (e) => {
			console.log(`problem with request: ${e.message}`);
		});
		req.write(JSON.stringify(requestBody));
		req.end();
	});
};

const createBody = ({ orderInfo, amount }) => {
	var partnerCode = process.env.MOMO_PARTNER_CODE;
	var accessKey = process.env.MOMO_ACCESS_KEY;
	var requestId = partnerCode + new Date().getTime();
	var orderId = requestId;
	var redirectUrl = process.env.RETURN_URL;
	var ipnUrl = "http://localhost:3000";
	// var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
	var requestType = "captureWallet";
	var extraData = ""; //pass empty value if your merchant does not have stores

	var payload = {
		partnerCode,
		accessKey,
		requestId,
		orderId,
		redirectUrl,
		ipnUrl,
		requestType,
		extraData,
		orderInfo,
		amount
	};

	var signature = createSignature(payload);
	return {
		...payload,
		signature,
		orderInfo,
		amount,
		lang: "en"
	};
};

export const createPaymentRequest = async ({ orderInfo, amount }) => {
	const requestBody = createBody({ orderInfo, amount });
	try {
		return await request(requestBody);
	} catch (err) {
		console.log(err);
	}
};
