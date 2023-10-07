import { CommonButton, CommonButtonContainer } from "../../../common/style";

export const SignUpButtonBlock = (props: any) => {
  const onClose = props.onClose;
  const onSignup = props.onSignup;
  return (
    <CommonButtonContainer>
      <CommonButton onClick={onSignup}>가입</CommonButton>
      <CommonButton onClick={onClose}>취소</CommonButton>
    </CommonButtonContainer>
  );
};
