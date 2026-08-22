function MobileShell({ children, className = '' }) {
  return (
    <div className="min-h-dvh bg-[#171717] sm:py-6">
      <div className={`relative mx-auto min-h-dvh w-full overflow-hidden bg-[#A9B8EE] text-[#151927] sm:min-h-[calc(100dvh-3rem)] sm:max-w-[430px] sm:rounded-[32px] sm:shadow-2xl ${className}`}>
        {children}
      </div>
    </div>
  )
}

export default MobileShell
