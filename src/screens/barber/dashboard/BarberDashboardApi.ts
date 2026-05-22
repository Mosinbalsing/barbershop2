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

export const useGetDashboardByDate = (selectedDate?: string) => {
    return useQuery({
        queryKey: ['barber-dashboard', selectedDate],
        queryFn: async () => {
            if (!selectedDate) return null;
            const token = await getData("access_token");
            const url = `${apiPath.barberDashboard}?selected_date=${selectedDate}`;
            const response = await fetchApi('GET', url, token);
            console.log("get dashboard by selected date", selectedDate, response);
            return response;
        },
        enabled: !!selectedDate,
    });
};