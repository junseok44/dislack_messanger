import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export const useAdjustListScrollTop = ({
  targetRef,
  isFetching,
}: {
  targetRef: React.RefObject<HTMLDivElement>
  isFetching: boolean
}) => {
  const previousScrollHeight = useRef(0)
  const isFirstAdjusted = useRef(false)
  const location = useLocation()
  const adjustingValue = 24

  useEffect(() => {
    const targetElement = targetRef.current

    // 최초 adjust가 일어나지 않았다면, 아무것도 하지 않음.
    // 왜냐하면 이건 최초 이후 adjust를 위한 로직이기 때문.
    if (!targetElement || !isFirstAdjusted.current) return

    const currentScrollTop = targetElement.scrollTop
    const currentScrollHeight = targetElement.scrollHeight

    requestAnimationFrame(() => {
      const offset = currentScrollHeight - previousScrollHeight.current

      targetElement.scrollTop = currentScrollTop + offset

      previousScrollHeight.current = currentScrollHeight
    })
  }, [isFetching])

  // 최초 initialize 과정.
  // 리스트 맨 위에 완충지대가 48px. 그것의 절반만큼 scrollTop을 올려줘야함.
  // 왜? 리스트 맨 위에 완충지대가 있어야, 맨 처음에 자동으로 스크롤되는걸 막아줄 수 있음.
  useEffect(() => {
    const targetElement = targetRef.current
    if (!targetElement || isFirstAdjusted.current) return

    targetElement.scrollTop = 0

    if (!isFetching) {
      requestAnimationFrame(() => {
        targetElement.scrollTop += adjustingValue
      })

      isFirstAdjusted.current = true

      previousScrollHeight.current = targetElement.scrollHeight
    }
  }, [isFetching])

  // **route가 같은 경우에는 isFirstAdjusted가 업데이트가 안된다.
  useEffect(() => {
    return () => {
      isFirstAdjusted.current = false
      previousScrollHeight.current = 0
    }
  }, [location.pathname])

  // fetch가 일어난 다음에, scrollHeight를 업데이트 해줘야함.
  useEffect(() => {
    const targetElement = targetRef.current
    if (!targetElement) return

    // 얘는 언제? fetch가 끝난 이후에.
    if (!isFetching) previousScrollHeight.current = targetElement.scrollHeight
  }, [isFetching])

  // 그 다음 fetch가 일어날때, scrollTop은 0이 되고,
  // scrollHeight가 업데이트 된다. 그래서 그 차이만큼, scrollTop을 올려줘야함.
}
