import { Link } from "react-router-dom"
import logo from "../../assets/logo.svg"
import { FiLogIn, FiUser } from "react-icons/fi"

export const Header = () => {
    const signed = false
    const loadingAuth = true

    return (
        <div className="w-full flex justify-center items-center h-16 bg-white drop-shadow mb-4" >
            <header className="flex justify-between max-w-7xl items-center w-full px-4 mx-auto" >
                <Link to="./" >
                    <img src={logo} alt="logo do site" />
                </Link>
                {!loadingAuth && signed && (
                    <Link to="/dashboard" className="rounded-full border-2 border-gray-900 p-1" >
                        <FiUser size={22} color="#000" />
                    </Link>
                )}
                {loadingAuth && !signed && (
                    <Link to="/dashboard" className="rounded-full border-2 border-gray-900 p-1" >
                        <FiLogIn size={22} color="#000" />
                    </Link>
                )}
            </header>
        </div>
    )
}