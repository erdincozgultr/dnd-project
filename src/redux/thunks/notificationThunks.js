import axiosClient from "../../api/axiosClient";
import {
  setNotifications,
  markAsRead,
  markAllRead,
  setUnreadCount,
} from "../actions/notificationActions";

export const fetchNotifications = () => async (dispatch) => {
  try {
    const response = await axiosClient.get("/notifications");
    dispatch(setNotifications(response.data));
  } catch (error) {
    console.error("Bildirimler yüklenemedi:", error);
  }
};

export const fetchUnreadCount = () => async (dispatch) => {
  try {
    const response = await axiosClient.get("/notifications/unread-count");
    dispatch(setUnreadCount(response.data.count || response.data));
  } catch (error) {
    console.error("Okunmamış sayısı alınamadı:", error);
  }
};

export const markNotificationRead = (notificationId) => async (dispatch) => {
  try {
    await axiosClient.patch(`/notifications/${notificationId}/read`);
    dispatch(markAsRead(notificationId));
  } catch (error) {
    console.error("Bildirim okunamadı:", error);
  }
};

export const markAllNotificationsRead = () => async (dispatch) => {
  try {
    await axiosClient.patch("/notifications/read-all");
    dispatch(markAllRead());
  } catch (error) {
    console.error("Bildirimler okunamadı:", error);
  }
};