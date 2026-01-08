export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNativeNotification = (title: string, body: string) => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "granted") {
    try {
        new Notification(title, {
            body,
            icon: 'https://cdn-icons-png.flaticon.com/512/3004/3004458.png', // Generic medical icon placeholder
            tag: 'master-gn7-alert'
        });
    } catch (e) {
        console.error("Notification failed", e);
    }
  }
};