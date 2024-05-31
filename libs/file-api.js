const url = "https://www.xiaoxunkj.com/api/storage-api";

const gerPreviewUrl = (fileId) => {
	return `${url}/file/preview/${fileId}`;
}

export default {
	gerPreviewUrl,
	baseUrl: url
};