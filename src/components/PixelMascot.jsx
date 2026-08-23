import mascot from '../assets/mascot.png'

function PixelMascot({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-28 w-28', md: 'h-44 w-44', lg: 'h-60 w-60', custom: '' }

  return (
    <img
      src={mascot}
      alt="PlayBit 픽셀 캐릭터"
      className={`${sizes[size]} object-contain ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

export default PixelMascot
