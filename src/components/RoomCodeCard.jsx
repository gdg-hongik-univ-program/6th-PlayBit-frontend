import { useState } from 'react'

function RoomCodeCard({ roomCode }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 1500)
    } catch (error) {
      console.error('코드 복사 실패:', error)
    }
  }

  return (
    <section className="w-full rounded-2xl bg-white px-8 py-7 shadow-md">
      <p className="mb-3 text-center text-xs font-medium text-[#8C82A8]">
        생성된 방 코드
      </p>

      <div className="flex items-center justify-center gap-5">
        <strong className="text-4xl font-extrabold tracking-[0.28em] text-[#8800F5]">
          {roomCode}
        </strong>

        <button
          type="button"
          onClick={handleCopy}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2E7FF] text-[#8B00F5] transition hover:bg-[#E8D4FF]"
          aria-label="방 코드 복사"
        >
          {isCopied ? (
            <span className="text-lg font-bold">✓</span>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="8"
                y="8"
                width="10"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M6 15H5C3.9 15 3 14.1 3 13V5C3 3.9 3.9 3 5 3H13C14.1 3 15 3.9 15 5V6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {isCopied && (
        <p className="mt-3 text-center text-xs font-medium text-[#8B00F5]">
          코드가 복사되었습니다.
        </p>
      )}
    </section>
  )
}

export default RoomCodeCard