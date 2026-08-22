function MobileShell({ children, className = '', bgColor = 'bg-[#A9B8EE]' }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#171717] sm:py-6">
      <div className={`relative mx-auto min-h-dvh w-full overflow-hidden ${bgColor} text-[#151927] sm:h-[852px] sm:min-h-0 sm:w-[393px] sm:rounded-[32px] sm:shadow-2xl transform-gpu ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default MobileShell
