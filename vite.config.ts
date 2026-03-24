import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["8904-58-186-223-244.ngrok-free.app"]
  },
  base: '/task_front',
})
