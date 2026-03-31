import { useState, useEffect } from 'react';

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

	//add textractor websocket
	

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
