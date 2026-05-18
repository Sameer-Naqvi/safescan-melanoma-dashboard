import { useEffect, useRef, useState } from "react";

export function useWebSocket(url) {
  const [lastMessage, setLastMessage] = useState(null);
  const [connected, setConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => { setConnected(true); };
    ws.current.onmessage = (event) => { setLastMessage(JSON.parse(event.data)); };
    ws.current.onclose = () => { setConnected(false); };

    const ping = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) ws.current.send("ping");
    }, 30000);

    return () => { clearInterval(ping); ws.current?.close(); };
  }, [url]);

  return { lastMessage, connected };
}
