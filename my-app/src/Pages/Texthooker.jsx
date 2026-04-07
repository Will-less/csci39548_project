import { useState, useEffect, useRef, useLayoutEffect } from 'react';

//need Textractor and Textractor websocket to use
const URL = "ws://localhost:6677";

//>50 guarantees that the page is filled if each extracted "line" does not wrap around and only takes up one line
//there could be a smaller value, however
const pageLines = 50;

function getText({ text, setText, extract, page, pages }) {
  const id = crypto.randomUUID();

  setText(prev => {
    const newLineIds = [...prev.lineIds, id];
    const newLines = { ...prev.lines, [id]: { text: extract } };
    const currentLine = prev.currLine + 1;

    return {
      lineIds: newLineIds,
      lines: newLines,
      currLine: currentLine,
    };

  });
}


function useTextractor({ text, setText, setConnected, page, pages }) {
  useEffect(() => {
    const socket = new WebSocket(URL);

    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (e) => {
      let exText = e.data;
      try {
        getText({ text: text, setText, extract: exText, page, pages });
      } catch (e) {
        console.log(e);
      }
    }


    socket.onerror = () => {
      console.log("starting manual mode");
      setConnected(false);
    }

    return () => {
      setConnected(false);
      socket.close();
    }

  }, []);
}

function useManual({ text, connected, setText, page, pages }) {
  const updateText = async () => {
    try {
      let clip = await navigator.clipboard.readText();
      getText({ text, setText, extract: clip, page, pages });
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




function usePaginator({ text, setText, textRef, page, setPage, pages, setPages }) {
  useLayoutEffect(() => {
    if (!textRef.current)
      return;

    const sh = textRef.current.scrollHeight;
    const oh = textRef.current.offsetHeight;

    console.log(sh);
    console.log(oh);

    if (sh > oh) {
      const newPage = page + 1;
      setPage(newPage);
      setPages(prev => new Map(prev).set(newPage, text.currLine));
    }
  }, [text, textRef]);
}


//TODO: add css, custom css text box, and additional options for user customization (to be decided later)
function DropDownMenu() {
  return (
    <>
      <div className="fixed top-10 right-10 bg-mist-500">
        <SaveButton />
      </div>
    </>
  )
}


//TODO:  add custom hook to check if the user is online and hide this button if user is not logged in
function SaveButton() {
  return (
    <>
      <button className="text-white">SAVE</button>
    </>
  )
}


function Texthooker() {
  //for Textractor connection 
  const [connected, setConnected] = useState(true);
  const [page, setPage] = useState(0);

  //page index : line offset - offset is changed by the paginator 
  const [pages, setPages] = useState(new Map([[0, 0]]));
  //separate array containing the text of the page specifically 

  //lines contains every extracted line of text 
  const [text, setText] = useState({
    lineIds: [],
    lines: {},
    currLine: 0,
  });

  const textRef = useRef(null);

  useTextractor({ text, setText, setConnected, page, pages });
  useManual({ text, connected, setText, page, pages });
  usePaginator({ text, setText, textRef, page, setPage, pages, setPages })

  console.log(pages);

  const pageStart = pages.get(page);
  const pageText = text.lineIds.slice(pageStart, pageStart + pageLines);

  // change button ids later to their own thing 
  return (
    <>
      <div className="flex justify-center ">
        <div className="flex-1">
          current page: {page}
          <div>total lines: {text.lineIds.length}</div>
          currentLine: {text.currLine}
        </div>
        <div ref={textRef} className="whitespace-pre-wrap w-us-width h-us-height text-2x1">
          {pageText.map(ids => (
            <div key={ids}>{text.lines[ids].text}</div>
          ))}
        </div>
        <div className="flex-1">
          {pageText.map(ids => (
            <div key={ids}><button>{ids}</button></div>
          ))}
        </div>
      </div>
      <DropDownMenu />
    </>
  )
}
export default Texthooker
