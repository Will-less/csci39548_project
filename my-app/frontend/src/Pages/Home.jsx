function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white text-center px-6">
      <main>
        <h1 className="text-6xl font-semibold mb-10">Welcome to Texthooker.</h1>
      </main>

      <div className="justify-center">
        <main>
            <h1 className="text-3xl font-semibold mb-4">About</h1>
            <div className="justify-center max-w-us-width">
              <p>This site serves to help archivists, language learners, and the like by copy-pasting text from various applications to an all-in-one place. Here, you can save your entries, define and translate words in your entries, and so forth. Have fun!</p>
            </div>
        </main>
      </div>
    </div>
  )
}

export default Home

