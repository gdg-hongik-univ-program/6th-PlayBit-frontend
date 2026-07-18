import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useGameStore from '../stores/gameStore'

function JoinRoomPage() {
  const navigate = useNavigate()

  const [entryCode, setEntryCode] = useState('')
  const [validationError, setValidationError] = useState('')

  const enterRoom = useGameStore((state) => state.enterRoom)
  const isLoading = useGameStore((state) => state.isLoading)
  const storeError = useGameStore((state) => state.error)
  const clearError = useGameStore((state) => state.clearError)

  const handleCodeChange = (event) => {
    const inputValue = event.target.value

    const formattedCode = inputValue
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6)

    setEntryCode(formattedCode)
    setValidationError('')
    clearError()
  }

  const handleJoinRoom = async (event) => {
    event.preventDefault()

    if (entryCode.length !== 6) {
      setValidationError('6자리 방 코드를 입력해주세요.')
      return
    }

    try {
      const joinedRoom = await enterRoom(entryCode)

      navigate(`/rooms/${joinedRoom.entryCode}/game`)
    } catch (error) {
      console.error('방 입장 실패:', error)
    }
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  const isButtonDisabled = entryCode.length !== 6 || isLoading

  return (
    <div className="min-h-screen bg-[#F8F6FF]">
      <header className="relative flex h-12 items-center border-b border-[#EEEAF8] bg-white px-8">
        <button
          type="button"
          onClick={handleLogoClick}
          className="cursor-pointer text-base font-extrabold text-[#8C00FF]"
        >
          PlayBit
        </button>

        <p className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-[#8A7AA8]">
          방 참여하기
        </p>
      </header>

      <main className="flex justify-center px-5 pt-[92px]">
        <section className="w-full max-w-[420px] text-center">
          <h1 className="text-[17px] font-bold text-[#2F2342]">
            방 코드를 입력하세요
          </h1>

          <p className="mt-2 text-xs font-medium text-[#9483B3]">
            상대방에게 받은 6자리 코드를 입력하면 게임에 참여할 수
            있습니다
          </p>

          <form
            onSubmit={handleJoinRoom}
            className="mt-6 rounded-2xl bg-white px-7 py-7 text-left shadow-[0_5px_12px_rgba(77,50,111,0.14)]"
          >
            <label
              htmlFor="entryCode"
              className="mb-2 block text-[11px] font-semibold text-[#4C405D]"
            >
              방 코드
            </label>

            <input
              id="entryCode"
              name="entryCode"
              type="text"
              value={entryCode}
              onChange={handleCodeChange}
              placeholder="000000"
              maxLength={6}
              autoComplete="off"
              aria-describedby="entryCodeError"
              className="
                h-[57px]
                w-full
                rounded-xl
                border-2
                border-transparent
                bg-[#F0E9FF]
                px-4
                text-center
                text-xl
                font-bold
                tracking-[0.45em]
                text-[#5E3F8D]
                caret-[#9900FF]
                outline-none
                placeholder:text-[#D5CBE8]
                focus:border-[#A100FF]
              "
            />

            {(validationError || storeError) && (
              <p
                id="entryCodeError"
                className="mt-2 text-xs font-medium text-red-500"
              >
                {validationError || storeError}
              </p>
            )}

            <button
              type="submit"
              disabled={isButtonDisabled}
              className="
                mt-3
                h-10
                w-full
                rounded-[10px]
                bg-[#9D00FF]
                text-sm
                font-bold
                text-white
                shadow-[0_6px_12px_rgba(157,0,255,0.28)]
                transition
                hover:bg-[#8900DF]
                disabled:cursor-not-allowed
                disabled:bg-[#D7C8E8]
                disabled:shadow-none
              "
            >
              {isLoading ? '참여 중...' : '참여하기'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default JoinRoomPage