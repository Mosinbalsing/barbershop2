import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPath } from "../../../environment/environment_urls";
import { fetchApi } from "../../../Api/http_services";
import { getData } from "../../../helper/storage";

export const useGetServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            const token = await getData("access_token");
            const response = await fetchApi('GET', apiPath.services?.list, token);
            console.log("get all services and Categories",response);
            return response;
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (serviceId: number) => {
            const token = await getData("access_token");
            const path = (apiPath.services?.delete || '').replace(':id', String(serviceId));
            const response = await fetchApi('DELETE', path, token);
            console.log("delete service",response);
            return response;
        },
        onMutate: async (serviceId: number) => {
            await queryClient.cancelQueries({ queryKey: ['services'] });
            const previous = queryClient.getQueryData<any[]>(['services']);
            const next = previous?.map(cat => ({
                ...cat,
                services: (cat.services || []).filter((s: any) => String(s.id) !== String(serviceId)),
            }));
            queryClient.setQueryData(['services'], next);
            return { previous };
        },
        onError: (_err, _vars, context: any) => {
            if (context?.previous) queryClient.setQueryData(['services'], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
};

export const useAddService = () => {
    return useMutation({
        mutationFn: async (serviceData: any) => {
            const token = await getData("access_token");
            const response = await fetchApi('POST', apiPath.services?.add, token, serviceData);
            console.log("add service",response);
            return response;
        },
    });
};

export const useUpdateService = () => {
    return useMutation({
        mutationFn: async ({ serviceId, serviceData }: { serviceId: number; serviceData: any }) => {
            const token = await getData("access_token");
            const path = (apiPath.services?.update || '').replace(':id', String(serviceId));
            const response = await fetchApi('PUT', path, token, serviceData);
            console.log("update service",response);
            return response;
        },
    });
};

export const useCategoryDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryId: number) => {
            const token = await getData("access_token");
            const path = (apiPath.services?.delete_category || '').replace(':id', String(categoryId));
            const response = await fetchApi('DELETE', path, token);
            console.log("delete category",response);
            return response;
        },
        onMutate: async (categoryId: number) => {
            await queryClient.cancelQueries({ queryKey: ['services'] });
            const previous = queryClient.getQueryData<any[]>(['services']);
            const next = previous?.filter(cat => String(cat.id) !== String(categoryId));
            queryClient.setQueryData(['services'], next);
            return { previous };
        },
        onError: (_err, _vars, context: any) => {
            if (context?.previous) queryClient.setQueryData(['services'], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
    });
}
export const useCategoryAdd = () => {
    return useMutation({
        mutationFn: async (categoryData: { name: string }) => {
            const token = await getData("access_token");
            const response = await fetchApi('POST', apiPath.services?.add_category, token, categoryData);
            console.log("add category",response);
            return response;
        },
    });
}