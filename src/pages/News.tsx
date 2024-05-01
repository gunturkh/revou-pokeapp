import React, { useCallback, useEffect, useState } from 'react'
const API_KEY = '1853e815e89d4a7fbd8933044f149af3'
const NEWS_URL = 'https://newsapi.org/v2/everything'

const useDebouncedValue = (inputValue: string | null, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(inputValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [inputValue, delay]);

    return debouncedValue;
};

type Articles = {
    source: {
        id: number | null,
        name: string
    },
    author: string,
    title: string,
    description: string,
    url: string,
    urlToImage: string,
    publishedAt: string,
    content: string

}
type New = {
    articles: Articles[],
    status: string,
    totalResults: number,
}

function News() {
    const [search, setSearch] = useState('bitcoin')
    const [newsData, setNewsData] = useState<New | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const debouncedSearchTerm = useDebouncedValue(search, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const options = {
        method: 'GET',
        headers: {
            Authorization: API_KEY
        }
    }
    const getNews = useCallback(async (searchString: string) => {
        try {
            setLoading(true)
            const response = await fetch(`${NEWS_URL}?q=${searchString}`, options)
            const result = await response.json()
            console.log('news api result', result)
            if (response.ok) {
                setNewsData(result)
                setLoading(false)
            }
            else throw new Error("get news failed!");
        } catch (error) {
            console.error(error)
            setLoading(false)
        }

    }, [options])
    const onChangeNewsSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }
    useEffect(() => {
        getNews(search)
    }, [getNews, search])

    useEffect(() => {
        if (debouncedSearchTerm) getNews(debouncedSearchTerm)
    }, [debouncedSearchTerm, getNews])

    return (
        <div className='flex justify-center h-screen'>
            <div className='w-full h-full'>
                <div className='flex justify-center fixed w-full bg-white p-4 shadow-sm'>
                    <input type='text' placeholder='Search News Here' className='m-auto border border-slate-600 rounded-md px-4 py-2 mb-2 mt-4' onChange={onChangeNewsSearch} />
                </div>
                <div className='overflow-scroll flex justify-center flex-col p-10 mt-16'>
                    {loading &&
                        <div className='flex justify-center items-center'>
                            <div className='animate-spin w-16 mt-10'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" /></svg>
                            </div>
                        </div>
                    }
                    {!loading && newsData && newsData?.articles?.map((item, index) => {
                        return (
                            <div
                                key={`news-${index}`}
                                className='shadow-md hover:shadow-xl transition ease-in rounded-md p-8 my-4'
                            >
                                <div>{index + 1}</div>
                                <h1 className='font-bold text-lg my-2'>{item.title}</h1>
                                <h2 className='font-thin text-md my-2'>{item.author}</h2>
                                <p className='font-normal'>{item.content}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default News