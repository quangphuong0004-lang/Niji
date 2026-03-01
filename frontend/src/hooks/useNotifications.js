import { useEffect, useState, useCallback } from "react";
import api from "../services/api";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    api.get("/notifications/")
      .then(res => {
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.is_read).length);
      })
      .catch(err => console.error("Failed to load notifications", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);

    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    };
    ws.onclose = () => setWsConnected(false);
    ws.onerror = (e) => console.error("WebSocket error", e);

    return () => ws.close();
  }, []);

  const markAllRead = useCallback(async () => {
    await api.post("/notifications/read/");
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, []);

  const markOneRead = useCallback(async (id) => {
    await api.post(`/notifications/${id}/read/`);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  return { notifications, unreadCount, markAllRead, markOneRead, wsConnected };
};