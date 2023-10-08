import { AlramModalContainer, AlramModalContentContainer } from "./style";

export const ErrorAlramModal = (props: any) => {
  const useModal = props.useModal;
  const errorMessage = props.errorMessage;

  const onCancle = () => {
    useModal.close();
  };
  const ErrorModalcontent = (props: any) => {
    const errorMessage = props.errorMessage;
    return <div>{errorMessage}</div>;
  };

  return (
    <AlramModalContainer className="modal-base">
      <AlramModalContentContainer>
        <ErrorModalcontent errorMessage={errorMessage} />
        <button onClick={onCancle}>확인</button>
      </AlramModalContentContainer>
    </AlramModalContainer>
  );
};
