import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './pages/main/hompage'
import { NavBar } from "./components/nav"

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route index element={<HomePage />}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
