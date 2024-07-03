export const setItem = (key: string, item: string) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(item));
  } catch (err) {
    console.error("local storage setItem error:", err);
  }
};

export const getItem = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    console.error("local storage getItem error:", err);
  }
};

export const removeItem = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.error("local storage removeItem error:", err);
  }
};
