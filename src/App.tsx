import { Layout } from 'antd'
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './views/Home'
import Login from './views/Login'
import NewSignature from './views/NewSignature'

function App() {
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
            <Route path='*' element={<Home />} />
          </Routes>
        </Layout.Content>
      </Layout>
    </>
  )
}

export default App
