import FullScreenCenter, {
  FullWidthCenter,
} from '@/components/ui/FullScreenCenter'

const LoadingPage = ({
  loadingText = 'Loading...',
  isRelative = false,
}: {
  loadingText?: string
  isRelative?: boolean
}) => {
  const Comp = isRelative ? FullWidthCenter : FullScreenCenter

  return (
    <Comp>
      <div className="flex flex-col items-center">
        <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
        <p className="text-xl">{loadingText}</p>
      </div>
    </Comp>
  )
}

export default LoadingPage
