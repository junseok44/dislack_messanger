import CreateServerForm from "@/components/server/CreateServerForm";
import InviteServerForm from "@/components/server/InviteServerForm";
import FullScreenCenter from "@/components/ui/FullScreenCenter";
import useModal from "@/hooks/useModal";

const OnboardingPage = () => {
  const { showModalWithoutControls } = useModal();

  const openCreateServerModal = () => {
    showModalWithoutControls({
      title: "서버 만들기",
      text: "",
      children: <CreateServerForm />,
    });
  };

  const openInviteServerModal = () => {
    showModalWithoutControls({
      title: "초대코드 입력",
      text: "",
      children: <InviteServerForm />,
    });
  };

  return (
    <FullScreenCenter>
      <div className="flex flex-col items-center bg-background-dark-subtle p-8 rounded-lg shadow-lg">
        <h1 className="mb-8 text-4xl font-semibold text-text-dark-subtle">
          환영합니다!
        </h1>
        <p className="mb-8 text-center text-text-dark-subtle-subtle">
          서버를 만들어서 친구들과 대화를 나누거나 다른 사람이 만든 서버에
          들어가서 새로운 친구들을 만나보세요!
        </p>
        <div className="flex w-full">
          <div className="flex flex-col items-center justify-center w-1/2 p-4 border-r border-background-light-muted">
            <h2 className="mb-4 text-2xl font-semibold text-text-dark-subtle">
              서버를 만드시겠어요?
            </h2>
            <button
              className="px-6 py-3 text-white bg-primary-light rounded-full hover:bg-primary-dark transition duration-300"
              onClick={openCreateServerModal}
            >
              서버 만들기
            </button>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2 p-4">
            <h2 className="mb-4 text-2xl font-semibold text-text-dark-subtle">
              다른 사람이 만든 서버에 들어가시겠어요?
            </h2>
            <button
              className="px-6 py-3 text-white bg-secondary-light rounded-full hover:bg-secondary-dark transition duration-300"
              onClick={openInviteServerModal}
            >
              서버 초대하기
            </button>
          </div>
        </div>
      </div>
    </FullScreenCenter>
  );
};

export default OnboardingPage;
