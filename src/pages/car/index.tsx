import { useEffect, useState } from "react"
import { Container } from "../../components/container"
import { useNavigate, useParams } from "react-router-dom"
import { CarsProps } from "../../types/carTypes"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { FaWhatsapp } from "react-icons/fa"
import { Swiper, SwiperSlide } from "swiper/react"

export const Car = () => {
    const [car, setCar] = useState<CarsProps>()
    const [slidersPreview, setSlidersPreview] = useState<number>(2)

    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        async function loadCar() {
            if (!id) {
                return
            }

            const docRef = doc(db, "cars", id)
            await getDoc(docRef).then((snapshot) => {
                if (!snapshot.data()) (
                    navigate("/", { replace: true })
                )

                setCar({
                    id: snapshot.id,
                    userId: snapshot.data()?.userId,
                    name: snapshot.data()?.name,
                    model: snapshot.data()?.model,
                    year: snapshot.data()?.year,
                    km: snapshot.data()?.km,
                    price: snapshot.data()?.price,
                    images: snapshot.data()?.images,
                    createdAt: snapshot.data()?.createdAt,
                    city: snapshot.data()?.city,
                    description: snapshot.data()?.description,
                    owner: snapshot.data()?.owner,
                    whatsapp: snapshot.data()?.whatsapp
                })
            })
        }

        loadCar()
    }, [id])

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 720) {
                setSlidersPreview(1)
            } else {
                setSlidersPreview(2)
            }
        }

        handleResize()

        window.addEventListener("resize", handleResize)

    }, [])

    return (
        <Container>
            <Swiper
                slidesPerView={slidersPreview}
                pagination={{ clickable: true }}
                navigation
            >
                {car?.images.map((image) => (
                    <SwiperSlide key={image.name} >
                        <img
                            src={image.url}
                            alt="Foto do carro"
                            className="w-full h-96 object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {
                car && (
                    <main className="w-full bg-white rounded-lg p-6 my-4" >
                        <div className="flex flex-col sm:flex-row mb-4 items-center justify-between " >
                            <h1 className="font-bold text-xl text-black" >{car.name}</h1>
                            <h1 className="font-bold text-xl text-black" >
                                {Number(car.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h1>
                        </div>
                        <p>{car.model}</p>
                        <div className="flex w-full gap-6 my-4" >
                            <div className="flex flex-col gap-4" >
                                <div>
                                    <p>Cidade</p>
                                    <strong>{car.city}</strong>
                                </div>
                                <div>
                                    <p>Ano</p>
                                    <strong>{car.year}</strong>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4" >
                                <div>
                                    <p>Quilometragem</p>
                                    <strong>{car.km}Km</strong>
                                </div>
                                <div>
                                    <p>Nome do Proprietário</p>
                                    <strong>{car.owner}</strong>
                                </div>
                            </div>
                        </div>
                        <strong>Descrição de veículo</strong>
                        <p className="mb-4" >{car.description}</p>
                        <strong>Telefone / WhatsApp</strong>
                        <p>{car.whatsapp}</p>
                        <a
                            href={`https://api.whatsapp.com/send?phone${car.whatsapp}&text=Olá vi esse ${car.name} e fiquei interessado! poderia me dar mais detalhes?`}
                            target="_blank"
                            className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg cursor-pointer font-medium" >
                            Conversar com vendedor
                            <FaWhatsapp size={26} color="#fff" />
                        </a>
                    </main>
                )
            }
        </Container >
    )
}