import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { FaSpinner } from "react-icons/fa";
import { Navigate } from "react-router-dom";

interface PrivateProps {
    children: ReactNode;

}

export const Private = ({ children }: PrivateProps) => {
    const { signed, loadingAuth } = useContext(AuthContext)

    if (loadingAuth) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FaSpinner className="text-red-500 text-4xl animate-spin" />
                <span className="ml-2 text-gray-700 text-lg">Carregando...</span>
            </div>
        );
    }

    if (!signed) {
        return <Navigate to="/login" />
    }

    return children;
}