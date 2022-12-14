import { useState } from "react";
import styled from "styled-components";
import { UseModal } from "../../../interface/header";
import { secure } from "../../../utils/secure";

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
            <ModalTitle>
                회원 탈퇴
            </ModalTitle>
            <ModalText>
                <div>아이디를 삭제하시려면</div>
                <div>비밀번호를 입력해주세요.</div>
            </ModalText>
            <ModalText>
                <div>소셜로그인의 경우 비밀번호 확인 </div>
                <div> 과정 없이 회원탈퇴가 진행됩니다.</div>
            </ModalText>
            <CommonInput>
                <div>비밀번호</div>
                <input type="password" onChange={onDeleteInput} placeholder="비밀번호" />
            </CommonInput>
            <CommonButtonContainer>
                <button onClick={onDelete}>확인</button>
                <button onClick={onClose}>취소</button>
            </CommonButtonContainer>
        </UserDeleteContainer>
    )
}
export const ModalTitle = styled.div`
    margin-bottom: 15px;
    font-size: large;
`;
export const ModalText = styled.div`

`;
export const UserDeleteContainer = styled.div`
    display: grid;
    gap: 10px;
`;
export const CommonInput = styled.div`
    display: grid;
    grid-template-columns: 100px auto;
    gap:5px;
`;
export const CommonButtonContainer = styled.div`
    display: grid;
    gap: 5px;
    margin-top: 15px;
`;