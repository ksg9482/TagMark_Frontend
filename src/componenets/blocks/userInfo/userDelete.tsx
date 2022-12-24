import { useState } from "react";
import { UseModal } from "../../../interface/header";
import { secure } from "../../../utils/secure";
import { CommonButton, CommonButtonContainer, CommonInput, ContentBody, ContentTop, InputContainer, ModalText, ModalTitle, TextContainer, UserDeleteContainer } from "./style";

export const DeleteUser = (props: any) => {
    const useModal: UseModal = props.useModal;
    const secureWrap = secure().wrapper();
    const sendDeleteUser = props.sendDeleteUser;

    const [password, setPassword] = useState('');

    const onDeleteInput = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setPassword(secureWrap.encryptWrapper(e.target.value));
    };


    const onClose = () => {
        useModal.closeModal()
    }

    const onDelete = () => {
        sendDeleteUser(password)
        useModal.closeModal()

    }
    return (
        <UserDeleteContainer>
            <ContentTop>
                <div id="title">User Delete</div>
                <CommonButton id="exit" onClick={onClose}>X</CommonButton>
            </ContentTop>
            <ContentBody>
                <ModalTitle>
                    회원 탈퇴
                </ModalTitle>
                <TextContainer>
                    <ModalText>
                        아이디를 삭제하시려면 비밀번호를 입력해주세요.
                    </ModalText>
                    <ModalText>
                        소셜로그인의 경우 비밀번호 확인과정 없이 회원탈퇴가 진행됩니다.
                    </ModalText>
                </TextContainer>
                <CommonInput>
                    <div>비밀번호</div>
                    <input type="password" onChange={onDeleteInput} placeholder="비밀번호" />
                </CommonInput>
                <CommonButtonContainer>
                    <button onClick={onDelete}>확인</button>
                    <button onClick={onClose}>취소</button>
                </CommonButtonContainer>
            </ContentBody>
        </UserDeleteContainer>
    )
}
