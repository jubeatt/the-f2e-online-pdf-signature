import { ActionTypes } from '@/context/AppContext'
import { Logo2 } from '@/svgs'
import { useAppContext } from '@/utils/useAppContext'
import { Layout, Menu } from 'antd'
import { NavLink } from 'react-router-dom'
import MenuButton from './MenuButton'

export default function Header() {
  const { dispatch } = useAppContext()

  return (
    <Layout.Header className='f2e-layout-header'>
      <div className='f2e-layout-header-container'>
        <div className='f2e-layout-header-left'>
          <NavLink
            to='/'
            onClick={() => {
              dispatch({ type: ActionTypes.UpdatePdfData, payload: null })
              dispatch({ type: ActionTypes.UpdatePdfName, payload: null })
              dispatch({ type: ActionTypes.UpdateProgress, payload: 0 })
            }}
          >
            <Logo2 />
          </NavLink>
          {/* need condition here */}
          {/* <p className='f2e-layout-header-title'>簽署新文件</p> */}
        </div>
        <div className='f2e-layout-header-right'>
          <Menu mode='horizontal' overflowedIndicator={<MenuButton />} triggerSubMenuAction='click'>
            <Menu.Item disabled={true} key='invite-signature'>
              {/* <Link to='/invite-signature'>邀請他人簽署</Link> */}
              邀請他人簽署
            </Menu.Item>
            <Menu.Item key='new-signature'>
              <NavLink
                to='new-signature'
                onClick={() => {
                  dispatch({ type: ActionTypes.UpdatePdfData, payload: null })
                  dispatch({ type: ActionTypes.UpdatePdfName, payload: null })
                  dispatch({ type: ActionTypes.UpdateProgress, payload: 0 })
                }}
              >
                簽署新文件
              </NavLink>
            </Menu.Item>
            {/* <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>{' '}
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>{' '}
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>{' '}
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>{' '}
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>{' '}
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>{' '}
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>{' '}
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item>{' '}
            <Menu.Item key='new-signature'>
              <NavLink to='new-signature'>簽署新文件</NavLink>
            </Menu.Item> */}
            <Menu.Item key='login'>
              <NavLink to='login'>登入</NavLink>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </Layout.Header>
  )
}
