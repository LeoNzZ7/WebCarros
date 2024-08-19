import { FiUpload } from "react-icons/fi"
import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/painelHeader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "../../../components/inputComponent"

const schema = z.object({
    name: z.string().min(1, "O campo nome é obrigatório"),
    model: z.string().min(1, "O campo modelo é obrigatório"),
    year: z.string().min(1, "O campo ano é obrigatório"),
    km: z.string().min(1, "O campo de quilometragem do carro é obrigatório"),
    price: z.string().min(1, "O campo de preço do carro é obrigatório"),
    city: z.string().min(1, "O campo da cidade do carro é obrigatório"),
    whatsapp: z.string().min(1, "o campo de telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Número de telefone inválido"
    }),
    description: z.string().min(1, "O campo de descrição do carro é obrigatório")
})

type FormData = z.infer<typeof schema>

export const New = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    function onsubmit(data: FormData) {
        console.log(data)
    }

    return (
        <Container>
            <DashboardHeader />
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-rol justify-center gap-2" >
                <button className="border-2 w-48 flex justify-center items-center rounded-lg cursor-pointer border-gray-600 h-32 md:w-48" >
                    <div className="absolute cursor-pointer " >
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer" >
                        <input type="file" accept="image/*" className="opacity-0 cursor-pointer" />
                    </div>
                </button>
            </div>
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center mt-2" >
                <form
                    className="w-full "
                    onSubmit={handleSubmit(onsubmit)}
                >
                    <div className="mb-3" >
                        <p className="mb-2 font-medium">
                            Nome do carro
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Exemplo: Chevrolet Onix 1.0"
                        />
                        <p className="mb-2 font-medium">
                            Modelo do carro
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="Exemplo: 1.0 flex manual"
                        />
                    </div>
                    <div className="w-full flex mb-3 flex-row items-center gap-4" >
                        <div className="w-full" >
                            <p className="mb-2 font-medium">
                                Ano do carro
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="Exemplo: 2022"
                            />
                        </div>
                        <div className="w-full" >
                            <p className="mb-2 font-medium">
                                Quilometragem
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="Exemplo: 23.540 km"
                            />
                        </div>
                    </div>
                    <div className="w-full flex mb-3 flex-row items-center gap-4" >
                        <div className="w-full" >
                            <p className="mb-2 font-medium">
                                Telefone / WhatsApp
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="Exemplo: 01123432332"
                            />
                        </div>
                        <div className="w-full" >
                            <p className="mb-2 font-medium">
                                Cidade
                            </p>
                            <Input
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="Exemplo: Florianópolis - SC"
                            />
                        </div>
                    </div>
                    <div className="w-full" >
                        <p className="mb-2 font-medium">
                            Preço
                        </p>
                        <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Exemplo: R$:69000"
                        />
                    </div>
                    <div className="w-full" >
                        <p className="mb-2 font-medium">
                            Descrição
                        </p>
                        <textarea
                            className="w-full border-2 rounded-md h-24 px-2"
                            {...register("description")}
                            name="description"
                            id="description"
                            placeholder="Digite a descrição completa sobre o carro"
                        />
                        {errors.description && <p className="text-red-500 mb-1">{errors.description.message}</p>}
                    </div>
                    <button type="submit" className="bg-zinc-900 rounded-md text-white font-medium w-full h-10">
                        cadastrar
                    </button>
                </form>
            </div>
        </Container>
    )
}