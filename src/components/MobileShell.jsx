function MobileShell({ children, className = '', bgColor = 'bg-[#A9B8EE]' }) {
  return (
    <div className="min-h-dvh bg-[#171717] sm:flex sm:items-center sm:justify-center sm:p-6">
      <div className={`mobile-shell-frame relative mx-auto w-full ${bgColor} text-[#151927] sm:w-[393px] sm:rounded-[32px] sm:shadow-2xl ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default MobileShell
