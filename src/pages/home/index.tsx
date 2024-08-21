import { useEffect, useState } from "react"
import { Container } from "../../components/container"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { FaSpinner } from "react-icons/fa"
import { Link } from "react-router-dom"
import { CarsProps } from "../../types/carTypes"

export const Home = () => {
    const [cars, setCars] = useState<CarsProps[] | []>([])
    const [loading, setLoading] = useState(false)
    const [loadingImages, setLoadingImages] = useState<string[] | []>([])

    useEffect(() => {
        async function loadCars() {
            setLoading(true)
            const carsRef = collection(db, "cars")
            const queryRef = query(carsRef, orderBy("createdAt", "desc"))

            await getDocs(queryRef).then((snapshot) => {
                const listCars = [] as CarsProps[]

                snapshot.forEach((doc) => {
                    listCars.push({
                        id: doc.id,
                        userId: doc.data().userId,
                        name: doc.data().name,
                        model: doc.data().model,
                        year: doc.data().year,
                        km: doc.data().km,
                        price: doc.data().price,
                        city: doc.data().city,
                        images: doc.data().images,
                        owner: doc.data().owner
                    })
                })

                setCars(listCars)
                setLoading(false)
            }).catch((error) => {
                console.log("Error fetching documents: ", error);
                setLoading(false)
            })
        }

        loadCars()
    }, [])

    function handleImageLoad(id: string) {
        setLoadingImages((prevImageLoads) => [...prevImageLoads, id])
    }

    return (
        <Container>
            <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap" >
                <input
                    className="w-full border-2 rounded-lg h-9 px-3 outline-none rounded-r-none border-r-0"
                    type="text"
                    placeholder="Digite o nome do veiculo" />
                <button className="bg-red-500 h-9 px-8 rounded-lg rounded-l-none font-medium transition-colors hover:bg-red-600 text-white" >Buscar</button>
            </section>

            <h1 className="font-bold text-center mt-8 text-2xl mb-4" >
                Carros novos e usados em todo o Brasil!
            </h1>
            {loading && (
                <div className="flex items-center justify-center h-screen">
                    <FaSpinner className="text-red-500 text-4xl animate-spin" />
                    <span className="ml-2 text-gray-700 text-lg">Carregando...</span>
                </div>
            )}
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.length && !loading && cars.map((car) => (
                    <Link key={car.id} to={`/car/${car.id}`} >
                        <section className="w-full bg-white rounded-lg cursor-pointer" >
                            <div
                                style={{ display: loadingImages.includes(car.id as never) ? 'none' : 'flex' }}
                                className="w-full h-72 rounded-lg bg-slate-200 font-bold text-center text-2xl justify-center items-center"
                            >
                                <FaSpinner className="text-red-500 text-4xl animate-spin" />
                                <span className="ml-2 text-gray-700 text-lg">Carregando...</span>
                            </div>
                            <img
                                style={{ display: loadingImages.includes(car.id as never) ? 'block' : 'none' }}
                                className="w-full rounded-lg mb-2 max-h-72 object-cover hover:scale-105 transition-all"
                                alt="Foto do carro"
                                src={car.images[0].url}
                                onLoad={() => handleImageLoad(car.id)}
                            />
                            <p className="font-bold mt-1 mb-2 px-2" >{car.name}</p>
                            <div className="flex flex-col px-2" >
                                <span className="text-zinc-700 mb-6" >{car.year} | {car.km}Km</span>
                                <strong className="text-black font-medium text-xl" >
                                    {Number(car.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </strong>
                            </div>
                            <div className="w-full h-px bg-slate-200 my-2" ></div>
                            <div className="p-2">
                                <span className="text-zinc-700" >{car.city}</span>
                            </div>
                        </section>
                    </Link>
                ))}
            </main>
        </Container>
    )
}