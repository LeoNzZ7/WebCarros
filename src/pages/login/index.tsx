import { Container } from "../../components/container"
import logoImg from "../../assets/logo.svg"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "../../components/inputComponent"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../services/firebaseConnection"
import { useEffect } from "react"

const schema = z.object({
    email: z.string().email("Insira um email valido").min(1, "Este campo é obrigatório"),
    password: z.string().min(1, "Este campo é obrigatório"),
})

type FormData = z.infer<typeof schema>

export const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const navigate = useNavigate()

    async function onSubmit(data: FormData) {
        await signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                navigate("/", { replace: true })
                console.log("Login realizado com sucesso!")
            }).catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        async function handleLogout() {
            await auth.signOut()
        }

        handleLogout()
    })

    return (
        <Container>
            <div className="w-full min-h-screen flex flex-col justify-center items-center gap-4" >
                <Link to="/" className="mb-6 max-w-sm w-full" >
                    <img src={logoImg} alt="Logo do site" className="w-full" />
                </Link>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-xl w-full rounded-lg p-5" >
                    <div className="mb-3" >
                        <Input
                            type="email"
                            placeholder="Digite seu email "
                            name="email"
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>
                    <div className="mb-3" >
                        <Input
                            type="password"
                            placeholder="Digite sua senha "
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>
                    <button
                        className="bg-zinc-900 w-full rounded-md text-white h-10 font-medium"
                        type="submit"
                    >
                        Acessar
                    </button>
                </form>
                <Link to="/register" >
                    Ainda não tem uma conta? cadastra-se
                </Link>
            </div>
        </Container>
    )
}