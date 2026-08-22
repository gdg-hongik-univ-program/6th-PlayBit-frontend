function PageHeader({ title, onBack, action }) {
  return (
    <header className="flex h-16 items-center justify-between px-5 pt-2">
      <div className="w-10">
        {onBack && (
          <button type="button" onClick={onBack} aria-label="뒤로 가기" className="pixel-press flex h-9 w-9 items-center justify-center rounded-xl text-2xl font-black">
            ←
          </button>
        )}
      </div>
      <h1 className="pixel-title text-base font-black">{title}</h1>
      <div className="flex w-10 justify-end">{action}</div>
    </header>
  )
}

export default PageHeader
