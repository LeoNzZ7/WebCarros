import { FiTrash2 } from "react-icons/fi"
import { Container } from "../../components/container"
import { DashboardHeader } from "../../components/painelHeader"
import { useContext, useEffect, useState } from "react"
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db, storage } from "../../services/firebaseConnection"
import { AuthContext } from "../../contexts/authContext"
import { deleteObject, ref } from "firebase/storage"

interface CarsProps {
    id: string
    userId: string
    name: string
    model: string
    year: string
    km: string
    price: string
    city: string
    images: CarsImagesProps[]
    owner: string
}

interface CarsImagesProps {
    userId: string
    name: string
    url: string
}

export const Dashboard = () => {
    const [cars, setCars] = useState<CarsProps[] | []>([])

    const { user } = useContext(AuthContext)

    useEffect(() => {
        async function loadCars() {
            if (!user?.uid) {
                return;
            }

            const carsRef = collection(db, "cars")
            const queryRef = query(carsRef, where("userId", "==", user.uid));

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
            }).catch((error) => {
                console.log("Error fetching documents: ", error);
            })
        }

        loadCars()
    }, [user])

    async function handleDeleteCar(car: CarsProps) {
        const docRef = doc(db, "cars", car.id)
        await deleteDoc(docRef).then(() => {
            car.images.map(async (image) => {
                const imagePath = `images/${user?.uid}/${image.name}`
                const imageRef = ref(storage, imagePath)

                await deleteObject(imageRef).then(() => {
                    setCars(cars.filter(car => car.id !== car.id))
                }).catch((error) => console.log(error))
            })
        })
    }

    return (
        <Container>
            <DashboardHeader />

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" >
                {cars && cars.map((car) => (
                    <section key={car.id} className="w-full bg-white rounded-lg relative" >
                        <button
                            onClick={() => handleDeleteCar(car)}
                            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
                        >
                            <FiTrash2
                                size={26}
                                color="#000"
                            />
                        </button>
                        <img
                            className="w-full rounded-lg mb-2 max-h-78"
                            src={car.images[0].url}
                        />
                        <p className="font-bold mt-1 px-2 mb-2" >Nissa versa</p>
                        <div className="flex flex-col px-2" >
                            <span className="text-zinc-700" >
                                ano {car.year} | {car.km}Km
                            </span>
                            <strong className="text-black font-bold mt-4" >{Number(car.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                        </div>
                        <div className="w-full h-px bg-slate-200 my-2" ></div>
                        <div className="px-2 pb-2">
                            <span className="text-black" >{car.city}</span>
                        </div>
                    </section>
                ))}

            </main>
        </Container>
    )
}