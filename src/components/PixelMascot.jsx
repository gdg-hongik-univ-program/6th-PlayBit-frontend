import mascot from '../assets/mascot-celebrate.png'

function PixelMascot({ size = 'md', className = '' }) {
  const sizes = { sm: 'h-28 w-28', md: 'h-44 w-44', lg: 'h-60 w-60' }

  return (
    <img
      src={mascot}
      alt="두 팔을 들고 기뻐하는 PlayBit 픽셀 캐릭터"
      className={`${sizes[size]} rounded-[28px] object-cover ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}

export default PixelMascot
