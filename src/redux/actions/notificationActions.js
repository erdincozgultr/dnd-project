export const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
export const ADD_NOTIFICATION = "ADD_NOTIFICATION";
export const MARK_AS_READ = "MARK_AS_READ";
export const MARK_ALL_READ = "MARK_ALL_READ";
export const SET_UNREAD_COUNT = "SET_UNREAD_COUNT";

export const setNotifications = (notifications) => ({
  type: SET_NOTIFICATIONS,
  payload: notifications,
});

export const addNotification = (notification) => ({
  type: ADD_NOTIFICATION,
  payload: notification,
});

export const markAsRead = (notificationId) => ({
  type: MARK_AS_READ,
  payload: notificationId,
});

export const markAllRead = () => ({
  type: MARK_ALL_READ,
});

export const setUnreadCount = (count) => ({
  type: SET_UNREAD_COUNT,
  payload: count,
});