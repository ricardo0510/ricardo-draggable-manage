import React, { useState } from 'react'
import { Upload, message } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import type { UploadChangeParam, UploadFile } from 'antd/es/upload'
import './index.scss'

interface ImageUploaderProps {
  value?: string
  onChange?: (url: string) => void
  maxSize?: number // MB
  accept?: string[]
  placeholder?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  maxSize = 2,
  accept = ['image/jpeg', 'image/png', 'image/svg+xml'],
  placeholder = '上传图标'
}) => {
  const [loading, setLoading] = useState(false)

  // 处理图片上传前的验证
  const beforeUpload = (file: File) => {
    const isAcceptedType = accept.includes(file.type)
    if (!isAcceptedType) {
      const acceptedFormats = accept.map((type) => type.split('/')[1].toUpperCase()).join('/')
      message.error(`只能上传 ${acceptedFormats} 格式的图片!`)
      return false
    }
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize
    if (!isLtMaxSize) {
      message.error(`图片大小不能超过 ${maxSize}MB!`)
      return false
    }
    return true
  }

  // 将图片转换为base64
  const getBase64 = (img: File, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  // 处理上传变化
  const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done' || info.file.originFileObj) {
      getBase64(info.file.originFileObj as File, (url) => {
        setLoading(false)
        onChange?.(url)
      })
    }
  }

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="image-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleUploadChange}
      customRequest={({ onSuccess }) => {
        // 自定义上传,直接返回成功
        setTimeout(() => {
          onSuccess?.('ok')
        }, 0)
      }}
    >
      {value ? (
        <img src={value} alt="icon" style={{ width: '100%' }} />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>{placeholder}</div>
        </div>
      )}
    </Upload>
  )
}

export default ImageUploader
