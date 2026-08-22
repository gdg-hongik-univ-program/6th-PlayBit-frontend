import liquidBtnImg from '../assets/button-liquid.png'

function LiquidButton({ onClick, className = '', alt = '버튼' }) {
  return (
    <button type="button" onClick={onClick} className={`hover:opacity-90 transition-opacity ${className}`}>
      <img src={liquidBtnImg} alt={alt} className="h-full w-full object-contain" />
    </button>
  )
}

export default LiquidButton
