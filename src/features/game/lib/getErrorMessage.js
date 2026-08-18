export const getErrorMessage = (
  error,
  defaultMessage,
) => {
  const responseError =
    error.response?.data?.error

  if (typeof responseError === 'string') {
    return responseError
  }

  return (
    responseError?.message ??
    error.response?.data?.message ??
    error.message ??
    defaultMessage
  )
}
