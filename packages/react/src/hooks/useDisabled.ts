export function useDisabled(disabled?: boolean) {
  return disabled ? { disabled: true, 'aria-disabled': true as const } : { disabled: false, 'aria-disabled': undefined }
}
