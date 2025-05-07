import { useEffect, useState } from 'react'
import { Modal, notification } from 'antd'
import { Props } from './types'


export const ModalIncapacidad = ({ open, setOpen, soportes }: Props) => {

  const [notificationApi, contextHolder] = notification.useNotification()
  const [dataSource, setDataSource] = useState<string[]>([])


  useEffect(() => {
    setDataSource(soportes);
  }, [soportes]) 

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        title={"Modal Incapacidades"}
        key={`modal-soportes`}
        footer={[]}
        style={{ top: 10 }}
      ></Modal>
    </>
  )
}