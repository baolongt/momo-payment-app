import crypto from "crypto";
import https from "https";
import * as dotenv from "dotenv";
dotenv.config();

var partnerCode = process.env.MOMO_PARTNER_CODE;
var accessKey = process.env.MOMO_ACCESS_KEY;
var secretkey = process.env.MOMO_SECRET_KEY;

const createSignature = (payload) => {
	const { requestId, orderId } = payload;
	var rawSignature =
		"accessKey=" +
		accessKey +
		"&orderId=" +
		orderId +
		"&partnerCode=" +
		partnerCode +
		"&requestId=" +
		requestId;

	var signature = crypto
		.createHmac("sha256", secretkey)
		.update(rawSignature)
		.digest("hex");

	console.log("------------------CHECK---PAYMENT---SIGNATURE----------------");
	console.log(signature);

	return signature;
};

const request = (requestBody) => {
	let res = {};
	return new Promise((resolve, reject) => {
		const options = {
			hostname: "test-payment.momo.vn",
			port: 443,
			path: "/v2/gateway/api/query",
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
				res = JSON.parse(body);
			});
			res.on("end", () => {
				console.log("response", res);
				resolve(res);
			});
		});

		req.on("error", (e) => {
			console.log(`problem with request: ${e.message}`);
		});
		req.write(JSON.stringify(requestBody));
		req.end();
	});
};

export const validatePayment = async (requestId, orderId) => {
	const requetsBody = {
		partnerCode,
		requestId,
		orderId,
		lang: "en",
		signature: createSignature({ requestId, orderId })
	};
	console.log(requetsBody);
	try {
		return await request(requetsBody);
	} catch (err) {
		console.log(err);
	}
};
