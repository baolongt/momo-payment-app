import crypto from "crypto";

export const createSignature = (payload) => {
	var secretkey = process.env.MOMO_SECRET_KEY;

	const {
		partnerCode,
		accessKey,
		redirectUrl,
		ipnUrl,
		requestType,
		extraData,
		orderInfo,
		amount,
		requestId,
		orderId
	} = payload;

	var rawSignature =
		"accessKey=" +
		accessKey +
		"&amount=" +
		amount +
		"&extraData=" +
		extraData +
		"&ipnUrl=" +
		ipnUrl +
		"&orderId=" +
		orderId +
		"&orderInfo=" +
		orderInfo +
		"&partnerCode=" +
		partnerCode +
		"&redirectUrl=" +
		redirectUrl +
		"&requestId=" +
		requestId +
		"&requestType=" +
		requestType;

	var signature = crypto
		.createHmac("sha256", secretkey)
		.update(rawSignature)
		.digest("hex");

	console.log("--------------------SIGNATURE----------------");
	console.log(signature);
	return signature;
};
