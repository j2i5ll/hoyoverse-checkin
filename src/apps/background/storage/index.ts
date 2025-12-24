/**
 * load
 * save
 */

export const load = async <T>(key: string) => {
  const loadData = await chrome.storage.local.get([key]);
  return (loadData[key] as T) ?? null;
};

export const save = <T>(key: string, data: T) => {
  return chrome.storage.local.set({ [key]: data });
};
