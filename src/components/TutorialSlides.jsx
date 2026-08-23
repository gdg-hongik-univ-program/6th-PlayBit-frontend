import { useState } from 'react'
import characterImg1 from '../assets/tutorial-character.png'
import imageImg2 from '../assets/tutorial-image-2.png'
import imageImg3 from '../assets/tutorial-image-3.png'
import imageImg4 from '../assets/tutorial-image-4.png'

import Button from './Button'

const slides = [
  { 
    title: "무슨 앱이죠??", 
    image: characterImg1, 
    text: "방을 만들고, 친구와 함께\n습관 틱택토를 진행해요" 
  },
  { 
    title: "틱택토 룰은?", 
    image: imageImg2, 
    text: "미션을 완료하면 내 칸이 돼요.\n세 칸을 먼저 연결하면 승리해요!" 
  },
  { 
    title: "사보타주??", 
    image: imageImg3, 
    text: "상대가 완료한 미션을 내가 완수하면,\n상대의 턴 제한시간을 6시간 감소시킬 수 있어요" 
  },
  { 
    title: null, 
    image: imageImg4, 
    text: "꾸준히 즐기다 보면\n나도 모르게 습관이 형성될 거예요!" 
  },
]

function TutorialSlides({ onComplete }) {
  const [step, setStep] = useState(0)
  
  const handleNext = () => {
    if (step === slides.length - 1) {
      onComplete()
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const slide = slides[step]

  if (step === 3) {
    return (
      <div className="relative h-full w-full bg-white">
        <div className="absolute left-1/2 -translate-x-1/2 top-[160px] flex min-h-[89px] w-full px-6 items-center justify-center text-center">
          <h2 className="pixel-title text-[26px] font-black leading-snug text-[#211A35] whitespace-pre-wrap">
            {slide.text}
          </h2>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 top-[320px] flex h-[266px] w-[296px] items-center justify-center">
          <img src={slide.image} alt="튜토리얼 이미지" className="h-full w-full object-contain" style={{ imageRendering: 'pixelated' }} />
        </div>
        
        <Button 
          onClick={handleNext} 
          className="absolute left-1/2 -translate-x-1/2 top-[688px] flex h-[43px] !w-[249px] items-center justify-center text-sm font-black" 
        >
          시작하기
        </Button>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute left-1/2 -translate-x-1/2 top-[137px] flex h-[70px] w-full px-6 items-center justify-center text-center">
        <h2 className="pixel-title text-3xl font-black text-[#211A35] whitespace-pre-wrap">
          {slide.title}
        </h2>
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 top-[231px] flex h-[266px] w-[296px] items-center justify-center">
        <img src={slide.image} alt="튜토리얼 이미지" className="h-full w-full object-contain" style={{ imageRendering: 'pixelated' }} />
      </div>
      
      <div className="absolute left-1/2 -translate-x-1/2 top-[566px] flex min-h-[89px] w-full px-8 items-start justify-center text-center">
        <p className="text-[15px] font-black leading-relaxed text-[#211A35] whitespace-pre-wrap break-keep">
          {slide.text}
        </p>
      </div>
      
      <Button 
        onClick={handleNext} 
        className="absolute left-1/2 -translate-x-1/2 top-[688px] flex h-[43px] !w-[249px] items-center justify-center text-sm font-black" 
      >
        다음으로
      </Button>
    </div>
  )
}

export default TutorialSlides
