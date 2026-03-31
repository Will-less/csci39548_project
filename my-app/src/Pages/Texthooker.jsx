import { useState, useEffect } from 'react';

const URL = "ws://localhost:6677";

function Texthooker() {
  //change to array later; we will define page size with indices
  const [text, setText] = useState('');

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
    };

    socket.onmessage = (e) => {
      setText(e.data);
    }

    socket.onerror = () => {
      console.log("starting manual mode");
    }

  }, []);

  useEffect(() => {
    window.addEventListener('focus', updateText);

    return () => {
      window.removeEventListener('focus', updateText);
    };
  }, []);

  return (
    <>
      <div>
        {text}
      </div>
    </>
  )
}
export default Texthooker
