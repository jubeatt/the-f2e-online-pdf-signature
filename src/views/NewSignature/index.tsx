import Footer from '@/components/Footer'
import { useAppContext } from '@/utils/useAppContext'
import { Button, Modal, Tabs } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UploadDocument from './UploadDocument'

export default function NewSignature() {
  const [tabKey, setTabKey] = useState<string>('upload-new-file')
  const [isModal, setIsModal] = useState<boolean>(false)
  const { state } = useAppContext()
  const navigate = useNavigate()

  function renderTabContent() {
    switch (tabKey) {
      case 'upload-new-file':
        return <UploadDocument />
      case 'select-history-file':
        return <h2 className='f2e-layout-not-release'>這項功能還在開發中，請見諒 (´;ω;`)</h2>

      default:
        return <h2 className='f2e-layout-not-release'>這項功能還在開發中，請見諒 (´;ω;`)</h2>
    }
  }

  return (
    <>
      <div className='f2e-layout-new-signature'>
        <div className='f2e-layout-new-signature-container'>
          <Tabs
            items={[
              {
                label: '上傳新文件',
                key: 'upload-new-file'
              },
              {
                label: '選擇已上傳文件',
                key: 'select-history-file'
              }
            ]}
            onChange={(tabKey: string) => setTabKey(tabKey)}
          />
          <div className='f2e-layout-new-signature-tab-content'>{renderTabContent()}</div>
        </div>
      </div>
      <Footer phase={state.progress}>
        <Button onClick={() => setIsModal(true)}>取消</Button>
        <Button type='primary' disabled={tabKey !== 'select-history-file'}>
          開啟文件
        </Button>
      </Footer>
      <Modal
        className='f2e-layout-message-modal'
        open={isModal}
        closable={false}
        centered={true}
        okText='確定捨棄'
        cancelText='取消'
        onOk={() => {
          navigate('/', { replace: true })
          setIsModal(false)
        }}
        onCancel={() => setIsModal(false)}
      >
        <p className='f2e-layout-message-modal-text'>是否確定取消，目前的編輯進度將不會保留。</p>
      </Modal>
    </>
  )
}
