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
    text: "상대가 완료한 미션을\n내가 완수하면,\n상대의 턴 제한시간을\n6시간 감소시킬 수 있어요" 
  },
  { 
    title: null, 
    image: imageImg4, 
    text: "꾸준히 즐기다 보면\n나도 모르게\n습관이 형성될 거예요!" 
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

  return (
    <div className="safe-bottom flex min-h-dvh w-full flex-col items-center bg-white px-6 pt-[clamp(64px,11dvh,110px)] text-center sm:min-h-full">
      <div className="flex min-h-16 w-full items-center justify-center">
        <h2 className={`pixel-title whitespace-pre-wrap font-black tracking-wide text-[#211A35] ${step === 3 ? 'text-[clamp(24px,7vw,30px)] leading-snug' : 'text-[clamp(28px,8vw,34px)]'}`}>
          {step === 3 ? slide.text : slide.title}
        </h2>
      </div>
      
      <div className={`flex h-[clamp(190px,31dvh,266px)] w-full max-w-[296px] shrink-0 items-center justify-center ${step === 3 ? 'mt-[clamp(48px,10dvh,100px)]' : step === 2 ? 'mt-5' : 'mt-[clamp(32px,6dvh,51px)]'}`}>
        <img src={slide.image} alt="튜토리얼 이미지" className="h-full w-full object-contain" style={{ imageRendering: 'pixelated' }} />
      </div>
      
      {step !== 3 && (
        <div className={`flex min-h-[89px] w-full items-start justify-center ${step === 2 ? 'mt-5' : 'mt-[clamp(28px,6dvh,69px)]'}`}>
          <p className="whitespace-pre-wrap break-keep text-[clamp(15px,4.8vw,19px)] font-normal leading-relaxed tracking-wide text-[#211A35]">
            {slide.text}
          </p>
        </div>
      )}
      
      <Button 
        onClick={handleNext} 
        className="mt-auto flex min-h-[43px] !w-full max-w-[249px] items-center justify-center text-sm font-black"
      >
        {step === 3 ? '시작하기' : '다음으로'}
      </Button>
    </div>
  )
}

export default TutorialSlides
