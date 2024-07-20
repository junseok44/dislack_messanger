import FullScreenCenter from "@/components/ui/FullScreenCenter";

const ErrorPage = ({
  errorText = "an Error Occurred",
}: {
  errorText?: string;
}) => {
  return (
    <FullScreenCenter>
      <div className="flex flex-col items-center">
        <p className="text-xl">{errorText}</p>
        <button
          className="mt-4 bg-primary-dark text-white px-4 py-2 rounded"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Go Home
        </button>
      </div>
    </FullScreenCenter>
  );
};

export default ErrorPage;
