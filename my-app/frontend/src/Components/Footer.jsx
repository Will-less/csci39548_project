function Footer(){
    return (
       <footer className="w-full bg-[#0b1320] text-gray-400 py-6 px-8">
        <div className="flex justify-between items-center max-w-6xl mx-auto text-sm">
            {/* Left Side */}
            <p>© 2026 Texthooker</p>

            {/* Right side */}
            <div className="flex gap-6">
                <span className="hover.text-white cursor-pointer">About</span>
                <span className="hover.text-white cursor-pointer">Contact</span>
                <span className="hover.text-white cursor-pointer">GitHub</span>
            </div>
        </div>
       </footer>
    )
}

export default Footer