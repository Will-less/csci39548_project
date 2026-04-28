function Library() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <main className="px-8 py-12">
        <h1 className="text-center text-6xl font-semibold mb-16">
          Library
        </h1>

        <div className="flex justify-center">
          <button className="w-[460px] py-6 bg-purple-700 hover:bg-purple-800 text-white text-2xl font-medium rounded">
            Create new file
          </button>
        </div>

        <h2 className="text-center text-3xl mt-20 mb-10">
          Saved files
        </h2>

        <div className="flex justify-center gap-16">
          <div className="w-[190px] h-[72px] bg-[#334a70] border border-[#3f5f91] rounded-sm flex items-center justify-center text-2xl font-medium">
            File 1
          </div>
          <div className="w-[190px] h-[72px] bg-[#334a70] border border-[#3f5f91] rounded-sm flex items-center justify-center text-2xl font-medium">
            File 2
          </div>
          <div className="w-[190px] h-[72px] bg-[#334a70] border border-[#3f5f91] rounded-sm flex items-center justify-center text-2xl font-medium">
            File 3
          </div>
        </div>


      </main>
    </div>
  )
}
export default Library
