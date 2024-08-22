import React, { useState, useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiTrash, FiUpload } from 'react-icons/fi';
import { v4 as uuidV4 } from 'uuid';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';

import { Container } from '../../../components/container';
import { DashboardHeader } from '../../../components/painelHeader';
import { Input } from '../../../components/inputComponent';
import { db, storage } from '../../../services/firebaseConnection';
import { AuthContext } from '../../../contexts/authContext';

const schema = z.object({
    name: z.string().min(1, 'O campo nome é obrigatório'),
    model: z.string().min(1, 'O campo modelo é obrigatório'),
    year: z.string().min(1, 'O campo ano é obrigatório'),
    km: z.string().min(1, 'O campo de quilometragem do carro é obrigatório'),
    price: z.string().min(1, 'O campo de preço do carro é obrigatório'),
    city: z.string().min(1, 'O campo da cidade do carro é obrigatório'),
    whatsapp: z.string().min(1, 'O campo de telefone é obrigatório').regex(/^(\d{11,12})$/, 'Número de telefone inválido'),
    description: z.string().min(1, 'O campo de descrição do carro é obrigatório')
});

type FormData = z.infer<typeof schema>;

interface ImageItem {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export const New: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    });

    const [carImages, setCarImages] = useState<ImageItem[]>([]);
    const { user } = useContext(AuthContext);

    const onSubmit = useCallback(async (data: FormData) => {
        if (carImages.length === 0) {
            toast.error('É necessário cadastrar uma imagem para esse veículo');
            return;
        }

        try {
            const carListImages = carImages.map(image => ({
                uid: image.uid,
                name: image.name,
                url: image.url
            }));

            await addDoc(collection(db, 'cars'), {
                name: data.name.toUpperCase(),
                model: data.model,
                year: data.year,
                km: data.km,
                price: data.price,
                city: data.city,
                whatsapp: data.whatsapp,
                description: data.description,
                createdAt: new Date(),
                owner: user?.displayName,
                uid: user?.uid,
                images: carListImages
            });

            reset();
            setCarImages([]);
            toast.success('Veículo cadastrado com sucesso!');
        } catch (error) {
            console.error('Erro ao cadastrar veículo:', error);
            toast.error('Erro ao cadastrar o veículo. Por favor, tente novamente.');
        }
    }, [carImages, reset, user]);

    const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0];
            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image);
            } else {
                toast.error('Formato da imagem inválido. Use apenas JPEG ou PNG.');
            }
        }
    }, []);

    const handleUpload = useCallback(async (image: File) => {
        if (!user?.uid) return;

        const uidImage = uuidV4();
        const uploadRef = ref(storage, `images/${user.uid}/${uidImage}`);

        try {
            const snapshot = await uploadBytes(uploadRef, image);
            const downloadUrl = await getDownloadURL(snapshot.ref);

            const imageItem = {
                name: uidImage,
                uid: user.uid,
                previewUrl: URL.createObjectURL(image),
                url: downloadUrl,
            };

            setCarImages(prev => [...prev, imageItem]);
            toast.success('Imagem cadastrada com sucesso!');
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            toast.error('Erro ao cadastrar imagem. Por favor, tente novamente.');
        }
    }, [user]);

    const handleDeleteImage = useCallback(async (item: ImageItem) => {
        try {
            const imageRef = ref(storage, `images/${item.uid}/${item.name}`);
            await deleteObject(imageRef);
            setCarImages(prev => prev.filter(car => car.url !== item.url));
            toast.success('Imagem removida com sucesso!');
        } catch (error) {
            console.error('Erro ao remover imagem:', error);
            toast.error('Erro ao remover imagem. Por favor, tente novamente.');
        }
    }, []);

    return (
        <Container>
            <DashboardHeader />
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2" >
                <button className="border-2 w-48 flex justify-center items-center rounded-lg cursor-pointer border-gray-600 h-32 md:w-48" >
                    <div className="absolute cursor-pointer " >
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer" >
                        <input
                            type="file"
                            accept="image/*"
                            className="opacity-0 cursor-pointer"
                            onChange={handleFile} />
                    </div>
                </button>
                {carImages.map(image => (
                    <div key={image.name} className="w-full h-32 flex items-center justify-center relative " >
                        <button className="absolute" onClick={() => handleDeleteImage(image)} ><FiTrash size={28} color="#fff" /></button>
                        <img src={image.previewUrl}
                            className="rounded-lg w-full h-32 object-cover"
                            alt="Foto do carro"
                        />
                    </div>
                ))}
            </div>
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center mt-2" >
                <form
                    className="w-full "
                    onSubmit={handleSubmit(onSubmit)}
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
    );
};