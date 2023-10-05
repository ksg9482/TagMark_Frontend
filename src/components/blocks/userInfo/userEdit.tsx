import { useState } from "react";
import { useSelector } from "react-redux";
import { UseModal } from "../../../interface/header";
import { RootState } from "../../../store";
import { secure } from "../../../utils/secure";
import { CommonButton, CommonButtonContainer, CommonInput, ContentBody, ContentTop, ErrorMessageBlock, InputContainer, ModalTitle, UserEditContainer } from "./style";

type EditKey = 'nickName' | 'password' | 'passwordCheck';

export const EditUserInfo = (props: any) => {
    const useModal: UseModal = props.useModal;
    const propsErrorMessage = props.errorMessage;
    // const userData = props.userData;
    const userData = useSelector((state: RootState) => {
        return {
            email:state.user.email,
            nickname:state.user.nickname,
            type:state.user.type,
            bookmarkCount:state.user.bookmarkCount,
            tagCount:state.user.tagCount,
        };
    });
    const secureWrap = secure().wrapper()
    const sendEditUserData = props.sendEditUserData
    const [editInput, setEditInput] = useState({ nickName: secureWrap.encryptWrapper(userData.nickname), password: '', passwordCheck: '' })
    const [errorMessage, setErrorMessage] = useState(propsErrorMessage)

    const onEditInput = (key: EditKey) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {

        if (e.target.value.length <= 0) {
            setEditInput({ ...editInput, [key]: '' });
        }
        else {
            setEditInput({ ...editInput, [key]: secureWrap.encryptWrapper(e.target.value) });
        }
    };

    const onClose = () => {
        useModal.closeModal()
    }

    const passwordValid = () => {
        if (editInput.password !== editInput.passwordCheck) {
            return false;
        }
        return true
    }
    const onEdit = () => {
        if (!passwordValid()) {
            updateErrorMessage('비밀번호와 확인이 맞지 않습니다.')
            return false;
        }
        let editData: any = {}
        if (editInput.nickName.length > 0) {
            editData.nickname = secureWrap.decryptWrapper(editInput.nickName)
        }
        if (editInput.password.length > 0) {
            editData.password = secureWrap.decryptWrapper(editInput.password)
        }
        Reflect.deleteProperty(editData, 'passwordCheck')
        sendEditUserData(editData)
        useModal.closeModal()

    };
    const updateErrorMessage = (message: string) => {
        setErrorMessage(message);
    };

    return (
        <UserEditContainer>
            <ContentTop>
                <div id="title">User Edit</div>
                <CommonButton id="exit" onClick={onClose}>X</CommonButton>
            </ContentTop>
            <ContentBody>
                <ModalTitle>
                    유저정보 변경
                </ModalTitle>
                {
                    userData.type === 'BASIC'
                        ? <InputContainer>
                            <CommonInput>
                                <div>닉네임변경</div>
                                <input type="text" placeholder="닉네임" onChange={onEditInput('nickName')} defaultValue={secureWrap.decryptWrapper(editInput.nickName)} />
                            </CommonInput>
                            <CommonInput>
                                <div>비밀번호변경</div>
                                <input type="password" placeholder="비밀번호변경" onChange={onEditInput('password')} defaultValue={editInput.password} />
                            </CommonInput>
                            <CommonInput>
                                <div>비밀번호확인</div>
                                <input type="password" placeholder="비밀번호확인" onChange={onEditInput('passwordCheck')} defaultValue={editInput.passwordCheck} />
                            </CommonInput>
                        </InputContainer>
                        : <InputContainer>
                            <CommonInput>
                                <div>닉네임변경</div>
                                <input type="text" placeholder="닉네임" onChange={onEditInput('nickName')} defaultValue={secureWrap.decryptWrapper(editInput.nickName)} />
                            </CommonInput>
                        </InputContainer>
                }
                {errorMessage ? <ErrorMessageBlock>{errorMessage}</ErrorMessageBlock> : <ErrorMessageBlock>&nbsp;</ErrorMessageBlock>}
                <CommonButtonContainer>
                    <button onClick={onEdit}>확인</button>
                    <button onClick={onClose}>취소</button>
                </CommonButtonContainer>
            </ContentBody>
        </UserEditContainer>
    )
}
