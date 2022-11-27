import diamond1 from '@/assets/images/diamond-1.png'
import diamond2 from '@/assets/images/diamond-2.png'
import { ActionTypes } from '@/context/AppContext'
import { Logo } from '@/svgs'
import { useAppContext } from '@/utils/useAppContext'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const { dispatch } = useAppContext()

  useEffect(() => {
    convertStyle()
    window.addEventListener('resize', convertStyle)
    return () => {
      window.removeEventListener('resize', convertStyle)
    }
  }, [])

  function convertStyle() {
    const target = document.querySelector('.f2e-layout-home-container') as HTMLElement
    const height = window.innerWidth <= 992 ? window.innerHeight - 85 : window.innerHeight - 65
    target.style.setProperty('height', `${height}px`)
  }

  return (
    <div className='f2e-layout-home'>
      <div className='f2e-layout-home-container'>
        <div className='f2e-layout-home-info-wrapper'>
          <div className='f2e-layout-home-info'>
            <h1 className='f2e-layout-home-info-logo'>
              <Logo />
            </h1>
            <p className='f2e-layout-home-info-slogan'>線上簽署，方便快速。</p>
          </div>
          <Link
            className='f2e-layout-home-info-link'
            to='/new-signature'
            onClick={() =>
              dispatch({ type: ActionTypes.UpdateSignatureMode, payload: '簽署新文件' })
            }
          >
            簽署新文件
          </Link>
        </div>
      </div>
      <img className='f2e-layout-home-diamond-1' src={diamond1} alt='菱形一' />
      <img className='f2e-layout-home-diamond-2' src={diamond2} alt='菱形二' />
      <div className='f2e-layout-home-copyright'>
        Copyright © 2022{' '}
        <a
          href='https://noarzxcvbnm.github.io/PersonalWebsite/index.html'
          target='_blank'
          rel='noreferrer'
        >
          Cai
        </a>{' '}
        Design. &{' '}
        <a href='https://github.com/jubeatt' target='_blank' rel='noreferrer'>
          PeaNu
        </a>{' '}
        All rights reserved.
      </div>
    </div>
  )
}
