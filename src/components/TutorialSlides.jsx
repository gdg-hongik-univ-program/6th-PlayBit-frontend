import { useState } from 'react'
import PixelMascot from './PixelMascot'

const tutorialSlides = [
  { eyebrow: 'TUTORIAL 01', title: '무슨 앱이죠??', symbol: '×  ♪  ○', description: '방을 만들고, 친구와 함께 습관을 틱택토처럼 즐겨요.' },
  { eyebrow: 'TUTORIAL 02', title: '틱택토 룰은?', symbol: '× │ ○\n─ ┼ ─\n○ │ ×', description: '사진을 인증해 미션 칸을 차지하세요. 먼저 세 칸을 연결하면 승리해요!' },
  { eyebrow: 'TUTORIAL 03', title: '사보타주??', symbol: '⚡ −6H', description: '상대가 완료한 미션을 나도 완수하면, 상대 턴 제한시간을 줄일 수 있어요.' },
  { eyebrow: 'TUTORIAL 04', title: '꾸준함이 승리!', symbol: '★', description: '가볍게 시작하고 꾸준히 즐기다 보면 어느새 습관이 완성됩니다.' },
]

function TutorialSlides({ onComplete }) {
  const [step, setStep] = useState(0)
  const slide = tutorialSlides[step]
  const isLast = step === tutorialSlides.length - 1

  return (
    <div className="flex min-h-dvh flex-col px-6 pb-8 pt-12">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black tracking-[0.18em] text-[#445080]">{slide.eyebrow}</span>
        <button type="button" onClick={() => isLast ? onComplete() : setStep(step + 1)} aria-label={isLast ? '튜토리얼 완료' : '다음 설명'} className="pixel-press text-2xl font-black">→</button>
      </div>
      <h1 className="pixel-title mt-10 text-3xl font-black">{slide.title}</h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {step === 1 ? (
          <pre className="pixel-title whitespace-pre text-center text-5xl leading-[0.9]">{slide.symbol}</pre>
        ) : (
          <><div className="pixel-title text-center text-4xl font-black text-[#D8624E]">{slide.symbol}</div><PixelMascot size="md" /></>
        )}
      </div>
      <p className="min-h-16 break-keep text-sm font-bold leading-6 text-[#22283D]">{slide.description}</p>
      <div className="mt-6 flex gap-2">
        {tutorialSlides.map((item, index) => <span key={item.eyebrow} className={`h-2 flex-1 rounded-full ${index <= step ? 'bg-[#515FA8]' : 'bg-white/45'}`} />)}
      </div>
      {isLast && <button type="button" onClick={onComplete} className="pixel-button mt-6 w-full">시작하기</button>}
    </div>
  )
}

export default TutorialSlides
