import arrowIcon from '../assets/arrow-icon.png'

function PageHeader({ title, onBack, action }) {
  return (
    <header className="safe-header grid grid-cols-[36px_minmax(0,1fr)_36px] items-center gap-3 px-5">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="뒤로 가기" className="flex h-9 w-9 items-center justify-center hover:opacity-80 transition-opacity">
          <img src={arrowIcon} alt="뒤로 가기" className="h-full w-full object-contain" />
        </button>
      ) : (
        <div className="h-9 w-9" />
      )}
      
      <h1 className="pixel-title truncate text-center text-xl font-black min-[380px]:text-2xl">{title}</h1>
      
      {action ? (
        <div className="flex items-center justify-center">{action}</div>
      ) : (
        <div className="h-9 w-9" />
      )}
    </header>
  )
}

export default PageHeader
