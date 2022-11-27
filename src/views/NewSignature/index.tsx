import Footer from '@/components/Footer'
import Sign from './Sign'
import { Pdf } from '@/svgs'
import { useAppContext } from '@/utils/useAppContext'
import { Button, Modal, notification, Tabs } from 'antd'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import History from './History'
import { DocsData, TableRow } from './type'
import UploadDocument from './UploadDocument'
import { ActionTypes } from '@/context/AppContext'
import dayjs from 'dayjs'

export default function NewSignature() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [list, setList] = useState<TableRow[]>(() => {
    const documents = localStorage.getItem('documents')
      ? JSON.parse(localStorage.getItem('documents')!)
      : []
    return documents
  })
  const [selected, setSelected] = useState<string | null>(() => {
    const documents: TableRow[] = localStorage.getItem('documents')
      ? JSON.parse(localStorage.getItem('documents')!)
      : []
    if (documents.length < 1) {
      return null
    }
    return documents[0].id
  })

  const [tabKey, setTabKey] = useState<string>('upload-new-file')
  const [isCancelModal, setIsCancelModal] = useState<boolean>(false)

  // adjust height
  useEffect(() => {
    convertStyle()
    window.addEventListener('resize', convertStyle)
    return () => {
      window.removeEventListener('resize', convertStyle)
    }
  }, [])

  // reset selected doc when back to upload tab
  useEffect(() => {
    if (tabKey === 'upload-new-file' && list.length > 0) {
      setSelected(list[0].id)
    }
  }, [tabKey])

  function convertStyle() {
    const target = document.querySelector('.f2e-layout-new-signature-tab-content') as HTMLElement
    if (target) {
      const height = window.innerWidth <= 768 ? window.innerHeight - 330 : window.innerHeight - 285
      target.style.setProperty('height', `${height}px`)
    }
  }

  function renderTabContent() {
    switch (tabKey) {
      case 'upload-new-file':
        return <UploadDocument list={list} onUploaded={onUploaded} />
      case 'select-history-file':
        return (
          <History
            list={list}
            selected={selected}
            onSelected={onSelected}
            onFinishDelete={onFinishDelete}
          />
        )

      default:
        return <h2 className='f2e-layout-not-release'>這項功能還在開發中，請見諒 (´;ω;`)</h2>
    }
  }

  function getTab() {
    return [
      {
        label: '上傳新文件',
        key: 'upload-new-file'
      },
      {
        label: '選擇已上傳文件',
        key: 'select-history-file'
      }
    ]
  }

  function onUploaded(newList: TableRow[], newData: DocsData[]) {
    try {
      localStorage.setItem('documentsData', JSON.stringify(newData))
      localStorage.setItem('documents', JSON.stringify(newList))
      setSelected(newList[0].id)
      setList(newList)
      setTabKey('select-history-file')
    } catch (error: any) {
      console.log('error', error.message)
      notification.error({
        message: '糟糕！發生了一點錯誤 :(',
        description: '已超出可儲存空間，請先清除目前現有的檔案。'
      })
    }
  }

  function onSelected(id: string | null) {
    setSelected(id)
  }

  function onOpen() {
    setIsUploading(true)
    setTimeout(() => {
      const newList = cloneDeep(list)
      const storage = localStorage.getItem('documentsData')
      const index = newList.findIndex((item) => item.id === selected)
      if (index < 0 || !storage) {
        notification.error({
          message: '糟糕！發生了一點錯誤 :(',
          description: '找不到對應的文件資料。'
        })
        setIsUploading(false)
        return
      }
      newList[index].lastTimeOpen = dayjs().format('YYYY/MM/DD，HH:mm')
      const docs = JSON.parse(storage) as DocsData[]
      const docData = docs.find((item) => item.id === selected)?.data
      localStorage.setItem('documents', JSON.stringify(newList))
      dispatch({ type: ActionTypes.UpdateProgress, payload: 1 })
      dispatch({ type: ActionTypes.UpdatePdfData, payload: docData })
      dispatch({ type: ActionTypes.UpdatePdfName, payload: newList[index].name })
      setList(newList)
      setIsUploading(false)
    }, 2000)
  }

  function onFinishDelete(newList: TableRow[]) {
    setList(newList)
  }

  return (
    <>
      <div className='f2e-layout-new-signature'>
        {state.progress === 0 ? (
          <div className='f2e-layout-new-signature-container'>
            <Tabs
              items={getTab()}
              onChange={(tabKey: string) => setTabKey(tabKey)}
              activeKey={tabKey}
            />
            <div className='f2e-layout-new-signature-tab-content'>{renderTabContent()}</div>
          </div>
        ) : (
          <Sign />
        )}
      </div>
      {state.progress === 0 && (
        <Footer phase={state.progress}>
          <Button onClick={() => setIsCancelModal(true)}>取消</Button>
          <Button
            type='primary'
            disabled={tabKey !== 'select-history-file' || selected === null}
            onClick={onOpen}
          >
            開啟文件
          </Button>
        </Footer>
      )}

      <Modal
        className='f2e-layout-message-modal'
        open={isCancelModal}
        closable={false}
        centered={true}
        okText='確定捨棄'
        cancelText='取消'
        onOk={() => {
          dispatch({ type: ActionTypes.UpdateSignatureMode, payload: null })
          setIsCancelModal(false)
          navigate('/', { replace: true })
        }}
        onCancel={() => setIsCancelModal(false)}
      >
        <p className='f2e-layout-message-modal-text'>是否確定取消，目前的編輯進度將不會保留。</p>
      </Modal>
      <Modal
        className='f2e-layout-loading-modal'
        open={isUploading}
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
