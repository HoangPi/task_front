import { BrowserRouter, Routes, Route } from "react-router-dom"
import HomePage from './pages/main/hompage'
import { NavBar } from "./components/nav"
import { useAppDispatch } from "./redux/hook"
import { removeUserInfomation, setUserInfo } from "./redux/storage/user"
import SignInPage from "./pages/signin"

function App() {
  const dispatch = useAppDispatch()

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route index element={<HomePage />}></Route>
        <Route path="/signin" element={<SignInPage></SignInPage>} />
      </Routes>
      <button onClick={() => dispatch(setUserInfo({ id: 12, name: 'name', username: 'u', email: 'mail', role: 'user', notifications: 0 }))}>Set</button>
      <button onClick={() => dispatch(removeUserInfomation())}>Remove</button>
    </BrowserRouter>
  )
}

export default App
