import {
  NotificationFromDB,
  NotificationFromAPI,
} from "@/lib/types/notification.types";

export function getNotificationSelect() {
  return {
    id: true,
    type: true,
    objet: true,
    text: true,
    date: true,
    urlRedirection: true,
    estLu: true,
    userId: true,
  };
}

export function formatNotificationData(
  notif: NotificationFromDB
): NotificationFromAPI {
  return notif as NotificationFromAPI;
}
