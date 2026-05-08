jest.mock("react-native-mmkv", () => {
  const createStore = () => {
    const data = {};

    return {
      set: jest.fn((key, value) => {
        data[key] = String(value);
      }),
      getString: jest.fn((key) => data[key]),
      delete: jest.fn((key) => {
        delete data[key];
      }),
      clearAll: jest.fn(() => {
        Object.keys(data).forEach((key) => {
          delete data[key];
        });
      }),
    };
  };

  return {
    MMKV: jest.fn().mockImplementation(() => createStore()),
  };
});