import { ResourceNotificationType } from '@src/types';
import { Storage } from './Storage';

class ResourceNotificationStore extends Storage<ResourceNotificationType[]> {
  constructor() {
    super('resourceNotificationList');
  }
  async getResourceNotificationList () {
    const savedResourceNotificationList = await this.load();
    if (savedResourceNotificationList ) {
      return [];
    }
    return savedResourceNotificationList;
  }
  async add(resourceNoti: ResourceNotificationType) {
    const savedResourceNotificationList = await this.load() ?? [];
    savedResourceNotificationList.push(resourceNoti);
    await this.save(savedResourceNotificationList)
  }
  async update(index: number, resourceNoti:ResourceNotificationType ){
    const savedResourceNotificationList = await this.load() ?? [];
    savedResourceNotificationList[index] = resourceNoti;
    await this.save(savedResourceNotificationList)
  }
}
export const resourceNotificationStore = new ResourceNotificationStore();