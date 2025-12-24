import { ResourceNotificationType, SelectedRoleIdType } from '@src/types';
import { selectedRoleIdStore } from '@background/store/selectedRoleIdStore';
import { useEffect, useState } from 'react';
function useSelectedRoleId() {
  const [selectedRoleIdList, setSelectedRoleIdList] = useState<
    SelectedRoleIdType[]
  >([]);

  const setSelectedRoleId = async (newSelectedRoleId: SelectedRoleIdType) => {
    await selectedRoleIdStore.setSelectedRoleId(newSelectedRoleId);
  };
  const deleteSelectedRoleId = async (actId: string) => {
    const targetIndex = selectedRoleIdList.findIndex(selectedRoleId => selectedRoleId.actId === actId)
    if (targetIndex < 0 ) {
      return;
    }

    selectedRoleIdList.splice(targetIndex, 1)
    selectedRoleIdStore.save(selectedRoleIdList)
  }
  const updateResourceNotification = async (actId: string, resourceNotification: ResourceNotificationType) => {
    const updatedList = selectedRoleIdList.map(selectedRoleId => {
      if (selectedRoleId.actId === actId) {
        return {
          ...selectedRoleId,
          resourceNotification,
        }
      }
      return selectedRoleId;
    })
    selectedRoleIdStore.save(updatedList);

  }

  useEffect(() => {
    const initSelectedRoleIdListState = async () => {
      setSelectedRoleIdList(await selectedRoleIdStore.getSelectedRoleIdList());
    };
    initSelectedRoleIdListState();

    const selectedRoleIdListChagneHandler = (
      newSelectedRoleIdList: SelectedRoleIdType[],
    ) => {
      setSelectedRoleIdList(newSelectedRoleIdList);
    };
    selectedRoleIdStore.addChangeListener(selectedRoleIdListChagneHandler);

    return () =>
      selectedRoleIdStore.removeChangeListener(selectedRoleIdListChagneHandler);
  }, []);
  return {
    selectedRoleIdList,
    setSelectedRoleId,
    deleteSelectedRoleId,
    updateResourceNotification,
  };
}
export { useSelectedRoleId };
