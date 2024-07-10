import FullScreenCenter from "@/components/FullScreenCenter";

const ErrorPage = ({
  errorText = "an Error Occurred",
}: {
  errorText?: string;
}) => {
  return (
    <FullScreenCenter>
      <div className="flex flex-col items-center">
        <p className="text-xl">{errorText}</p>
      </div>
    </FullScreenCenter>
  );
};

export default ErrorPage;
