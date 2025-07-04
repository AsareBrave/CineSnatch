import React, { useState, useEffect } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}
const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [debounceSearchTerm, setDebounceSearchTerm] = useState('')
    useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])
    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query ? `${API_BASE_URL}/search/movie?query=
            ${encodeURI(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS)

            if (!response.ok) {
                throw new Error("Failed to fetch movie");
            }
            const data = await response.json();
            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies')
                setMovieList([]);
                return;
            }
            setMovieList(data.results)
            console.log(data.results)
        }
        catch (error) {
            console.log(`Error fetching movies: ${error}`);
            setErrorMessage('Error fetching movies. Please try again later')
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchMovies(debounceSearchTerm);
    }, [debounceSearchTerm]);
    return (
        <main>
            <div className="pattern">

            </div>
            <div className="wrapper">
                <header>
                    <img src='/hero.png' alt='Hero background' />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    {/* <h1 className='text-amber-200'>{searchTerm}</h1> */}
                </header>
                <section className='all-movies'>
                    <h2 className='mt-10'>All movies</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (<p className='text-red-500'>{errorMessage}</p>) : (
                        <ul>{movieList.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
        
                        ))}</ul>
                    )}
                </section>
            </div>
        </main>
    )
}

export default App