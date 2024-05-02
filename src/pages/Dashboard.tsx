import React, { useEffect, useState } from 'react'

const URL = 'https://pokeapi.co/api/v2/pokemon'
const IMG_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/'

type Pokemon = {
  id: number,
  name: string
  base_experience: number
  height: number
  is_default: boolean
  order: number
  weight: number

}

type AllPokemonResponse = {
  count: number,
  next: string
  previous: string,
  results: {
    name: string,
    url: string,
  }[]
}

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

function Dashboard() {
  const [search, setSearch] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [pokemonData, setPokemonData] = useState<Pokemon | null>(null)
  const [allPokemonData, setAllPokemonData] = useState<AllPokemonResponse | null>(null)

  const debouncedSearchTerm = useDebouncedValue(search, 500);

  useEffect(() => {
    console.log('loading', loading)
  }, [loading])

  const getAllPokemon = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${URL}?limit=40`)
      const result = await response.json()
      if (response.ok) {
        setAllPokemonData(result)
        setLoading(false)
      }
      else throw new Error("get pokemon data by name failed!");

    } catch (error) {
      alert(error)
      setLoading(false)
    }

  }
  const getPokemonDataByName = async (pokemonName: string) => {
    try {
      setLoading(true)
      const response = await fetch(`${URL}/${pokemonName}`)
      const result = await response.json()
      if (response.ok) {
        setPokemonData(result)
        setLoading(false)
      }
      else throw new Error("get pokemon data by name failed!");

    } catch (error) {
      alert(error)
      setLoading(false)
    }

  }

  useEffect(() => {
    getAllPokemon()
  }, [])

  const onChangePokemonName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    if (debouncedSearchTerm) getPokemonDataByName(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  return (
    <div className='flex flex-row items-center justify-center h-screen'>
      <div className='flex justify-center h-screen flex-row  flex-wrap border-r-2'>
        {allPokemonData?.results && allPokemonData?.results?.length > 0 && allPokemonData?.results?.map((pokemon, index) => {
          return (
            <div
              onClick={() => setSearch(pokemon?.name)}
              key={`pokemon-${index}`}
              className='p-4 flex flex-col m-2 max-h-20 shadow-md rounded-md justify-center items-center'>
              {pokemon && <img src={`${IMG_URL}${index + 1}.png`} alt={pokemonData?.name} className='max-w-10' />}
              <p className='font-bold'> {pokemon?.name}</p>
            </div>
          )
        })}
      </div>
      <div className='flex justify-center items-center max-w-96 flex-col h-full bg-blue px-4'>
        <h1 className='font-bold mb-4'>Detail</h1>
        <input value={search as string} type='text' placeholder='Pokemon Name' className='border border-slate-600 rounded-md px-4 py-2 mb-2' onChange={onChangePokemonName} />
        {!loading && pokemonData &&
          <div className='flex flex-col justify-center items-center'>
            <img src={`${IMG_URL}${pokemonData?.id}.png`} alt={pokemonData?.name} />
            <p className='text-left font-semibold w-full'>Name: {pokemonData?.name}</p>
            <p className='text-left w-full'>Weight: {pokemonData?.weight}</p>
            <p className='text-left w-full'>Order: {pokemonData?.order}</p>
            <p className='text-left w-full'>Base Exp: {pokemonData?.base_experience}</p>
          </div>
        }
        {loading &&
          <div className='animate-spin w-16 mt-10'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" /></svg>
          </div>
        }
      </div>
    </div>
  )
}

export default Dashboard