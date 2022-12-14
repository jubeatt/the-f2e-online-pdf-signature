import Footer from '@/components/Footer'
import { Arrow, Pdf, Pen, Pen2, Picture, Remove, Trash } from '@/svgs'
import { useAppContext } from '@/utils/useAppContext'
import { Button, Tooltip, message, Input } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { getDocument } from 'pdfjs-dist'
import { notification, Modal } from 'antd'
import cx from 'classnames'
import { Colors, SignatureItem } from './type'
import { cloneDeep } from 'lodash'
import { ActionTypes } from '@/context/AppContext'
import { jsPDF } from 'jspdf'
import { useNavigate } from 'react-router-dom'
import uniqid from 'uniqid'

const colorList = ['black', 'blue', 'red']
const pdf = new jsPDF()

export default function Sign() {
  const navigate = useNavigate()
  const { state, dispatch } = useAppContext()
  const [signatureList, setSignatureList] = useState<SignatureItem[]>(() => {
    let data = [] as SignatureItem[]
    const storage = localStorage.getItem('signatures')
    if (storage) {
      data = JSON.parse(storage)
    }
    return data
  })
  const [isObjectSelected, setIsObjectSelected] = useState<boolean>(false)
  const [isSignaturing, setIsSignaturing] = useState<boolean>(false)
  const [isFinalPage, setIsFinalPage] = useState<boolean>(false)
  const [isOperationPanel, setIsOperationPanel] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCancelModal, setIsCancelModal] = useState<boolean>(false)
  const [isBackHomelModal, setIsBackHomeModal] = useState<boolean>(false)
  const [deleteOption, setDeleteOption] = useState({
    modal: false,
    selectedId: null as null | string
  })
  const [editOption, setEditOption] = useState({
    switcher: false,
    value: state.pdfName ?? '',
    modal: false
  })

  const [penColor, setPenColor] = useState<Colors>(Colors.black)
  const canvasPdf = useRef<any>(null)
  const canvasSign = useRef<any>(null)

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas-pdf')
    canvasPdf.current = canvas

    canvasPdf.current.on('selection:created', () => {
      setIsObjectSelected(true)
    })
    canvasPdf.current.on('selection:cleared', () => {
      setIsObjectSelected(false)
    })

    getPdfCanvas(state.pdfData!)
      .then((element) => {
        const scale = 1 / window.devicePixelRatio
        const img = new fabric.Image(element, {
          scaleX: scale,
          scaleY: scale
        })
        canvasPdf.current.requestRenderAll()
        canvasPdf.current.setWidth(img.width! / window.devicePixelRatio)
        canvasPdf.current.setHeight(img.height! / window.devicePixelRatio)
        canvasPdf.current.setBackgroundImage(
          img,
          canvasPdf.current.renderAll.bind(canvasPdf.current)
        )
        resizeCanvas1()
      })
      .catch((error) => {
        console.log('error', error.message)
        notification.error({
          message: '?????????????????????????????? :(',
          description: '?????? PDF ??????????????????????????????????????????????????????'
        })
        dispatch({ type: ActionTypes.UpdateProgress, payload: 0 })
        dispatch({ type: ActionTypes.UpdatePdfData, payload: null })
        dispatch({ type: ActionTypes.UpdatePdfName, payload: null })
        dispatch({ type: ActionTypes.UpdateSignatureMode, payload: null })
        navigate('/')
      })

    window.addEventListener('resize', resizeCanvas1)
    return () => {
      canvasPdf.current.dispose()
      window.removeEventListener('resize', resizeCanvas1)
      window.removeEventListener('resize', resizeCanvas2)
    }
  }, [])

  // update canvas brush color
  useEffect(() => {
    if (canvasSign.current) {
      canvasSign.current.freeDrawingBrush.color = penColor
    }
  }, [penColor])

  // make fabric object into "selectable / unSelectable"
  useEffect(() => {
    if (isFinalPage) {
      fabric.Object.prototype.selectable = false
    } else {
      fabric.Object.prototype.selectable = true
    }
  }, [isFinalPage])

  // get focus when edit document's name
  useEffect(() => {
    if (editOption.switcher) {
      const target = document.getElementById('edit-option')
      const target2 = document.getElementById('edit-option-mobile')
      target?.focus()
      target2?.focus()
    }
  }, [editOption.switcher])

  useEffect(() => {
    convertStyle()
    window.addEventListener('resize', convertStyle)
    return () => {
      window.removeEventListener('resize', convertStyle)
    }
  }, [])

  function convertStyle() {
    const target = document.querySelector('.f2e-layout-sign-canvas') as HTMLElement
    if (target) {
      // const height = window.innerWidth <= 768 ? window.innerHeight - 331 : window.innerHeight - 223
      const height = window.innerWidth <= 768 ? window.innerHeight - 375 : window.innerHeight - 223
      target.style.setProperty('height', `${height}px`)
    }
  }

  function resizeCanvas1() {
    const outerCanvasContainer = document.querySelector('.f2e-layout-sign-canvas-container')!
    const ratio = canvasPdf.current.getWidth() / canvasPdf.current.getHeight()
    const containerWidth = outerCanvasContainer.clientWidth
    const scale = containerWidth / canvasPdf.current.getWidth()
    const zoom = canvasPdf.current.getZoom() * scale

    canvasPdf.current.setDimensions({ width: containerWidth, height: containerWidth / ratio })
    canvasPdf.current.setViewportTransform([zoom, 0, 0, zoom, 0, 0])
  }

  function resizeCanvas2() {
    const outerCanvasContainer = document.querySelector('.f2e-layout-sign-canvas-container')!
    const ratio = canvasSign.current.getWidth() / canvasSign.current.getHeight()
    const containerWidth = outerCanvasContainer.clientWidth
    const scale = containerWidth / canvasSign.current.getWidth()
    const zoom = canvasSign.current.getZoom() * scale

    canvasSign.current.setDimensions({ width: containerWidth, height: containerWidth / ratio })
    canvasSign.current.setViewportTransform([zoom, 0, 0, zoom, 0, 0])
  }

  async function getPdfCanvas(srcData: string) {
    const base64Prefix = 'data:application/pdf;base64,'
    const data = atob(srcData.substring(base64Prefix.length))
    // ???????????? Object ?????????
    const pdfDoc = await getDocument({ data }).promise
    const pdfPage = await pdfDoc.getPage(1)
    const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio })

    // ?????? canvas ??????
    const canvasElement = document.createElement('canvas')
    const context = canvasElement.getContext('2d')!
    // ?????? canvas ?????????
    canvasElement.height = viewport.height
    canvasElement.width = viewport.width
    // ??? pdf ????????? canvas ???
    await pdfPage.render({
      canvasContext: context,
      viewport
    }).promise
    // ???????????? canvas ??????
    return canvasElement
  }

  function onModalOpen() {
    setIsSignaturing(true)
    setTimeout(() => {
      canvasSign.current = new fabric.Canvas('canvas-signature')
      const brush = new fabric.PencilBrush(canvasSign.current)
      canvasSign.current.freeDrawingBrush = brush
      canvasSign.current.freeDrawingBrush.color = penColor
      canvasSign.current.freeDrawingBrush.width = 3
      canvasSign.current.isDrawingMode = true
      // init width
      resizeCanvas2()

      // listener
      window.addEventListener('resize', resizeCanvas2)
    }, 100)
  }

  function onModalClose() {
    setIsSignaturing(false)
    window.removeEventListener('resize', resizeCanvas2)
  }

  function onSignatureFinish() {
    try {
      const imgSrc = canvasSign.current.toDataURL({ format: 'png' })
      const newList = cloneDeep(signatureList)
      newList.push({
        id: uniqid(),
        src: imgSrc
      })
      localStorage.setItem('signatures', JSON.stringify(newList))
      setSignatureList(newList)
      message.success('????????????????????????????????????????????????', 3)
      onModalClose()
    } catch (error: any) {
      console.log('error', error.message)
      notification.error({
        message: '?????????????????????????????? :(',
        description: '????????????????????????????????????????????????????????????????????????'
      })
    }
  }

  function dropPrevent(event: any) {
    event.preventDefault()
    event.stopPropagation()
  }

  function onDrag(event: React.DragEvent<HTMLImageElement>, id: string) {
    event.dataTransfer.setData('text/plain', id.toString())
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    const id = event.dataTransfer.getData('text/plain')
    const signature = signatureList.find((it) => it.id === id)
    if (signature) {
      // create signature image
      fabric.Image.fromURL(signature.src, (img) => {
        img.top = 20
        img.left = 20
        img.scaleX = 0.5
        img.scaleY = 0.5
        canvasPdf.current.add(img)
      })
    }
  }

  function onClick(id: string) {
    const signature = signatureList.find((it) => it.id === id)!
    // create signature image
    fabric.Image.fromURL(signature.src, (img) => {
      img.top = 20
      img.left = 20
      img.scaleX = 0.5
      img.scaleY = 0.5
      canvasPdf.current.add(img)
    })
    setIsOperationPanel(false)
  }

  function onClear() {
    const target = canvasPdf.current.getActiveObject()
    if (target) {
      // single
      canvasPdf.current.remove(target)
    }
    if (target._objects) {
      // multiple
      canvasPdf.current.remove(...target._objects)
      setIsObjectSelected(false)
    }
  }

  function onFinishPage() {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsFinalPage(true)
      canvasPdf.current.discardActiveObject().renderAll()
      setTimeout(() => {
        dispatch({ type: ActionTypes.UpdateProgress, payload: 2 })
        resizeCanvas1()
      }, 100)
    }, 2000)
  }

  function onBackToEditPage() {
    setIsFinalPage(false)
    setTimeout(() => {
      dispatch({ type: ActionTypes.UpdateProgress, payload: 1 })
      resizeCanvas1()
    }, 100)
  }

  function onDowload() {
    message.success('??????????????????????????????????????????', 3)
    const image = canvasPdf.current.toDataURL('image/png')
    const width = pdf.internal.pageSize.width
    const height = pdf.internal.pageSize.height
    pdf.addImage(image, 'png', 0, 0, width, height)
    pdf.save(state.pdfName ?? 'dowload.pdf')
  }

  return (
    <>
      <div className='f2e-layout-sign'>
        <div
          className='f2e-layout-sign-mobile-header'
          onClick={() => {
            setEditOption((lastOption) => ({
              ...lastOption,
              switcher: true,
              value: state.pdfName ?? ''
            }))
          }}
        >
          {editOption.switcher ? (
            <Input
              id='edit-option'
              value={editOption.value}
              onChange={(event) =>
                setEditOption((lastOption) => ({
                  ...lastOption,
                  value: event.target.value
                }))
              }
              onBlur={() => {
                setEditOption((lastOption) => ({
                  ...lastOption,
                  switcher: false,
                  modal: editOption.value.trim() !== state.pdfName
                }))
              }}
              onPressEnter={() => {
                setEditOption((lastOption) => ({
                  ...lastOption,
                  switcher: false,
                  modal: editOption.value.trim() !== state.pdfName
                }))
              }}
            />
          ) : (
            <>
              {state.pdfName}
              <Pen2 />
            </>
          )}
        </div>
        <div className={cx('f2e-layout-sign-container', { showcase: isFinalPage })}>
          {/* Side Panel */}
          <div className='f2e-layout-sign-side-panel-wrapper'>
            <div className='f2e-layout-sign-side-panel'>
              <div className='f2e-layout-sign-side-panel-header'>
                <h2 className='f2e-layout-sign-side-panel-header-title'>????????????</h2>
                <p
                  className={cx('f2e-layout-sign-side-panel-header-document-name', {
                    active: editOption.switcher
                  })}
                  onClick={() => {
                    setEditOption((lastOption) => ({
                      ...lastOption,
                      switcher: true,
                      value: state.pdfName ?? ''
                    }))
                  }}
                >
                  {editOption.switcher ? (
                    <Input
                      id='edit-option-mobile'
                      value={editOption.value}
                      onChange={(event) =>
                        setEditOption((lastOption) => ({
                          ...lastOption,
                          value: event.target.value
                        }))
                      }
                      onBlur={() => {
                        setEditOption((lastOption) => ({
                          ...lastOption,
                          switcher: false,
                          modal: editOption.value.trim() !== state.pdfName
                        }))
                      }}
                      onPressEnter={() => {
                        setEditOption((lastOption) => ({
                          ...lastOption,
                          switcher: false,
                          modal: editOption.value.trim() !== state.pdfName
                        }))
                      }}
                    />
                  ) : (
                    <>
                      {state.pdfName}
                      <Pen2 />
                    </>
                  )}
                </p>
              </div>
              <div className='f2e-layout-sign-side-panel-body'>
                <h2 className='f2e-layout-sign-side-panel-body-title'>????????????(?????????????????????)</h2>
                <ul className='f2e-layout-sign-side-panel-body-operation-list'>
                  <li className='f2e-layout-sign-side-panel-body-operation-list-item'>
                    <button onClick={onModalOpen}>
                      ???????????? <Pen />
                    </button>
                  </li>
                  <li className='f2e-layout-sign-side-panel-body-operation-list-item'>
                    <Tooltip title='??????><???????????????????????????'>
                      <button>
                        ???????????? <Picture />
                      </button>
                    </Tooltip>
                  </li>
                </ul>
                {signatureList.length > 0 ? (
                  <ul className='f2e-layout-sign-side-panel-body-image-list'>
                    {signatureList.map((signature) => (
                      <li
                        className='f2e-layout-sign-side-panel-body-image-list-item'
                        key={signature.id}
                        draggable='true'
                        onDragStart={(event) => {
                          event.dataTransfer.setData('text/plain', signature.id)
                        }}
                        onClick={(event) => {
                          // @ts-ignore
                          if (event.target.hasAttribute('data-svg')) {
                            return
                          }
                          onClick(signature.id)
                        }}
                      >
                        <img
                          src={signature.src}
                          alt='signature'
                          draggable='true'
                          onDragStart={(event) => onDrag(event, signature.id)}
                        />
                        <Remove
                          onClick={() => setDeleteOption({ selectedId: signature.id, modal: true })}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='f2e-layout-sign-side-panel-body-no-signature-message'>
                    (????????????????????????????????????...)
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* canvas */}
          <div className='f2e-layout-sign-canvas'>
            <div
              className='f2e-layout-sign-canvas-container'
              onDragOver={dropPrevent}
              onDrop={onDrop}
            >
              <canvas id='canvas-pdf'></canvas>
            </div>
          </div>
        </div>
        {/* side panel (mobile) */}
        {!isFinalPage ? (
          <div className={cx('f2e-layout-sign-mobile-panel', { active: isOperationPanel })}>
            <div className='f2e-layout-sign-mobile-panel-header'>
              <button
                className='f2e-layout-sign-mobile-panel-btn'
                onClick={() => setIsOperationPanel(!isOperationPanel)}
              >
                ????????????
                <Arrow />
              </button>
            </div>
            <div className='f2e-layout-sign-mobile-panel-body'>
              <p className='f2e-layout-sign-mobile-panel-body-hint'>???????????????????????????????????????</p>
              <ul className='f2e-layout-sign-mobile-panel-body-operation-list'>
                <li className='f2e-layout-sign-mobile-panel-body-operation-list-item'>
                  <button onClick={onModalOpen}>
                    ???????????? <Pen />
                  </button>
                </li>
                <li className='f2e-layout-sign-mobile-panel-body-operation-list-item'>
                  <Tooltip title='??????><???????????????????????????'>
                    <button>
                      ???????????? <Picture />
                    </button>
                  </Tooltip>
                </li>
              </ul>
              {signatureList.length > 0 ? (
                <ul className='f2e-layout-sign-mobile-panel-body-image-list'>
                  {signatureList.map((signature) => (
                    <li
                      className='f2e-layout-sign-mobile-panel-body-image-list-item'
                      key={signature.id}
                      draggable='true'
                      onDragStart={(event) => {
                        event.dataTransfer.setData('text/plain', signature.id.toString())
                      }}
                      onClick={(event) => {
                        // @ts-ignore
                        if (event.target.hasAttribute('data-svg')) {
                          return
                        }
                        onClick(signature.id)
                      }}
                    >
                      <img
                        src={signature.src}
                        alt='signature'
                        draggable='true'
                        onDragStart={(event) => onDrag(event, signature.id)}
                      />
                      <Remove
                        onClick={() => setDeleteOption({ selectedId: signature.id, modal: true })}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='f2e-layout-sign-mobile-panel-body-no-signature-message'>
                  (????????????????????????????????????...)
                </p>
              )}
            </div>
          </div>
        ) : null}
        {/* Footer */}
        <Footer phase={state.progress}>
          {isFinalPage ? (
            <>
              <Button key='phase3-home-btn' onClick={() => setIsBackHomeModal(true)}>
                ?????????
              </Button>
              <Button key='phase3-back-btn' onClick={onBackToEditPage}>
                ????????????
              </Button>
              <Button key='phase3-dowload-btn' type='primary' onClick={onDowload}>
                ????????????
              </Button>
            </>
          ) : (
            <>
              <Button key='phase2-cancel-btn' onClick={() => setIsCancelModal(true)}>
                ??????
              </Button>
              <Button key='phase2-clear-btn' disabled={!isObjectSelected} onClick={onClear}>
                ????????????
              </Button>
              <Button
                key='phase2-create-btn'
                type='primary'
                disabled={signatureList.length === 0}
                onClick={onFinishPage}
              >
                ????????????
              </Button>
            </>
          )}
        </Footer>
      </div>
      <Modal
        className='f2e-layout-sinature-modal'
        open={isSignaturing}
        onCancel={onModalClose}
        footer={false}
        closable={false}
        destroyOnClose={true}
        centered={true}
      >
        <p className='f2e-layout-sinature-modal-text'>????????????????????????!</p>
        <div className='f2e-layout-sinature-modal-canvas'>
          <canvas id='canvas-signature'></canvas>
          <button
            className='f2e-layout-sinature-modal-canvas-btn'
            onClick={() => canvasSign.current.clear()}
          >
            <Trash />
          </button>
        </div>
        <div className='f2e-layout-sinature-modal-footer'>
          <div className='f2e-layout-sinature-modal-footer-left'>
            {colorList.map((color) => (
              <button
                key={color}
                className={cx('f2e-layout-sinature-modal-footer-color-btn', color, {
                  // @ts-ignore
                  active: penColor === Colors[color]
                })}
                // @ts-ignore
                onClick={() => setPenColor(Colors[color])}
              ></button>
            ))}
          </div>
          <div className='f2e-layout-sinature-modal-footer-right'>
            <Button onClick={onModalClose}>??????</Button>
            <Button type='primary' onClick={onSignatureFinish}>
              ?????????
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        className='f2e-layout-loading-modal'
        open={isLoading}
        closable={false}
        centered={true}
        footer={false}
      >
        <p className='f2e-layout-loading-modal-text'>???????????????...</p>
        <div className='f2e-layout-loading-modal-svg'>
          <Pdf />
          <Pdf className='svg-fill' />
        </div>
      </Modal>
      <Modal
        className='f2e-layout-message-modal'
        open={isCancelModal}
        closable={false}
        centered={true}
        okText='????????????'
        cancelText='??????'
        onOk={() => {
          dispatch({ type: ActionTypes.UpdateProgress, payload: 0 })
          dispatch({ type: ActionTypes.UpdatePdfData, payload: null })
          dispatch({ type: ActionTypes.UpdatePdfName, payload: null })
          dispatch({ type: ActionTypes.UpdateSignatureMode, payload: null })
          setIsCancelModal(false)
          navigate('/', { replace: true })
        }}
        onCancel={() => setIsCancelModal(false)}
      >
        <p className='f2e-layout-message-modal-text'>????????????????????????????????????????????????????????????</p>
      </Modal>
      <Modal
        className='f2e-layout-message-modal'
        open={isBackHomelModal}
        closable={false}
        centered={true}
        okText='????????????'
        cancelText='??????'
        onOk={() => {
          dispatch({ type: ActionTypes.UpdateProgress, payload: 0 })
          dispatch({ type: ActionTypes.UpdatePdfData, payload: null })
          dispatch({ type: ActionTypes.UpdatePdfName, payload: null })
          dispatch({ type: ActionTypes.UpdateSignatureMode, payload: null })
          setIsCancelModal(false)
          navigate('/', { replace: true })
        }}
        onCancel={() => setIsBackHomeModal(false)}
      >
        <p className='f2e-layout-message-modal-text'>
          ??????????????????????????????????????????????????????????????????
        </p>
      </Modal>
      <Modal
        className='f2e-layout-message-modal'
        open={deleteOption.modal}
        closable={false}
        centered={true}
        okText='??????'
        cancelText='??????'
        onOk={() => {
          const newList = signatureList.filter((it) => it.id !== deleteOption.selectedId)
          setSignatureList(newList)
          setDeleteOption({ ...deleteOption, modal: false })
          localStorage.setItem('signatures', JSON.stringify(newList))
          message.success('????????????????????????', 3)
        }}
        onCancel={() => setDeleteOption({ ...deleteOption, modal: false })}
      >
        <p className='f2e-layout-message-modal-text'>???????????????????????????????</p>
      </Modal>
      <Modal
        className='f2e-layout-message-modal'
        open={editOption.modal}
        closable={false}
        centered={true}
        okText='????????????'
        cancelText='??????'
        onOk={() => {
          dispatch({ type: ActionTypes.UpdatePdfName, payload: editOption.value })
          setEditOption((lastOption) => ({
            ...lastOption,
            switcher: false,
            modal: false
          }))
          message.success('???????????????????????????', 3)
        }}
        onCancel={() =>
          setEditOption((lastOption) => ({
            ...lastOption,
            switcher: false,
            modal: false
          }))
        }
      >
        <p className='f2e-layout-message-modal-text'>????????????????????????????????????????????????</p>
      </Modal>
    </>
  )
}
