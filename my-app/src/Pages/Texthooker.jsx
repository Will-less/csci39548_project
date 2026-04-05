import { useState, useEffect, useRef } from 'react';

//need Textractor and Textractor websocket to use
const URL = "ws://localhost:6677";


function useTextractor({ setText, setConnected }) {
  useEffect(() => {
    const socket = new WebSocket(URL);

    socket.onopen = () => {
      console.log("it works");
      setConnected(true);
    };

    socket.onmessage = (e) => {
      setText(text => text + e.data + '\n');
    }

    socket.onerror = () => {
      console.log("starting manual mode");
      setConnected(false);
    }

    return () => {
      socket.close();
    }

  }, []);
}

function useManual({ connected, text, setText }) {
  const updateText = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      setText(text => text + clip + '\n');
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!connected) {
      window.addEventListener('focus', updateText);

      return () => {
        window.removeEventListener('focus', updateText);
      };
    }
  }, [connected]);
}

function usePageMaker({ text, setText, textRef }) {
  useEffect(() => {
    if (!textRef.current)
      return;

    let sh = textRef.current.scrollHeight;
    let oh = textRef.current.offsetHeight;

    /*
    console.log(sh);
    console.log(oh);
    console.log(text);
    */

    if (sh > oh && text !== '') {
      setText('');
    }

  }, [text, textRef]);
}

//add css later
function DropDownMenu() {
  return (
    <>
      <div className="fixed top-10 right-10 bg-mist-500">
        <SaveButton />
      </div>
    </>
  )
}


//add custom hook to check if it's online
function SaveButton() {
  return (
    <>
      <button className="text-white">SAVE</button>
    </>
  )
}


function Texthooker() {
  //change to array later; we will define page size with indices
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(true);
  const textRef = useRef(null);

  useTextractor({ setText, setConnected });
  useManual({ connected, text, setText });
  usePageMaker({ text, setText, textRef });

  return (
    <>
      <div className="flex justify-center">
        <div ref={textRef} className="whitespace-pre-wrap w-us-width h-us-height">
          {text}
        </div>
      </div>
      <DropDownMenu />
    </>
  )
}
export default Texthooker
