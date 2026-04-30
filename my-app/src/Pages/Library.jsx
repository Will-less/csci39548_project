import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Library() {
  const [savedFiles, setSavedFiles] = useState([
    {
      id:1,
      title: "Japanese Game Notes",
      category: "Visual Novel",
      content: "これはサンプルテキストです",
    },
    {
      id:2,
      title: "Vocabulary Practice",
      category: "Study",
      content:"Word list goes here"
    },
    {
      id:3,
      title: "Chapter 1 Text",
      category: "Reading",
      content: "Once upon a time"
    },
  ])

  const [selectedFile, setSelectedFile] = useState(null)

  const navigate = useNavigate()

  function handleCreateFile(){
    const newFile ={
      id: savedFiles.length + 1,
      title: `New File ${savedFiles.length + 1}`,
      category: "Uncategorized",
      content: "",
    }

    setSavedFiles([...savedFiles, newFile])
  }
  
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <main className="px-8 py-12">
        <h1 className="text-center text-6xl font-semibold mb-16">
          Library
        </h1>

        <div className="flex justify-center">
          <button
          onClick={handleCreateFile}
           className="w-[460px] py-6 bg-purple-700 hover:bg-purple-800 text-white text-2xl font-medium rounded"
          >
            Create new file
          </button>
        </div>

        <h2 className="text-center text-3xl mt-20 mb-10">
          Saved files
        </h2>

        <div className="flex justify-center gap-16">
         {savedFiles.map((file) => (
          <div
           key={file.id}
           onClick={() => setSelectedFile(file)}
           className="w-[220px] h[96px] bg-[#334a70] border border-[#3f5f91] rounded-sm flex flex-col items-center justify-center text-center hover:bg[#3f5f91] cursor-pointer"
           >
           <p className="text-xl font-medium">{file.title}</p>
           <p className="text-sm text-gray-300 mt-1">{file.category}</p>
          </div>
         ))}
        </div>

        {selectedFile && (
          <div className="max-w-xl mx-auto mt-10 bg-[#111c33] border border-[#3f5f91] rounded p-6">
            <h3 className="text-2xl font-semibold mb-2">
              {selectedFile.title}
            </h3>

            <p className="text-gray-300 mb-4">
              Category: {selectedFile.category}
            </p>

            <button
              onClick={() => navigate("/Texthooker", {state: selectedFile})} 
              className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded text-white"
            >
              Open file
            </button>
          </div>
        )}

      </main>
    </div>
  )
}
export default Library
