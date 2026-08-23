function Button({ children, onClick, disabled, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[#00D0B3] px-4 py-3 text-lg font-black text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 pixel-title ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
