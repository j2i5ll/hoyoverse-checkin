type Listener<T> = (newData: T) => void;
export abstract class Storage<T> {
  public readonly KEY;
  private listnerList: Listener<T>[] = [];
  constructor(key: string) {
    this.KEY = key;
  }

  async save(data: T) {
    return chrome.storage.local.set({ [this.KEY]: data });
  }
  async load() {
    const loadData = await chrome.storage.local.get([this.KEY]);
    return (loadData[this.KEY] as T) ?? null;
  }

  addChangeListener(listener: Listener<T>) {
    this.listnerList.push(listener);
    const handleStorageChange = (
      changes: chrome.storage.StorageChange,
      area: chrome.storage.AreaName,
    ) => {
      const targetChanged = Object.entries(changes).find(
        ([keyInStorage]) => keyInStorage === this.KEY,
      );
      if (area === 'local' && targetChanged) {
        const changes = targetChanged[1];
        const newStorageData = changes.newValue as T;

        this.listnerList.forEach((listener) => listener(newStorageData));
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
  }

  removeChangeListener(targetListener: Listener<T>) {
    const index = this.listnerList.findIndex(
      (listener) => targetListener === listener,
    );
    this.listnerList.splice(index, 1);
  }
}
