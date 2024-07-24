import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';

export default function CallToAction({ category }) {

    const [categoryMapping, setCategoryMapping] = useState([]);

    useEffect(
        () => {
            const fetchCategory = async () => {
                try {
                    const res = await fetch('/api/post/get-category');
                    const data = await res.json();
                    const categoryMap = data.reduce((acc, curr) => {
                        acc[curr.NAME] = curr;
                        return acc;
                    }, {});
                    if (!res.ok) {
                        console.log(data.message);
                    } else {
                        setCategoryMapping(categoryMap);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            fetchCategory();
        }, []);

    const { URL, TEXT, IMAGE } = categoryMapping[category] || {};

    return (
        <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
            <div className="flex-1 justify-center flex flex-col">
                <h2 className='text-2xl'>
                    {TEXT}
                </h2>
                <p className='text-gray-500 my-2'>
                    {URL}
                </p>
                <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
                    <a href={URL} target='_blank' rel='noopener noreferrer'>
                        Click here for more resources
                    </a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img src={IMAGE} />
            </div>
        </div>
    )
}
