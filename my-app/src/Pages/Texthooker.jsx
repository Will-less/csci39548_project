import { useState, useEffect, useRef } from 'react';

//need Textractor and Textractor websocket to use
const URL = "ws://localhost:6677";
const pageLines = 50;

function getText({ text, setText, extract, setPageText, page, pages }) {
  const id = crypto.randomUUID();

  setText(prev => {
    const newLineIds = [...prev.lineIds, id];
    const newLines = { ...prev.lines, [id]: { text: extract } };

    setPageText(() => {
      return newLineIds.slice(getPage(page, pages), getPage(page, pages) + pageLines);
    });

    return {
      lineIds: newLineIds,
      lines: newLines,
    };
  });


}

function useTextractor({ text, setText, setConnected, setPageText, page, pages }) {
  useEffect(() => {
    const socket = new WebSocket(URL);

    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (e) => {
      let exText = e.data;
      getText({ text: text, setText, extract: exText, setPageText, page, pages });
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

function useManual({ text, connected, setText, setPageText, page, pages }) {
  const updateText = async () => {
    try {
      let clip = await navigator.clipboard.readText();
      getText({ text, setText, extract: clip, setPageText, page, pages });
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

function getPage(page, pages) {
  if (!pages.get(page))
    return 0;
  return pages.get(page);
}


function usePaginator({ text, textRef, page, setPage, setPages }) {
  useEffect(() => {
    if (!textRef.current)
      return;

    let sh = textRef.current.scrollHeight;
    let oh = textRef.current.offsetHeight;

    // console.log(sh);
    // console.log(oh);

    if (sh > oh) {
      setPages(prev => {
        return new Map(prev).set(page, text.lineIds.length);
      });
      setPage(prev => prev + 1);
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
  //50 lines per page at most because of container height / line width. 
  const [connected, setConnected] = useState(true);
  const [page, setPage] = useState(0);

  //page index : page size - size is changed by the paginator and set by the useTextractor/Manual functions. 
  const [pages, setPages] = useState(new Map());
  const [pageText, setPageText] = useState([]);

  const [text, setText] = useState({
    lineIds: [],
    lines: {},
  });

  const textRef = useRef(null);

  useTextractor({ text, setText, setConnected, setPageText, page, pages });
  useManual({ text, connected, setText, setPageText, page, pages });
  usePaginator({ text, textRef, page, setPage, setPages })

  //change to state
  //keep text-sm - line-height needs to divide 1000 perfectly.
  return (
    <>
      <div className="flex justify-center">
        <div>{page}</div>
        <div ref={textRef} className="whitespace-pre-wrap w-us-width h-us-height text-sm">
          {pageText.map(ids => (
            <div key={ids}>{text.lines[ids].text}</div>
          ))}
        </div>
        <div>{text.lineIds.length}</div>
      </div>
      <DropDownMenu />
    </>
  )
}
export default Texthooker
