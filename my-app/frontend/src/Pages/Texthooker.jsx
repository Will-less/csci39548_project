import { useState, useContext, useEffect, useRef, useLayoutEffect } from 'react';
// useLocation used to recieve data passed from the Library page
import { useLocation } from "react-router-dom"
import { AuthContext } from '../Components/AuthContext.jsx'
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

//need Textractor and Textractor websocket to use


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


function useTextractor({ setText, setConnected }) {
  const socketRef = useRef(null);
  let socketTimeout;

  useEffect(() => {

    //prevents crashing due to request spam 
    socketTimeout = setTimeout(() => {


      const URL = "ws://localhost:6677";
      const socket = new WebSocket(URL);
      socketRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
      };

      socket.onmessage = (e) => {
        if (socket != socketRef.current)
          return;
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
    }, 500);

    return () => {
      clearTimeout(socketTimeout);
      if (socketRef.current) {
        socketRef.current.onopen = null;
        socketRef.current.onmessage = null;
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        setConnected(false);
        if (socketRef.current.readyState <= 1) {
          socketRef.current.close(1000);
        }
        socketRef.current = null;
      }
      setConnected(false);
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
//dropdown menu containing save button
function DropDownMenu({ onSave }) {
  return (
    <>
      <div className="fixed top-10 right-10 bg-mist-500">
        <SaveButton onSave={onSave} />
      </div>
    </>
  )
}


//saves current texthooker text into library
function SaveButton({ onSave }) {
  return (
    <>
      <button
        onClick={onSave}
        className="text-white"
      >
        SAVE
      </button>
    </>
  )
}


function Texthooker() {
  // get file data passed form library page(selected file)
  const location = useLocation()
  const file = location.state;
  const { isLoggedIn, userId } = useContext(AuthContext);
  console.log("I have the userid: ", userId);


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

  useEffect(() => {
    if (file) {
      setText(file.text.text);
      setPages(file.pages);

    }
  }, [file]);


  const textRef = useRef(null);

  //feedback after saving text to library
  const [saveMessage, setSaveMessage] = useState("")

  useTextractor({ setText, setConnected });
  useManual({ text, connected, setText, page, pages });
  usePaginator({ text, textRef, pageNum, setPageNum, setPage, pages, setPages })

  //Saves text to database when logged in, else saves to localStorage
  async function handleSaveToLibrary() {
    const savedContent = {
      pages: pages,
      text: text,
    };

    const newSavedFile = {
      id: Date.now(),
      title: `Saved Text ${new Date().toLocaleString()}`,
      category: "Uncategorized",
      content: savedContent,
      linecount: savedContent.text.lineIds.length,
      lastUpdated: new Date().toLocaleString(),
    };

    if (isLoggedIn) {
      const token = localStorage.getItem("userToken");

      try {
        const backendDocument =
        {
          title: newSavedFile.title,
          textContent:
          {
            lineIds: text.lineIds,
            lines: text.lines,
            currLine: text.currLine,
          },
          pages: pages,
        };

        const response = await axios.patch(`${BASE_URL}/api/users/save`, { text: backendDocument, }, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", }, });

        if (response.status !== 200) {
          throw new Error("Database save failed");
        }
        setSaveMessage("Saved to account Library!");
      } catch (error) {
        console.error(error);
        setSaveMessage("Could not save to account.");
      }
      return;
    } else {

      const existingFiles = JSON.parse(localStorage.getItem("files")) || [];

      localStorage.setItem(
        "files",
        JSON.stringify([...existingFiles, newSavedFile])
      );

      setSaveMessage("Saved to local Library!");
    }
  }

  function goToPage(pageNumber) {
    setPageNum(pageNumber);
  }

  //testing to test saving  without textractor
  function handleAddTextLine() {
    getText({
      setText,
      extract: "This is a text line from Texthooker.",
    })
  }

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
      {saveMessage && (
        <p className="text-green-400 text-center mt-4">
          {saveMessage}
        </p>
      )}

      <div className="flex justify-center bg-[#0f172a] text-white">
        <div className="flex-1">
          current page: {pageNum + 1}
          <div>total lines: {text.lineIds.length}</div>
          currentLine: {text.currLine}

          {/* display currently opened file (passed from library) */}
          {/* allows texthooker page to know which file the user selected */}
          {file && (
            <div className="text-gray-300 text-center mt-6 mb-6">
              <h2 className="text-2xl font-semibold">Opened File:</h2>

              <p className="text-lg mt-2">{file.title}</p>

              <p className="text-gray-300 mt-2">
                Category: {file.category}
              </p>
            </div>
          )}

          {/* Test line button */}
          <button
            onClick={handleAddTextLine}
            className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
          >
            Add Text Line
          </button>
        </div>
        <div ref={textRef} className="whitespace-pre-wrap w-us-width h-us-height text-2xl">
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
      <DropDownMenu onSave={handleSaveToLibrary} />
    </>
  )
}
export default Texthooker
