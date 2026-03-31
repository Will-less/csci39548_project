import { useState, useEffect } from 'react';

const URL = "ws://localhost:6677";

function Texthooker() {
  //change to array later; we will define page size with indices
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(true);
  let line = '';

  const updateText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text);
    } catch (e) {
      //empty to prevent console spam
    }
  };

  useEffect(() => {
    const socket = new WebSocket(URL);

    socket.onopen = () => {
      console.log("it works");
      setConnected(true);
    };

    socket.onerror = () => {
      console.log("starting manual mode");
      setConnected(false);
      return;
    }

    socket.onmessage = (e) => {
      line = line + e.data + '\n';
      setText(line);
    }

    return () => {
      socket.close();
    }

  }, []);

  useEffect(() => {
    if (!connected) {
      window.addEventListener('focus', updateText);

      return () => {
        window.removeEventListener('focus', updateText);
      };
    }
  }, [connected]);

  return (
    <>
      <div className="whitespace-pre-wrap">
        {text}
      </div>
    </>
  )
}
export default Texthooker
