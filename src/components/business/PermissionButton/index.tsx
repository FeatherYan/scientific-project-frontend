import type { PropsWithChildren } from 'react'
import { Button, Tooltip } from 'antd'
import type { ButtonProps } from 'antd'
import type { PermissionCode } from '../../../constants/permission'
import { useAuth } from '../../../hooks/useAuth'

type PermissionButtonProps = PropsWithChildren<
  ButtonProps & {
    permission: PermissionCode
    tooltip?: string
  }
>

export function PermissionButton({
  permission,
  tooltip,
  children,
  ...buttonProps
}: PermissionButtonProps) {
  const { permissions } = useAuth()

  if (!permissions.includes(permission)) {
    return null
  }

  const buttonNode = <Button {...buttonProps}>{children}</Button>

  if (buttonProps.disabled && tooltip) {
    return (
      <Tooltip title={tooltip}>
        <span>{buttonNode}</span>
      </Tooltip>
    )
  }

  return buttonNode
}
