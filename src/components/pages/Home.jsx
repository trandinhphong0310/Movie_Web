import Banner from "../layouts/Banner"
import MovieSection from "../container/MovieSection"
import PopularMovies from "../container/PopularMovies"

export default function Home() {
  return (
    <>
      <Banner />
      <PopularMovies />
      <div className="flex flex-col rounded-2xl
        bg-gradient-to-t from-[rgba(40,43,58,1)] to-[rgba(40,43,58,0)] from-80%
        px-4 sm:px-6 md:px-8 py-6 gap-8 mt-4 md:mt-8">
        <MovieSection slug="phim-moi" />
        <MovieSection slug="phim-le" />
        <MovieSection slug="phim-bo" />
      </div>
    </>
  )
}
