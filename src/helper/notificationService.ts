type Listener = (title: string, message: string) => void;
const listeners = new Set<Listener>();

export const notificationService = {
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  show: (title: string, message: string) => {
    listeners.forEach(listener => listener(title, message));
  }
};
