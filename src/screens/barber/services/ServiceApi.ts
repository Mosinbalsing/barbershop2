import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPath } from "../../../environment/environment_urls";
import { fetchApi } from "../../../Api/http_services";
import { getData } from "../../../helper/storage";

export const useGetServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const token = await getData("access_token");
            const response = await fetchApi('GET', apiPath.services?.list, token);
            console.log("get all services",response);
            return response;
        },
    });
};