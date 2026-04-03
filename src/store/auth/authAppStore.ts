import { create } from "zustand";
import { fetchApi } from "../../Api/http_services";
import { apiPath } from "../../environment/environment_urls";
import { getData } from "../../helper/storage";

// Define the type for role data objects
type RoleData = {
  role_name: string;
  permissions: {
    module: string;
    view: boolean | number;
    add: boolean | number;
    edit: boolean | number;
    delete: boolean | number;
  }[];
};

export const useAppStore = create((set, get) => ({
  isLoading: false,
  activeRole: "Admin",

  permissions: [],
  initialPermissions: [],

  setLoading: (value: boolean) => set({ isLoading: value }),
  setActiveRole: (role: string) => set({ activeRole: role }),

  /* ---------- FETCH PERMISSIONS ---------- */
  fetchPermissions: async (role: string) => {
    try {
      set({ isLoading: true, activeRole: role });

      const token = await getData("access_token"); // ✅ GET TOKEN HERE

      const res = await fetchApi(
        "GET",
        apiPath?.getAccessdata,
        token           //  TOKEN IN HEADER
      );

      console.log("FETCH PERMISSIONS RESPONSE 👉", res);

