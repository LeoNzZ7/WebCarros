export interface CarsProps {
    id: string
    userId: string
    name: string
    model: string
    year: string
    km: string
    price: string
    city: string
    whatsapp?: string
    images: CarsImagesProps[]
    owner?: string
    createdAt?: string
    description?: string
}

interface CarsImagesProps {
    userId: string
    name: string
    url: string
}