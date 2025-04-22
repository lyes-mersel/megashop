import { getNotificationSelect } from "@/lib/helpers/notifications";
import { NotificationType, Prisma } from "@prisma/client";

export type NotificationFromDB = Prisma.NotificationGetPayload<{
  select: ReturnType<typeof getNotificationSelect>;
}>;

export type NotificationFromAPI = {
  id: string;
  type: NotificationType;
  objet: string;
  text: string;
  date: Date;
  urlRedirection?: string;
  estLu: boolean;
  userId: string;
};
