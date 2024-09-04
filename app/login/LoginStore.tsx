import create from "zustand";

const UseLoginStore = create((set) => ({
  searchText: "",
  password: "",
  hidePassword: true,
  platformName: "",
  deviceName: "",
  serialNo: "",
  webInformation: {},

  setSearchText: (text: string) => set({ searchText: text }),
  setPassword: (password: any) => set({ password }),
  toggleHidePassword: () =>
    set((state: any) => ({ hidePassword: !state.hidePassword })),
  setDeviceInfo: ({ platformName, deviceName, serialNo }) =>
    set({ platformName, deviceName, serialNo }),
  setWebInformation: (webInformation: any) => set({ webInformation }),
}));

export default UseLoginStore;
