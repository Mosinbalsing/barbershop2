import { useMutation, useQuery } from "@tanstack/react-query";
import { apiPath } from "../../../environment/environment_urls";
import { fetchApi } from "../../../Api/http_services";
import { getData } from "../../../helper/storage";

type OwnerBookingsParams = {
    type: 'today' | 'future' | 'past';
    date?: string;
};

const buildOwnerBookingsUrl = ({ type, date }: OwnerBookingsParams) => {
    const params = new URLSearchParams();
    params.set('type', type);

    if (date) {
        params.set('date', date);
    }

    const queryString = params.toString();
    return queryString ? `${apiPath.booking.owner.list}?${queryString}` : apiPath.booking.owner.list;
};

export const useOwnerBookings = ({ type, date }: OwnerBookingsParams) => {
    return useQuery({
        queryKey: ['owner-bookings', type, date || ''],
        queryFn: async () => {
            const token = await getData("access_token");
            const response = await fetchApi('GET', buildOwnerBookingsUrl({ type, date }), token);
            console.log("get owner bookings",response);
            return response;
        },
    });
}