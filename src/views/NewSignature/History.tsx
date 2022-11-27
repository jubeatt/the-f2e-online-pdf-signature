import { Clear, Search } from '@/svgs'
import { Table, Input, AutoComplete, Button, message, Modal } from 'antd'
import { DefaultOptionType } from 'antd/es/select'
import { ColumnsType } from 'antd/es/table'
import { cloneDeep } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { DocsData, TableRow } from './type'

interface Props {
  list: TableRow[]
  selected: string | null
  onSelected: (id: string | null) => void
  onFinishDelete: (newList: TableRow[]) => void
}

const History: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [deleteOption, setDeleteOption] = useState({
    switcher: false,
    selected: [] as string[],
    modal: false
  })
  const [displayList, setDisplayList] = useState<TableRow[]>([])
  const autoCompleteoption = useMemo<DefaultOptionType[]>(() => {
    return props.list
      .filter(
        (data) => searchValue !== '' && data.name.toLowerCase().includes(searchValue.toLowerCase())
      )
      .map((data) => ({
        label: data.name,
        value: data.name
      }))
  }, [props.list, searchValue])

  // add active class to the selected row
  useEffect(() => {
    const rows = document.querySelectorAll('.ant-table-row')
    if (rows.length > 0) {
      rows.forEach((row) => row.classList.remove('active'))
    }
    if (!props.selected) {
      return
    }
    const index = displayList.findIndex((item) => item.id === props.selected)
    if (index > -1) {
      const target = rows[index]
      target.classList.add('active')
    }
  }, [props.selected, displayList])

  // refresh displayList
  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setDisplayList(cloneDeep(props.list))
      setLoading(false)
    }, 500)
  }, [props.list])

  function getColumn(): ColumnsType<TableRow> {
    return [
      {
        key: 'name',
        dataIndex: 'name',
        title: '名稱',
        width: window.innerWidth < 768 ? 200 : 380
      },
      {
        key: 'uploadTime',
        dataIndex: 'uploadTime',
        title: '上傳時間',
        width: window.innerWidth < 768 ? 200 : 280
      },
      {
        key: 'lastTimeOpen',
        dataIndex: 'lastTimeOpen',
        title: '上次開啟',
        width: window.innerWidth < 768 ? 200 : 280,
        render: (_, record) => record.lastTimeOpen ?? '--'
      }
    ]
  }

  function onSearch(value: string) {
    props.onSelected(null)
    setLoading(true)
    setDisplayList([])
    setTimeout(() => {
      const newList = props.list.filter((item) => item.name.includes(value.trim()))
      setDisplayList(newList)
      setLoading(false)
    }, 500)
  }

  function onDelete() {
    const newList = props.list.filter((item) => !deleteOption.selected.includes(item.id))
    localStorage.setItem('documents', JSON.stringify(newList))
    const storage = localStorage.getItem('documentsData')
    if (storage) {
      const data = JSON.parse(storage) as DocsData[]
      const newData = data.filter((item) => !deleteOption.selected.includes(item.id))
      localStorage.setItem('documentsData', JSON.stringify(newData))
    }
    setDeleteOption({ switcher: false, selected: [], modal: false })
    message.success('文件刪除成功！', 3)
    props.onFinishDelete(newList)
  }

  return (
    <>
      <div className='f2e-layout-history'>
        <div className='f2e-layout-history-search'>
          <AutoComplete
            popupClassName='f2e-search-popup'
            options={autoCompleteoption}
            defaultOpen={false}
            value={searchValue}
            onChange={(value: string) => setSearchValue(value)}
            onSelect={(value: string) => onSearch(value)}
          >
            <Input
              placeholder='搜尋文件名稱'
              suffix={<Search onClick={() => onSearch(searchValue)} />}
              allowClear={{ clearIcon: <Clear onClick={() => onSearch('')} /> }}
            />
          </AutoComplete>
        </div>
        <div className='f2e-layout-history-options'>
          {deleteOption.switcher ? (
            <>
              <Button
                onClick={() =>
                  setDeleteOption((lastOption) => ({ ...lastOption, switcher: false }))
                }
              >
                取消
              </Button>
              <Button
                disabled={deleteOption.selected.length < 1}
                type='primary'
                onClick={() => setDeleteOption((lastOption) => ({ ...lastOption, modal: true }))}
              >
                刪除
              </Button>
            </>
          ) : (
            <Button
              type='primary'
              onClick={() => {
                setDeleteOption((lastOption) => ({ ...lastOption, selected: [], switcher: true }))
                props.onSelected(null)
              }}
            >
              刪除
            </Button>
          )}
        </div>
        <div className='f2e-layout-history-table'>
          <Table
            loading={loading}
            rowKey={(record) => record.id}
            columns={getColumn()}
            dataSource={displayList}
            scroll={{ x: getColumn().reduce((a, b) => a + (b.width as number), 0) }}
            pagination={false}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  if (!deleteOption.switcher) {
                    props.onSelected(record.id)
                  }
                }
              }
            }}
            rowSelection={
              deleteOption.switcher
                ? {
                    type: 'checkbox',
                    hideSelectAll: true,
                    onChange: (selectedRowKeys) => {
                      // @ts-ignore
                      setDeleteOption({ ...deleteOption, selected: [...selectedRowKeys] })
                    }
                  }
                : undefined
            }
          />
        </div>
      </div>
      <Modal
        className='f2e-layout-message-modal'
        open={deleteOption.modal}
        closable={false}
        centered={true}
        okText='確定刪除'
        cancelText='取消'
        onOk={onDelete}
        onCancel={() =>
          setDeleteOption((lastOption) => ({
            ...lastOption,
            modal: false
          }))
        }
      >
        <p className='f2e-layout-message-modal-text'>是否確定要將文件刪除？刪除後將不可復原</p>
      </Modal>
    </>
  )
}

export default History
