import { SelectedRoleIdType } from '@src/types';
import { Storage } from './Storage';

class SelectedRoleIdStore extends Storage<SelectedRoleIdType[]> {
  constructor() {
    super('selectedRoleId');
  }

  async getSelectedRoleIdList() {
    const list = await this.load();
    if (!list) {
      return [];
    }
    return list;
  }
  async setSelectedRoleId(newSelectedRoleId: SelectedRoleIdType) {
    const { actId } = newSelectedRoleId;
    const selectedRoleIdList = await this.getSelectedRoleIdList();
    const existIndex = selectedRoleIdList.findIndex(
      (selectedRoleId) => selectedRoleId.actId === actId,
    );
    if (existIndex > -1) {
      selectedRoleIdList[existIndex] = newSelectedRoleId;
    } else {
      selectedRoleIdList.push(newSelectedRoleId);
    }
    await this.save(selectedRoleIdList);
  }
}
export const selectedRoleIdStore = new SelectedRoleIdStore();
