import { Routes, Route } from "react-router-dom"
import HomePage from './pages/main/hompage'
import { NavBar } from "./components/nav"
import { useAppDispatch, useAppSelector } from "./redux/hook"
import { removeUserInfomation, setUserInfo } from "./redux/storage/user"
import SignInPage from "./pages/signin"
import { useEffect, useState, type JSX } from "react"
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
import { ServerStatusPage } from "./pages/serverStatus"
import { axiosService } from "./service/axiosService"
import { UserNotFoundPage } from "./components/userNotFound"
import { NotFoundPage } from "./components/pageNotFound"

function App() {
  const [isServerConnected, setIsServerConnected] = useState(false)
  const [isTryingToConnect, setIsTryingToConnect] = useState(true);
  const [toastState, setToastState] = useState<ToastState | null>(null)
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const [hasDisplayServerStatus, setHasDisplayServerStatus] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<UserNotification | null>(null)

  const connectToServer = () => {
    setIsTryingToConnect(true);
    setHasDisplayServerStatus(false)
    axiosService({
      url: '',
      method: "GET",
      timeout: 60000
    })
      .then(() => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve()
          }, 1000);
        })
      })
      .then(() => {
        setIsServerConnected(true)
      })
      .catch(() => {
        setIsServerConnected(false)
      })
      .finally(() => {
        setTimeout(() => {
          setHasDisplayServerStatus(true)
        }, 1700);
        setIsTryingToConnect(false);
      })
  }

  useEffect(() => {
    VerifyUserSession()
      .then(res => {
        return dispatch(setUserInfo(res))
      })
      .then(() => service.projectService.getProjects())
      .then(res => dispatch(addProjectBulk(res)))
      .catch((_e) => {
        if (user.userId) {
          setToastState({ message: "Token has expired", type: ToastType.ERROR })
        }
        dispatch(removeUserInfomation())
      })
  }, [user])

  useEffect(() => {
    if (!isTryingToConnect) {
      return
    }
    if (!isServerConnected) {
      connectToServer()
    }
  }, [isServerConnected, isTryingToConnect])

  if (!isServerConnected || !hasDisplayServerStatus) {
    return (
      <ServerStatusPage isTryingToConnect={isTryingToConnect} isServerDown={!isServerConnected} onRetry={() => {
        setIsServerConnected(false)
        setIsTryingToConnect(true)
      }} />)
  }

  return (<>
    <ToastContext value={{ data: toastState, dispatcher: setToastState }}>
      <NotificationContext value={{ message: selectedNotification, dispatch: setSelectedNotification }}>
        <NavBar />
        <GlobalToast />
        <Routes>
          <Route index element={<HomePage />}></Route>
          <Route path="/signin" element={<SignInPage></SignInPage>} />
          <Route path="/signup" element={<SignUpPage></SignUpPage>} />
          <Route path="/dashboard/*" element={<ProtectedRoute ><SidebarLayout /></ProtectedRoute>}></Route>
          <Route path="/profile" element={<ProtectedRoute ><ProfilePage /></ProtectedRoute>} />
          <Route path="/invite/project" element={<ProtectedRoute ><InvitationActionPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NotificationContext>
    </ToastContext>
  </>
  )
}

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useAppSelector(s => s.user)
  if (!user.userId) {
    return <UserNotFoundPage />
  }
  return children
}

export default App
