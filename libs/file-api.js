const url = "http://localhost:9000/storage-api";

const gerPreviewUrl = (fileId) => {
	return `${url}/file/preview/${fileId}`;
}

export default {
	gerPreviewUrl,
	baseUrl: url
};