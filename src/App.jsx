import GenreMovie from "./components/container/GenreMovie"
import CountryMovie from "./components/container/CountryMovie"
import Header from "./components/layouts/Header"
import Home from "./components/pages/Home"
import Footer from "./components/layouts/Footer";
import MovieListByCategory from "./components/pages/MovieListByCategory";

import { BrowserRouter, Routes, Route } from "react-router-dom"
import SearchResults from "./components/container/SearchResults";

function App() {

  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/the-loai/:slug" element={<GenreMovie />} />
            <Route path="/quoc-gia/:slug" element={<CountryMovie />} />
            <Route path="/danh-sach/:slug" element={<MovieListByCategory />} />
            <Route path="/tim-kiem" element={<SearchResults />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
