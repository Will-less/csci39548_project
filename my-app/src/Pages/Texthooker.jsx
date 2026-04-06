import { useState, useEffect, useRef } from 'react';

//need Textractor and Textractor websocket to use
const URL = "ws://localhost:6677";

function getText({ setText, extract }) {
  setText(prev => {
    const id = crypto.randomUUID();
    return {
      ...prev,
      page: prev.lineIds.length > prev.pageLimit ? prev.page++ : prev.page,
      lines: { ...prev.lines, [id]: { text: extract } },
      lineIds: [...prev.lineIds, id],
    };
  });
}

function useTextractor({ setText, setConnected }) {
  useEffect(() => {
    const socket = new WebSocket(URL);

    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (e) => {
      let text = e.data;
      getText({ setText, extract: text });
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
  const updateText = async () => {
    try {
      let clip = await navigator.clipboard.readText();
      getText({ setText, extract: clip });
    } catch (e) {
      //empty to prvent console spam 
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

function usePaginator({ text, textRef }) {
  useEffect(() => {
    if (!textRef.current)
      return;

    let sh = textRef.current.scrollHeight;
    let oh = textRef.current.offsetHeight;

    console.log(sh);
    console.log(oh);

    if (sh > oh) {
      console.log("hey");
      textRef.current.scrollBy({
        top: 1000
      });
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
  const [connected, setConnected] = useState(true);
  const [text, setText] = useState({
    lineIds: [],
    lines: {},
    pageLimit: 50,
    page: 0
  });
  const textRef = useRef(null);

  useTextractor({ setText, setConnected });
  useManual({ connected, setText });
  usePaginator({ text, textRef })

  const pageText = text.lineIds.slice(text.page * text.pageLimit, text.page * text.pageLimit + text.pageLimit);

  //keep text-sm - line-height needs to divide 1000 perfectly.
  return (
    <>
      <div className="flex justify-center">
        <div ref={textRef} className="whitespace-pre-wrap w-us-width h-us-height text-sm overflow-hidden">
          {pageText.map(ids => (
            <div key={ids}>{text.lines[ids].text}</div>
          ))}
        </div>
      </div>
      <DropDownMenu />
    </>
  )
}
export default Texthooker
