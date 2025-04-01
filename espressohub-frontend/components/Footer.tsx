export default function Footer() {
    return (
        <footer className="bg-[#3A2D21] text-white py-6 mt-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p>© {new Date().getFullYear()} EspressoHub</p>
                        <p className="text-sm text-gray-400">Build & Brew Hackathon Project</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="https://github.com" className="text-gray-300 hover:text-white">
                            <i className="fab fa-github text-xl"></i>
                        </a>
                        <a href="https://twitter.com" className="text-gray-300 hover:text-white">
                            <i className="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="https://discord.com" className="text-gray-300 hover:text-white">
                            <i className="fab fa-discord text-xl"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
