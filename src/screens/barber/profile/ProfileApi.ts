import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPath } from "../../../environment/environment_urls";
import { fetchApi } from "../../../Api/http_services";
import { getData } from "../../../helper/storage";


export const useGetProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const token = await getData("access_token");
            const response = await fetchApi('GET', apiPath?.profiles?.owner, token);
            console.log("get profile",response);
            return response;
        },
    });
};