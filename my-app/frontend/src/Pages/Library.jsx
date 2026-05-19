import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Library() {

  //dummy data |  NOTE: the dummy data are broken
  const [savedFiles, setSavedFiles] = useState(() => {
    const saved = localStorage.getItem("files")
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "Japanese Game Notes",
        category: "Visual Novel",
        content: "これはサンプルテキストです",
        linecount: 42,
        lastUpdated: "Apr 30, 2026",
      },
      {
        id: 2,
        title: "Vocabulary Practice",
        category: "Study",
        content: "Word list goes here",
        linecount: 30,
        lastUpdated: "May 30, 2026",
      },
      {
        id: 3,
        title: "Chapter 1 Text",
        category: "Reading",
        content: "Once upon a time",
        linecount: 23,
        lastUpdated: "Apr 10, 2026",
      },
    ]
  })

  //tracks selected file and search/filter inputs
  const [selectedFile, setSelectedFile] = useState(null)

  //tracks if selected file details are being edited
  const [isEditing, setIsEditing] = useState(false)

  //stores temp title/category edits before saving
  const [editedTitle, setEditedTitle] = useState("")
  const [editedCategory, setEditedCategory] = useState("")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  //control file sort order
  const [sortOrder, setSortOrder] = useState("Newest")

  //default categories
  const defaultCategories = [
    "Visual Novel",
    "Study",
    "Reading",
  ]
  //custom categories that can be added/removed
  const [customCategories, setCustomCategories] = useState(() => {
    const savedCategories = localStorage.getItem("customCategories")
    return savedCategories ? JSON.parse(savedCategories) : []
  })
  const categories = [...defaultCategories, ...customCategories]
  const [newCategory, setNewCategory] = useState("")

  //filters files based on search or category
  const filteredFiles = savedFiles
    .filter((file) => {
      const matchesSearch =
        file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory =
        selectedCategory === "All" ||
        file.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    //sort by date or alpha order
    .sort((a, b) => {
      if (sortOrder === "Newest") {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated)
      }

      if (sortOrder === "Oldest") {
        return new Date(a.lastUpdated) - new Date(b.lastUpdated)
      }

      if (sortOrder === "A-Z") {
        return a.title.localeCompare(b.title)
      }

      if (sortOrder === "Z-A") {
        return b.title.localeCompare(a.title)
      }
    })

  //opens selected file in texthooker page
  const navigate = useNavigate()

  //add custom category to dropdown  
  function handleAddCategory() {
    const trimmedCategory = newCategory.trim()

    if (
      trimmedCategory !== "" &&
      !categories.includes(trimmedCategory)
    ) {
      setCustomCategories([...customCategories, trimmedCategory])
      setNewCategory("")
    }
  }

  //remove  custom category
  function handleRemoveCategory(categoryToRemove) {
    setCustomCategories(
      customCategories.filter((category) => category !== categoryToRemove)
    )

    if (selectedCategory === categoryToRemove) {
      setSelectedCategory("All")
    }
  }

  //delete saved file from library
  function handleDeleteFile(fileId) {
    const updateFiles = savedFiles.filter((file) => file.id !== fileId)

    setSavedFiles(updateFiles)
    setSelectedFile(null)
  }

  //saves updated title/ category for selected title
  function handleSaveFileEdits() {
    const updatedFiles = savedFiles.map((file) => {
      if (file.id === selectedFile.id) {
        return {
          ...file,
          title: editedTitle,
          category: editedCategory,
          lastUpdated: new Date().toLocaleDateString(),
        }
      }

      return file
    })

    setSavedFiles(updatedFiles)

    const updatedSelectedFile = updatedFiles.find(
      (file) => file.id === selectedFile.id
    )

    setSelectedFile(updatedSelectedFile)
    setIsEditing(false)
  }


  //saves files to browser storage whenever they change
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(savedFiles))
  }, [savedFiles])

  //saves custom categories 
  useEffect(() => {
    localStorage.setItem("customCategories", JSON.stringify(customCategories))
  }, [customCategories])

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <main className="px-8 py-12">
        <h1 className="text-center text-6xl font-semibold mb-4">
          Library
        </h1>

        <p className="text-center text-gray-300 text-lg mb-12">
          View and open text pages saved from Texthooker.
        </p>

        {/* Search bar, category filter, and custom controls */}
        <div className="flex flex-wrap items-center gap-6 mb-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved files..."
            className="w-full px-4 py-3 rounded bg-[#111c33] border border-[#3f5f91] text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded bg-[#111c33] border border-[#3f5f91] text-white focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* sort dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-3 rounded bg-[#111c33] border border-[#3f5f91] text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
          </select>

          <div className="flex items-end gap-3 ml-auto">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category..."
              className="px-4 py-3 rounded bg-[#111c33] border border-[#3f5f91] text-white"
            />

            <button
              onClick={handleAddCategory}
              className="bg-purple-700 hover:bg-purple-800 px-4 py-3 rounded text-white"
            >
              Add
            </button>
          </div>

          {/* shows custom categories */}
          {customCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 max-w-md">
              {customCategories.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-2 bg-[#111c33] border border-[#3f5f91] px-3 py-2 rounded text-sm"
                >
                  <span>{category}</span>

                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="text-red-300 hover:text-red-500 font-bold"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Preview panel for selected file */}
        {selectedFile && (
          <div className="max-w-xl mx-auto mb-12 bg-[#111c33] border border-[#3f5f91] rounded-lg p-6 shadow-lg text-center">
            {/* allows editing selected file title/category */}
            {isEditing ? (
              <div className="flex flex-col gap-4 mb-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="px-4 py-3 rounded bg-[#0f172a] border border-[#3f5f91] text-white"
                />

                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="px-4 py-3 rounded bg-[#0f172a] border border-[#3f5f91] text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-semibold mb-2">
                  {selectedFile.title}
                </h3>

                <p className="text-gray-300 mb-4">
                  Category: {selectedFile.category}
                </p>

                <p className="text-gray-400 mb-4">
                  {selectedFile.linecount} lines saved • Updated {selectedFile.lastUpdated}
                </p>
              </>
            )}

            <div className="flex flex-wrap justify-center gap-4">

              {/* toggles edditing for selcted file details */}
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveFileEdits}
                    className="bg-green-700 hover:bg-green-800 px-6 py-3 rounded text-white"
                  >
                    Save edits
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded text-white"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded text-white"
                >
                  Edit details
                </button>
              )}
              <button
                onClick={() => navigate("/Texthooker", { state: selectedFile })}
                className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded text-white "
              >
                Open file
              </button>

              <button
                onClick={() => {
                  const confirmDelete = window.confirm(
                    `Are you sure you want to delete "${selectedFile.title}"?`
                  )

                  if (confirmDelete) {
                    handleDeleteFile(selectedFile.id)
                  }
                }}
                className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded text-white"
              >
                Delete file
              </button>

              {/* closes slected file preview */}
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setIsEditing(false)
                }}
                className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Message when no files match search/filter */}
        {filteredFiles.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p className="text-xl">No matching files found.</p>
            <p className="text-sm mt-2">
              Try searching by title or category.
            </p>
          </div>
        )}

        {/* grid of saved file cards */}
        {filteredFiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFile(file)
                  setEditedTitle(file.title)
                  setEditedCategory(file.category)
                  setIsEditing(false)
                }}
                className="w-full min-h-35 bg-[#334a70] border border-[#3f5f91] rounded-lg flex flex-col items-center justify-center text-center hover:bg-[#3f5f91] hover:scale-105 transition duration-200 cursor-pointer p-6 shadow-lg"
              >
                <p className="text-xl font-medium">{file.title}</p>
                <p className="text-sm text-gray-300 mt-1">{file.category}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {file.linecount} lines saved
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Updated {file.lastUpdated}
                </p>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}
export default Library
