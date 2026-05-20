import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPath } from "../../../environment/environment_urls";
import { fetchApi } from "../../../Api/http_services";
import { getData } from "../../../helper/storage";

export const useGetBarberDashboard = () => {
    return useQuery({
        queryKey: ['barber-dashboard'],
        queryFn: async () => {
            const token = await getData("access_token");
            const response = await fetchApi('GET', apiPath.barberDashboard, token);
            console.log("get barber dashboard",response);
            return response;
        },
    });
}