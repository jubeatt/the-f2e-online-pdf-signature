import { Layout } from 'antd'
import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import { useAppContext } from './utils/useAppContext'
import Home from './views/Home'
import Login from './views/Login'
import NewSignature from './views/NewSignature'
import Sign from './views/NewSignature/Sign'

function App() {
  const { state } = useAppContext()

  useEffect(() => {
    window.addEventListener('click', closeMenuButton)
    return () => {
      window.removeEventListener('click', closeMenuButton)
    }
  }, [])

  function closeMenuButton(event: MouseEvent) {
    // @ts-ignore
    if (event.target.hasAttribute('data-name')) {
      return
    }
    const target = document.getElementById('menu-button')!
    if (target.classList.contains('opened')) {
      target.classList.remove('opened')
      target.setAttribute('aria-expanded', 'false')
    }
  }

  return (
    <>
      <Layout className='f2e-layout-wrapper'>
        <Header />
        <Layout.Content className='f2e-layout-content'>
          <Routes>
            <Route path='' element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='new-signature' element={<NewSignature />} />
            <Route
              path='new-signature/sign'
              element={state.pdfData ? <Sign /> : <Navigate to='/' replace={true} />}
            />
            <Route path='*' element={<Home />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </>
  )
}

export default App
