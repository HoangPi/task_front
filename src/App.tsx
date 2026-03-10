import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import HomePage from './pages/main/hompage'
import { NavBar } from "./components/nav"
import { useAppDispatch, useAppSelector } from "./redux/hook"
import { removeUserInfomation, setUserInfo } from "./redux/storage/user"
import SignInPage from "./pages/signin"
import { useEffect } from "react"
import { VerifyUserSession } from "./service/user/userService"
import ProfilePage from "./pages/profile"
import DashboardPage from "./pages/dashboard"

function App() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  useEffect(() => {
    VerifyUserSession()
      .then(res => {
        dispatch(setUserInfo(res))
      })
      .catch((e) => {
        console.log(e);
        localStorage.removeItem("access")
        dispatch(removeUserInfomation())
      })
  }, [user])

  return (<>
    <NavBar />
    <Routes>
      <Route index element={<HomePage />}></Route>
      <Route path="/signin" element={<SignInPage></SignInPage>} />
      <Route path="/profile" element={<ProfilePage></ProfilePage>} />
      <Route path="/dashboard/*" element={<DashboardPage></DashboardPage>} />
    </Routes>
    <button onClick={() => {
      dispatch(removeUserInfomation())
      localStorage.removeItem("access")
    }}>Remove</button>
  </>
  )
}

export default App
