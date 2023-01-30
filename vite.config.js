import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  console.log(mode)
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd())
  console.log(env)
  return {
    plugins: [react()],
    define: {
      'process.env': env
    }
  }
})
