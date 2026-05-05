import { useState, useEffect, useRef, useLayoutEffect } from 'react';
// useLocation used to recieve data passed from the Library page
import { useLocation } from "react-router-dom"


//need Textractor and Textractor websocket to use
const URL = "ws://localhost:6677";

//>50 guarantees that the page is filled if each extracted "line" does not wrap around and only takes up one line
//there could be a smaller value, however
const pageLines = 50;

function getText({ setText, extract }) {
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
        getText({ setText, extract: exText });
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
      getText({ setText, extract: clip, });
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


//TODO: add boolean to sh > oh check to prevent progressing the page when loading a page - and add ids to pages


function usePaginator({ text, textRef, pageNum, setPageNum, setPage, pages, setPages }) {
  useLayoutEffect(() => {
    if (!textRef.current)
      return;

    const sh = textRef.current.scrollHeight;
    const oh = textRef.current.offsetHeight;

    console.log(sh);
    console.log(oh);

    if ((pageNum + 1) === pages.length && sh > oh) {
      const newNum = text.currLine;
      const newPage = { id: crypto.randomUUID(), offset: newNum };
      const newPageNum = pageNum + 1;
      setPageNum(newPageNum);
      setPage(newPage);
      setPages(prev => [...prev, newPage]);
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
  // get file data passed form library page(selected file)
  const location = useLocation()
  const file = location.state

  //get file content(if exists)
  const fileContent = file?.content || ""

  //for Textractor connection 
  const [connected, setConnected] = useState(true);
  //TODO: convert pages to json object - add to pages map 
  const [page, setPage] = useState(() => ({
    id: crypto.randomUUID(),
    offset: 0,
  }));
  const [pageNum, setPageNum] = useState(0);

  //page : line offset - offset is changed by the paginator 
  const [pages, setPages] = useState([page]);
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
  usePaginator({ text, textRef, pageNum, setPageNum, setPage, pages, setPages })


  function goToPage(pageNumber) {
    setPageNum(pageNumber);
  }

  //TODO: make compatible with paginator
  function deline(id) {
    const newLineIds = text.lineIds.filter(lineID => lineID != id);
    const { [id]: deleted, ...filtered } = text.lines;
    const currentLine = text.currLine - 1;

    setText({
      lineIds: newLineIds,
      lines: filtered,
      currLine: currentLine,
    });

    if (pages.length > 1 && newLineIds.length < pages[pages.length - 1].offset) {
      const newPages = pages.slice(0, -1);
      setPages(newPages);
    }
  }


  const pageStart = pages[pageNum].offset;

  //contains text of a page that is a slice of all the text 
  let pageText;
  if ((pageNum + 1) === pages.length) {
    pageText = text.lineIds.slice(pageStart, pageStart + pageLines);
  } else {
    pageText = text.lineIds.slice(pageStart, pageStart + pages[pageNum + 1].offset - pages[pageNum].offset);
  }

  return (
    <>
      {/* display currently opened file (passed from library) */}
      {/* allows texthooker page to know which file the user selected */}

      {file && (
        <div className="text-white text-center mt-6 mb-6">
          <h2 className="text-2xl font-semibold">Opened File:</h2>

          <p className="text-lg mt-2">{file.title}</p>

          <p className="text-gray-300 mt-2">
            Category: {file.category}
          </p>
        </div>
      )}
      <div className="flex justify-center ">
        <div className="flex-1">
          current page: {pageNum + 1}
          <div>total lines: {text.lineIds.length}</div>
          currentLine: {text.currLine}
        </div>
        <div ref={textRef} className="whitespace-pre-wrap w-us-width h-us-height text-2x1">
          {pageText.map((ids) => (
            <div className="flex gap-2 items-center" key={ids}>
              <div>{text.lines[ids].text}</div>
              <button className="hover:font-bold" onClick={() => deline(ids)}>X</button>
            </div>
          ))}
        </div>
        <div className="flex-1">
          {pages.map((page, index) => (
            <div key={page.id}><button onClick={() => goToPage(index)}>{page.id} | {index + 1} - {page.offset}</button></div>
          ))}
        </div>
      </div>
      <DropDownMenu />
    </>
  )
}
export default Texthooker
