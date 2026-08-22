import arrowIcon from '../assets/arrow-icon.png'

function PageHeader({ title, onBack, action }) {
  return (
    <header className="flex h-[112px] items-center justify-between px-5 pt-[56px]">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="뒤로 가기" className="flex h-9 w-9 items-center justify-center hover:opacity-80 transition-opacity">
          <img src={arrowIcon} alt="뒤로 가기" className="h-full w-full object-contain" />
        </button>
      ) : (
        <div className="h-9 w-9" />
      )}
      
      <h1 className="pixel-title text-2xl font-black text-center">{title}</h1>
      
      {action ? (
        <div className="flex items-center justify-center">{action}</div>
      ) : (
        <div className="h-9 w-9" />
      )}
    </header>
  )
}

export default PageHeader
