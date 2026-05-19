import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ScrollToTop from "./components/shared/ScrollToTop"

import Header from "./components/layouts/Header"
import Footer from "./components/layouts/Footer"

const Home               = lazy(() => import("./components/pages/Home"))
const GenreMovie         = lazy(() => import("./components/container/GenreMovie"))
const CountryMovie       = lazy(() => import("./components/container/CountryMovie"))
const MovieListByCategory = lazy(() => import("./components/pages/MovieListByCategory"))
const SearchResults      = lazy(() => import("./components/container/SearchResults"))
const MoviesCard         = lazy(() => import("./components/container/MoviesCard"))
const MoviesPlay         = lazy(() => import("./components/container/MoviesPlay"))
const WatchHistory       = lazy(() => import("./components/pages/WatchHistory"))
const Watchlist          = lazy(() => import("./components/pages/Watchlist"))
const NotFound           = lazy(() => import("./components/pages/NotFound"))

function PageLoader() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: "4px solid #ffffff22",
        borderTop: "4px solid #e50914",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/the-loai/:slug" element={<GenreMovie />} />
              <Route path="/quoc-gia/:slug" element={<CountryMovie />} />
              <Route path="/danh-sach/:slug" element={<MovieListByCategory />} />
              <Route path="/tim-kiem" element={<SearchResults />} />
              <Route path="/phim/:slug" element={<MoviesCard />} />
              <Route path="/xem-phim/:slug" element={<MoviesPlay />} />
              <Route path="/lich-su" element={<WatchHistory />} />
              <Route path="/yeu-thich" element={<Watchlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
