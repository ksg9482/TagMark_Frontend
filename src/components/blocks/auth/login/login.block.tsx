import { useState } from "react";
import { LoginData } from "../../../../interface/auth";
import { secure } from "../../../../utils/secure";
import { ErrorMessageBlock, LoginContainer } from "./styles";
import {
  CommonButton,
  CommonButtonContainer,
  CommonInput,
} from "../../../common/style";

export const LoginBlock = (props: any) => {
  const onClose = props.onClose;
  const errorMessage = props.errorMessage;
  const updateErrorMessage = props.updateErrorMessage;
  const secureWrap = secure().wrapper();
  const sendLoginData = props.sendLoginData;
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const onLoginInput =
    (key: string) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      if (e.target.value.length <= 0) {
        setLoginInput({ ...loginInput, [key]: "" });
        return;
      }
      setLoginInput({
        ...loginInput,
        [key]: secureWrap.encryptWrapper(e.target.value),
      });
    };

  const inputCheck = (loginInput: any) => {
    const { email, password } = loginInput;

    if (email.length <= 0) {
      updateErrorMessage("이메일을 입력해주세요");
      return false;
    }
    if (password.length <= 0) {
      updateErrorMessage("비밀번호를 입력해주세요");
      return false;
    }
    return true;
  };
  const onLogin = () => {
    if (!inputCheck(loginInput)) {
      return;
    }
    let loginData: LoginData = {
      email: "",
      password: "",
    };
    loginData.email = secureWrap.decryptWrapper(loginInput.email);
    loginData.password = secureWrap.decryptWrapper(loginInput.password);
    sendLoginData(loginData);
  };

  return (
    <LoginContainer>
      <CommonInput>
        <div id="input-name">이메일</div>
        <input type="email" onChange={onLoginInput("email")} />
      </CommonInput>
      <CommonInput>
        <div id="input-name">비밀번호</div>
        <input type="password" onChange={onLoginInput("password")} />
      </CommonInput>
      {errorMessage ? (
        <ErrorMessageBlock>{errorMessage}</ErrorMessageBlock>
      ) : (
        <ErrorMessageBlock>&nbsp;</ErrorMessageBlock>
      )}
      <CommonButtonContainer>
        <CommonButton onClick={onLogin}>로그인</CommonButton>
        <CommonButton onClick={onClose}>취소</CommonButton>
      </CommonButtonContainer>
    </LoginContainer>
  );
};
