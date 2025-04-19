import { Avatar as AntdAvatar, AvatarProps } from 'antd'

type Props = AvatarProps & {
    name: string;
}

const customAvatar = ({ name, style, ...rest }: Props) => {
  return (
    <AntdAvatar
        alt={'Dark Teddy'}
        size={'small'}
        style={{ 
            backgroundColor: '#87d068', 
            display: 'flex',
            alignItems: 'center',
            border: 'none'
        }}
    >
        {name}
    </AntdAvatar>
  )
}

export default customAvatar
