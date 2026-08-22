import { useState } from 'react'
import titleImg1 from '../assets/tutorial-title.png'
import characterImg1 from '../assets/tutorial-character.png'
import textImg1 from '../assets/tutorial-text.png'

import titleImg2 from '../assets/tutorial-title-2.png'
import imageImg2 from '../assets/tutorial-image-2.png'
import textImg2 from '../assets/tutorial-text-2.png'

import titleImg3 from '../assets/tutorial-title-3.png'
import imageImg3 from '../assets/tutorial-image-3.png'
import textImg3 from '../assets/tutorial-text-3.png'

import imageImg4 from '../assets/tutorial-image-4.png'
import textImg4 from '../assets/tutorial-text-4.png'

import LiquidButton from './LiquidButton'

const slides = [
  { title: titleImg1, image: characterImg1, text: textImg1 },
  { title: titleImg2, image: imageImg2, text: textImg2 },
  { title: titleImg3, image: imageImg3, text: textImg3 },
  { title: null, image: imageImg4, text: textImg4 },
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
        <div className="absolute left-[44px] top-[160px] flex h-[89px] w-[305px] items-center justify-center">
          <img src={slide.text} alt="튜토리얼 설명" className="h-full w-full object-contain" />
        </div>
        
        <div className="absolute left-[48px] top-[320px] flex h-[266px] w-[296px] items-center justify-center">
          <img src={slide.image} alt="튜토리얼 이미지" className="h-full w-full object-contain" style={{ imageRendering: 'pixelated' }} />
        </div>
        
        <LiquidButton 
          onClick={handleNext} 
          className="absolute left-[72px] top-[688px] flex h-[43px] w-[249px] items-center justify-center" 
          alt="시작하기" 
        />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-white">
      <div className="absolute left-[53px] top-[137px] flex h-[70px] w-[287px] items-center justify-center">
        <img src={slide.title} alt="튜토리얼 타이틀" className="h-full w-full object-contain" />
      </div>
      
      <div className="absolute left-[38px] top-[231px] flex h-[266px] w-[296px] items-center justify-center">
        <img src={slide.image} alt="튜토리얼 이미지" className="h-full w-full object-contain" style={{ imageRendering: 'pixelated' }} />
      </div>
      
      <div className="absolute left-[58px] top-[566px] flex h-[89px] w-[305px] items-center justify-center">
        <img src={slide.text} alt="튜토리얼 설명" className="h-full w-full object-contain" />
      </div>
      
      <LiquidButton 
        onClick={handleNext} 
        className="absolute left-[72px] top-[688px] flex h-[43px] w-[249px] items-center justify-center" 
        alt="다음으로" 
      />
    </div>
  )
}

export default TutorialSlides
