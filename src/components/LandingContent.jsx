import { useNavigate } from 'react-router-dom'

function LandingContent() {
  const navigate = useNavigate()

  const boardMarks = [
    { type: 'x' },
    { type: 'o' },
    { type: 'x' },
    { type: 'o' },
    { type: 'x' },
    { type: '' },
    { type: 'x' },
    { type: 'x' },
    { type: 'x' },
  ]

  return (
    <section
      className="
        mx-auto
        flex
        min-h-dvh
        w-full
        max-w-[480px]
        flex-col
        items-center
        px-6
        pb-10
        pt-16
      "
    >
      {/* 로고 영역 */}
      <header className="w-full text-center">
        <div className="relative inline-flex items-center">
          <h1
            className="
              flex
              items-center
              font-black
              leading
              tracking-[-3px]
            "
            style={{ fontSize: '75px' }}
          >
            {/* Play */}
            <span
              className="
                bg-gradient-to-b
                from-[#8C28F5]
                to-[#6812D8]
                bg-clip-text
                text-transparent
              "
            >
              Play-
            </span>

            {/* Bit */}
            <span
              className="text-[#171329]"
              style={{ marginLeft: '6px' }}
            >
              Bit
            </span>
          </h1>
        </div>

        {/* 설명 문구 */}
        <p
          className="
            mt-5
            font-medium
            leading-[1.7]
            tracking-[-0.5px]
            text-[#655D7C]
          "
          style={{ fontSize: '18px' }}
        >
          작은 목표를 달성하고
          <br />
          서로 경쟁하며
          <br /> 
          좋은 습관을 만들어보세요!
        </p>
      </header>

      {/* 틱택토 그림 전체 영역 */}
      <div
        className="
          relative
          mt-3
          flex
          w-full
          max-w-[390px]
          items-center
          justify-center
        "
        style={{ height: '350px' }}
      >
        {/* 뒤쪽 타원형 장식 */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            max-w-[95%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-[50%]
            border-2
            border-x-[#DCCDF9]/50
            border-y-transparent
          "
          style={{
            width: '350px',
            height: '310px',
          }}
        />

        {/* 오른쪽 위 노란 원 */}
        <span
          className="
            absolute
            right-5
            top-6
            rounded-full
            bg-[radial-gradient(circle_at_30%_30%,#FFFBD2,#FFF08A)]
            shadow-[0_10px_24px_rgba(234,209,82,0.15)]
          "
          style={{
            width: '70px',
            height: '70px',
          }}
        />

        {/* 왼쪽 아래 초록 원 */}
        <span
          className="
            absolute
            bottom-8
            left-0
            rounded-full
            bg-[radial-gradient(circle_at_30%_30%,#E0FFEC,#AAF1C5)]
            shadow-[0_10px_24px_rgba(84,207,133,0.14)]
          "
          style={{
            width: '66px',
            height: '66px',
          }}
        />

        {/* 틱택토 보드 */}
        <div
          className="
            relative
            z-10
            rounded-[34px]
            border
            border-[#8660E0]/15
            bg-gradient-to-br
            from-white/90
            to-[#F1E9FF]/90
            p-5
            shadow-[0_22px_50px_rgba(105,63,180,0.14)]
            backdrop-blur-sm
          "
          style={{
            width: '270px',
            height: '270px',
          }}
        >
          <div
            className="
              grid
              h-full
              w-full
              grid-cols-3
              grid-rows-3
            "
          >
            {boardMarks.map((mark, index) => {
              const isRightColumn = (index + 1) % 3 === 0
              const isBottomRow = index >= 6

              return (
                <div
                  key={index}
                  className={`
                    flex
                    items-center
                    justify-center
                    ${
                      isRightColumn
                        ? ''
                        : 'border-r-[4px] border-[#9163EB]/25'
                    }
                    ${
                      isBottomRow
                        ? ''
                        : 'border-b-[4px] border-[#9163EB]/25'
                    }
                  `}
                >
                  {/* X 표시 */}
                  {mark.type === 'x' && (
                    <span
                      className="
                        -translate-y-1
                        font-sans
                        font-normal
                        leading-none
                        text-[#7131DD]
                      "
                      style={{ fontSize: '73px' }}
                    >
                      ×
                    </span>
                  )}

                  {/* O 표시 */}
                  {mark.type === 'o' && (
                    <span
                      className="
                        block
                        rounded-full
                        border-[#F97316]
                      "
                      style={{
                        width: '40px',
                        height: '40px',
                        borderWidth: '5.5px',
                      }}
                      aria-label="O"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 함께하는 사람 안내 배지 */}
      <div
        className="
          mt-1
          inline-flex
          items-center
          justify-center
          gap-2
          font-bold
          tracking-[-0.3px]
          text-[#7428E8]
        "
        style={{ fontSize: '15px' }}
      >
        <svg
          className="h-6 w-6 shrink-0"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM2.5 18.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5v.5h-11v-.5Zm10.5.5c0-1.8-.6-3.3-1.7-4.5a7 7 0 0 1 3.7-1c3 0 5.5 1.8 5.5 4.5v1H13Z"
            fill="currentColor"
          />
        </svg>

        <span>친구, 파트너, 룸메이트와 함께</span>
      </div>

      {/* 버튼 영역 */}
      <div
        className="
          mt-8
          flex
          w-full
          flex-col
          gap-5
        "
      >
        {/* 방 만들기 버튼 */}
        <button
          type="button"
          onClick={() => navigate('/rooms/create')}
          className="
            relative
            flex
            items-center
            justify-center
            gap-4
            rounded-[24px]
            bg-gradient-to-r
            from-[#6F12EF]
            to-[#8B19F3]
            px-6
            text-white
            shadow-[0_10px_20px_rgba(119,34,230,0.15)]
            transition
            duration-150
            hover:brightness-105
            active:scale-[0.985]
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-purple-300/50
          "
          style={{
            minHeight: '70px',
          }}
        >

          <span
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.5px',
            }}
          >
            방 만들기
          </span>
        </button>

        {/* 방 입장하기 버튼 */}
        <button
          type="button"
          onClick={() => navigate('/join-room')}
          className="
            relative
            flex
            items-center
            justify-center
            gap-4
            rounded-[24px]
            border
            border-[#734DA7]/10
            bg-white/90
            px-6
            text-[#171329]
            shadow-[0_10px_20px_rgba(65,42,100,0.15)]
            transition
            duration-150
            hover:bg-white
            active:scale-[0.985]
            focus-visible:outline-none
            focus-visible:ring-4
            focus-visible:ring-purple-300/50
          "
          style={{
            minHeight: '70px',
          }}
        >

          <span
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              fontSize: '24px',
              fontWeight: '700',
              letterSpacing: '-0.5px',
            }}
          >
            방 입장하기
          </span>
        </button>
      </div>
    </section>
  )
}

export default LandingContent