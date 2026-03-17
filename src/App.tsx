import { Routes, Route } from "react-router-dom"
import HomePage from './pages/main/hompage'
import { NavBar } from "./components/nav"
import { useAppDispatch, useAppSelector } from "./redux/hook"
import { removeUserInfomation, setUserInfo } from "./redux/storage/user"
import SignInPage from "./pages/signin"
import { useEffect, useState } from "react"
import { VerifyUserSession } from "./service/user/userService"
import SidebarLayout from "./pages/project/board"
import { GlobalToast, type ToastState } from "./components/toast/notification"
import { ToastContext } from "./components/toast/messageContetx"

function App() {
  const [toastState, setToastState] = useState<ToastState | null>(null)
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
    <ToastContext value={{ data: toastState, dispatcher: setToastState }}>
      <NavBar />
      <GlobalToast />
      <Routes>
        <Route index element={<HomePage />}></Route>
        <Route path="/signin" element={<SignInPage></SignInPage>} />
        {user.userId ? <>
          <Route path="/dashboard/*" element={<SidebarLayout />}></Route>
        </> : <></>}
      </Routes>
      <button onClick={() => {
        dispatch(removeUserInfomation())
        localStorage.removeItem("access")
      }}>Remove</button>
    </ToastContext>
  </>
  )
}

export default App
