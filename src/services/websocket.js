import { useState, useEffect } from 'react';

const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8000';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.subscribers = new Set();
  }

  connect(userId) {
    this.ws = new WebSocket(`${WEBSOCKET_URL}/ws/tasks/${userId}`);

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(userId), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

const wsService = new WebSocketService();

export const useWebSocket = (userId) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (userId) {
      wsService.connect(userId);

      const unsubscribe = wsService.subscribe((data) => {
        if (data.type === 'task_update') {
          setTasks(prevTasks => {
            const taskIndex = prevTasks.findIndex(t => t.id === data.task.id);
            if (taskIndex >= 0) {
              const newTasks = [...prevTasks];
              newTasks[taskIndex] = data.task;
              return newTasks;
            }
            return [...prevTasks, data.task];
          });
        }
      });

      return () => {
        unsubscribe();
        wsService.disconnect();
      };
    }
  }, [userId]);

  return { tasks };
};

export default wsService; 