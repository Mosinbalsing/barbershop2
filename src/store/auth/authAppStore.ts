import { create } from "zustand";
import { fetchApi } from "../../Api/http_services";
import { apiPath } from "../../environment/environment_urls";
import { getData } from "../../helper/storage";

type Permission = {
  module: string;
  view: boolean | number;
  add: boolean | number;
  edit: boolean | number;
  delete: boolean | number;
};

type AppStore = {
  isLoading: boolean;
  activeRole: string;
  permissions: Permission[];
  initialPermissions: Permission[];
  setLoading: (value: boolean) => void;
  setActiveRole: (role: string) => void;
  fetchPermissions: (role: string) => Promise<void>;
};

export const useAppStore = create<AppStore>((set) => ({
  isLoading: false,
  activeRole: "Admin",
  permissions: [],
  initialPermissions: [],

  setLoading: (value: boolean) => set({ isLoading: value }),
  setActiveRole: (role: string) => set({ activeRole: role }),

  fetchPermissions: async (role: string) => {
    try {
      set({ isLoading: true, activeRole: role });
      const token = await getData("access_token");
      const res = await fetchApi("GET", (apiPath as any)?.getAccessdata, token);
      const permissions = res?.data || [];
      set({ permissions, initialPermissions: permissions, isLoading: false });
    } catch (error) {
      console.log("FETCH PERMISSIONS ERROR", error);
      set({ isLoading: false });
    }
  },
}));
