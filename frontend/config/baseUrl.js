function getBaseUrl(url) {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.host}`;
  }

const url = location.href;
const baseUrl = getBaseUrl(url);

export default baseUrl;