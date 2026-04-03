import { getData } from '../helper/storage';
import { apiPath } from '../environment/environment_urls';
export const deleteUserApi = async (userId) => {
    const token = await getData('access_token');

    const url = apiPath?.deleteUser + `${userId}/`;
    console.log(url, token);


    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const rawText = await response.text(); // 🔥 read once

    console.log('DELETE STATUS:', response);
    console.log('DELETE RAW RESPONSE:', rawText);

    // ✅ 204 No Content → SUCCESS
    if (response.status === 204) {
        return { success: true };
    }

    // ❌ HTML error page
    if (rawText.startsWith('<')) {
        throw new Error(`Server error (${response.status})`);
    }

    // ✅ JSON response
    return JSON.parse(rawText);
};
