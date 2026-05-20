import { getData, storeData } from "../helper/storage";
import { enviornments } from "../environment/environment_constant";
import { apiPath } from "../environment/environment_urls";

const parseResponseBody = async (response) => {
    const responseContentType = response.headers.get('content-type') || '';

    if (responseContentType.includes('application/json')) {
        try {
            return await response.json();
        } catch (parseError) {
            console.warn('JSON parse failed for response body:', parseError?.message);
            return null;
        }
    }

    try {
        return await response.text();
    } catch (textError) {
        console.warn('Text parse failed for response body:', textError?.message);
        return null;
    }
};

const getErrorMessage = (parsedBody, response) => {
    if (typeof parsedBody === 'object' && parsedBody !== null) {
        return parsedBody.message || parsedBody.error || parsedBody.detail;
    }
    return `Request failed with status ${response.status}`;
};

const requestNewAccessToken = async (baseUrl, selectedLang) => {
    const refreshToken = await getData("refresh_token");

    if (!refreshToken) {
        return null;
    }

    const refreshUrl = `${baseUrl.replace(/\/+$/, '')}/${(apiPath?.auth?.refreshtoken || '').replace(/^\/+/, '')}`;
    const refreshHeaders = {
        "Accept-language": selectedLang || "en",
        "Content-Type": "application/json",
    };

    const refreshOptions = {
        method: "POST",
        headers: refreshHeaders,
        body: JSON.stringify({
            refresh: refreshToken,
            refresh_token: refreshToken,
        }),
    };

    const refreshResponse = await fetch(refreshUrl, refreshOptions);
    const refreshBody = await parseResponseBody(refreshResponse);

    if (!refreshResponse.ok) {
        return null;
    }

    const newAccessToken = refreshBody?.access_token || refreshBody?.access;
    const newRefreshToken = refreshBody?.refresh_token || refreshBody?.refresh;

    if (!newAccessToken) {
        return null;
    }

    await storeData("access_token", newAccessToken);
    if (newRefreshToken) {
        await storeData("refresh_token", newRefreshToken);
    }

    return newAccessToken;
};

const fetchApi = async (...args) => {
    const [method, url, token, isForm, body, resType, contentType] = args;
    const selectedLang = await getData("SelectedLanguage");
    const baseUrl = enviornments?.dev;
    const fullUrl = `${baseUrl.replace(/\/+$/, '')}/${(url || '').replace(/^\/+/, '')}`;
    
    let headers = {
        "Accept-language": selectedLang || "en",
    };
    console.log("header in fetchapi", headers);
    console.log("API URL:", fullUrl);

    if (token) {
        headers['Authorization'] = "Bearer " + token;
    }

    const methodUpper = String(method || '').toUpperCase();
    const canHaveJsonBody = methodUpper !== 'GET' && methodUpper !== 'HEAD';

    if (!isForm && canHaveJsonBody) {
        headers['Content-Type'] = contentType || 'application/json';
    }

    let options = {
        method,
        headers,
    };

    if (body) {
        options.body = isForm ? body : JSON.stringify(body);
    }

    console.log("Fetch options:", JSON.stringify(options, null, 2));

    try {
        const response = await fetch(fullUrl, options);
        console.log("Response status:", response.status);

        if (resType) {
            return response.blob();
        }

        let parsedBody = await parseResponseBody(response);

        const isUnauthorized = response.status === 401;
        const isRefreshEndpoint = url === apiPath?.auth?.refreshtoken;

        if (isUnauthorized && token && !isRefreshEndpoint) {
            const newAccessToken = await requestNewAccessToken(baseUrl, selectedLang);

            if (newAccessToken) {
                const retryHeaders = {
                    ...headers,
                    Authorization: "Bearer " + newAccessToken,
                };

                const retryOptions = {
                    ...options,
                    headers: retryHeaders,
                };

                const retryResponse = await fetch(fullUrl, retryOptions);

                if (resType) {
                    return retryResponse.blob();
                }

                parsedBody = await parseResponseBody(retryResponse);

                if (retryResponse.ok) {
                    return parsedBody;
                }

                return {
                    status: false,
                    message: getErrorMessage(parsedBody, retryResponse),
                    http_status: retryResponse.status,
                    data: parsedBody,
                };
            }
        }

        if (!response.ok) {
            return {
                status: false,
                message: getErrorMessage(parsedBody, response),
                http_status: response.status,
                data: parsedBody,
            };
        }

        return parsedBody;
    } catch (error) {
        console.error("Fetch error details:", error.message);
        console.error("Full error:", JSON.stringify(error));
        throw error;
    }
};


export {
    fetchApi
}