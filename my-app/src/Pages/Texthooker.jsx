import { useState, useEffect } from 'react';
const URL = "ws://localhost:6677";


function useTextractor({ setText, setConnected }) {
  let line = '';
  useEffect(() => {
    const socket = new WebSocket(URL);

    socket.onopen = () => {
      console.log("it works");
      setConnected(true);
    };

    socket.onmessage = (e) => {
      line = line + e.data + '\n';
      setText(line);
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

function useManual({ connected, setText }) {
  let line = '';
  const updateText = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      line = line + clip + '\n';
      setText(line);
    } catch (e) {
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

  useTextractor({ setText, setConnected });
  useManual({ setText, connected });

  return (
    <>
      <div className="flex justify-center">
        <div className="whitespace-pre-wrap w-us-width h-us-height">
          {text}
        </div>
      </div>
      <DropDownMenu />
    </>
  )
}
export default Texthooker
