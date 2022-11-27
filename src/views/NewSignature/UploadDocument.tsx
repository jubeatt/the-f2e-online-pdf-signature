import { ActionTypes } from '@/context/AppContext'
import { Pdf } from '@/svgs'
import { useAppContext } from '@/utils/useAppContext'
import { Upload, Modal, notification } from 'antd'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { DocsData, TableRow } from './type'
import { cloneDeep } from 'lodash'
import uniqid from 'uniqid'

const maxFileSize = 5 * 1024 * 1024

interface Props {
  list: TableRow[]
  onUploaded: (newList: TableRow[], newData: DocsData[]) => void
}

const UploadDocument: React.FC<Props> = (props) => {
  const [isError, setIsError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function onFileSelect(file: File) {
    if (file.size > maxFileSize) {
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
        const id = uniqid()
        const storage = localStorage.getItem('documentsData')
        const newList = cloneDeep(props.list)
        let newData: DocsData[] = []
        if (storage) {
          newData = JSON.parse(storage) as DocsData[]
        }
        newList.unshift({
          id: id,
          name: file.name,
          uploadTime: dayjs().format('YYYY/MM/DD，HH:mm'),
          lastTimeOpen: null
        })
        newData.unshift({
          id: id,
          data: fileReader.result as ArrayBuffer
        })
        if (newList.length > 5) {
          newList.pop()
        }
        if (newData.length > 5) {
          newData.pop()
        }
        setIsLoading(false)
        props.onUploaded(newList, newData)
      }, 2000)
    })
    fileReader.addEventListener('error', () => {
      setTimeout(() => {
        setIsLoading(false)
        notification.error({
          message: '糟糕！發生了一點錯誤 :(',
          description: '上傳檔案時發生了一些錯誤，請重新上傳或聯繫工程師處理。'
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
        <p className='f2e-layout-upload-message'>（限5MB以下PDF檔）</p>
      </Upload.Dragger>
      <Modal
        className='f2e-layout-message-modal no-cancel-btn'
        open={isError ? true : false}
        closable={false}
        centered={true}
        okText='我知道了'
        onOk={() => setIsError(null)}
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
        <p className='f2e-layout-loading-modal-text'>文件上傳中...</p>
        <div className='f2e-layout-loading-modal-svg'>
          <Pdf />
          <Pdf className='svg-fill' />
        </div>
      </Modal>
    </>
  )
}

export default UploadDocument
