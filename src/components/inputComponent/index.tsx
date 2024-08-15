import { InputHTMLAttributes, useState } from "react"
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    register: UseFormRegister<{ email: string; password: string; }>;
    name: "email" | "password";
    rules?: RegisterOptions<{ email: string; password: string }, "email" | "password">;
}

export const Input = (props: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    if (props.type === "password") {
        return (
            <div className="relative" onSubmit={() => setShowPassword(false)}>
                <input
                    className="border-0 h-9 rounded-md outline-none px-2 mb-3 w-full"
                    {...props}
                    {...props.register(props.name, props.rules)}
                    id={props.name}
                    type={showPassword ? "text" : "password"}
                />
                {props.error && <p className="my-1 text-red-500" >{props.error}</p>}
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 p-2 h-9 text-black bg-transparent rounded-r outline-none"
                >
                    {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
                </button>
            </div >
        )
    }

    return (
        <>
            <input
                className="w-full border-2 rounded-md h-11 px-2"
                {...props}
                {...props.register(props.name, props.rules)}
                id={props.name}
            />
            {props.error && <p className="my-1 text-red-500" >{props.error}</p>}
        </>
    )
}