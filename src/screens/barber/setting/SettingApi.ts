import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPath } from "../../../environment/environment_urls";
import { fetchApi } from "../../../Api/http_services";
import { getData } from "../../../helper/storage";

export const useGetSettings = () => {
    return useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const token = await getData("access_token");
            const response = await fetchApi('GET', apiPath.settings.get, token);
            // fetchApi already parses and returns the JSON body, or an error object.
            if (response && response.status === false) {
                throw new Error(response.message || 'Failed to fetch settings');
            }
            console.log("response", response);
            return response;
        }
    });
};


export const usePostSettings = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const token = await getData("access_token");
            console.log("this my seting data from frontend", data, token);

            // fetchApi args: method, url, token, isForm, body
            const response = await fetchApi('POST', apiPath.settings.save, token, false, data);
            // fetchApi already parses and returns the JSON body, or an error object.
            if (response && response.status === false) {
                throw new Error(response.message || 'Failed to fetch settings');
            }
            console.log("response post setting", response);
            return response;
        }
    });
};  