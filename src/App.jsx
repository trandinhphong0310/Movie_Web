import GenreMovie from "./components/container/GenreMovie"
import CountryMovie from "./components/container/CountryMovie"
import Header from "./components/layouts/Header"
import Home from "./components/pages/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <>
      <BrowserRouter>
          <Header/>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/the-loai/:slug" element={<GenreMovie />} />
              <Route path="/quoc-gia/:slug" element={<CountryMovie />} />
          </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
