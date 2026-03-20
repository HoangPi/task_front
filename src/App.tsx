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
import { InvitationActionPage } from "./pages/invite"
import { NotificationContext } from "./components/nav/notificationContext"
import { type UserNotification } from "./components/nav/navigationSmall"

function App() {
  const [toastState, setToastState] = useState<ToastState | null>(null)
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const [selectedNotification, setSelectedNotification] = useState<UserNotification | null>(null)

  useEffect(() => {
    // if (!user.userId) {
    //   localStorage.removeItem("access")
    //   return
    // }
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
      <NotificationContext value={{message: selectedNotification, dispatch: setSelectedNotification}}>
        <NavBar />
        <GlobalToast />
        <Routes>
          <Route index element={<HomePage />}></Route>
          <Route path="/signin" element={<SignInPage></SignInPage>} />
          <Route path="/signup" element={<SignUpPage></SignUpPage>} />
          <Route path="/dashboard/*" element={<SidebarLayout />}></Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/invite/project" element={<InvitationActionPage />} />
        </Routes>
      </NotificationContext>
    </ToastContext>
  </>
  )
}

export default App
