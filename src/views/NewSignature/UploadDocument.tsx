import { ActionTypes } from '@/context/AppContext'
import { Pdf } from '@/svgs'
import { useAppContext } from '@/utils/useAppContext'
import { Upload, Modal, notification } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const maxSize = 10 * 1024 * 1024

export default function UploadDocument() {
  const [isError, setIsError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { dispatch } = useAppContext()

  useEffect(() => {
    convertStyle()
    window.addEventListener('resize', convertStyle)
    return () => {
      window.removeEventListener('resize', convertStyle)
    }
  }, [])

  function convertStyle() {
    const target = document.querySelector('.f2e-layout-new-signature-tab-content') as HTMLElement
    const height = window.innerWidth <= 768 ? window.innerHeight - 330 : window.innerHeight - 285
    target.style.setProperty('height', `${height}px`)
  }

  function onFileSelect(file: File) {
    if (file.size > maxSize) {
      setIsError('您的檔案太大了!')
      return false
    }
    if (file.type !== 'application/pdf') {
      setIsError('您的檔案類型不是PDF檔!')
      return false
    }

    const fileReader = new FileReader()
    setIsLoading(true)
    fileReader.readAsDataURL(file)
    fileReader.addEventListener('load', () => {
      setTimeout(() => {
        dispatch({ type: ActionTypes.UpdateProgress, payload: 1 })
        dispatch({ type: ActionTypes.UpdatePdfData, payload: fileReader.result })
        dispatch({ type: ActionTypes.UpdatePdfName, payload: file.name })
        setIsLoading(false)
        navigate('/new-signature/sign')
      }, 2000)
    })
    fileReader.addEventListener('error', () => {
      setTimeout(() => {
        setIsLoading(false)
        notification.error({
          message: '錯誤提示',
          description: '糟糕！上傳 PDF 時發生了一些錯誤，請重新上傳或聯繫工程師處理 :('
        })
      }, 2000)
    })

    return false
  }

  return (
    <>
      <Upload.Dragger multiple={false} beforeUpload={onFileSelect} showUploadList={false}>
        <p className='f2e-layout-upload-title pc'>點擊此處上傳 或 直接拖曳檔案</p>
        <p className='f2e-layout-upload-title mobile'>點擊此處上傳</p>
        <Pdf />
        <p className='f2e-layout-upload-message'>（限10MB以下PDF檔）</p>
      </Upload.Dragger>
      <Modal
        className='f2e-layout-message-modal no-cancel-btn'
        open={isError ? true : false}
        closable={false}
        centered={true}
        okText='我知道了'
        onOk={() => setIsError(null)}
        // onCancel={() => setIsError(null)}
      >
        <p className='f2e-layout-message-modal-text'>{isError}</p>
      </Modal>
      <Modal
        className='f2e-layout-loading-modal'
        open={isLoading}
        closable={false}
        centered={true}
        footer={false}
      >
        <p className='f2e-layout-loading-modal-text'>文件讀取中...</p>
        <div className='f2e-layout-loading-modal-svg'>
          <Pdf />
          <Pdf className='svg-fill' />
        </div>
      </Modal>
    </>
  )
}
