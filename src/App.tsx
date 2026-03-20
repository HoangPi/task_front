import { Routes, Route } from "react-router-dom"
import HomePage from './pages/main/hompage'
import { NavBar } from "./components/nav"
import { useAppDispatch, useAppSelector } from "./redux/hook"
import { removeUserInfomation, setUserInfo } from "./redux/storage/user"
import SignInPage from "./pages/signin"
import { useEffect, useState } from "react"
import { VerifyUserSession } from "./service/user/userService"
import SidebarLayout from "./pages/project/board"
import { GlobalToast, ToastType, type ToastState } from "./components/toast/notification"
import { ToastContext } from "./components/toast/messageContetx"
import { service } from "./service"
import { addProjectBulk } from "./redux/storage/project"
import ProfilePage from "./pages/profile"
import { SignUpPage } from "./pages/signup"

function App() {
  const [toastState, setToastState] = useState<ToastState | null>(null)
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  useEffect(() => {
    if (!user.userId) {
      localStorage.removeItem("access")
      return
    }
    VerifyUserSession()
      .then(res => {
        return dispatch(setUserInfo(res))
      })
      .then(() => service.projectService.getProjects())
      .then(res => dispatch(addProjectBulk(res)))
      .catch((e) => {
        localStorage.removeItem("access")
        dispatch(removeUserInfomation())
        setToastState({ message: String(e), type: ToastType.ERROR })
      })
  }, [user])

  return (<>
    <ToastContext value={{ data: toastState, dispatcher: setToastState }}>
      <NavBar />
      <GlobalToast />
      <Routes>
        <Route index element={<HomePage />}></Route>
        <Route path="/signin" element={<SignInPage></SignInPage>} />
        <Route path="/signup" element={<SignUpPage></SignUpPage>} />
        <Route  path="/dashboard/*" element={<SidebarLayout />}></Route>
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </ToastContext>
  </>
  )
}

export default App
