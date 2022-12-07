import { useState } from "react";
import { UseModal } from "../../../interface/header";
import { secure } from "../../../utils/secure";

type EditKey = 'nickName'|'password'| 'passwordCheck';

export const EditUserInfo = (props:any) => {
    const useModal: UseModal = props.useModal;
    const userData = props.userData;
    const secureWrap = secure().wrapper()
    const sendEditUserData = props.sendEditUserData
    //초기화는 평문임. 변동있으면 암호화 그때. 암호화로 통일해야함.
    const [editInput, setEditInput] = useState({ nickName: userData.nickname, password: '', passwordCheck: '' })

    const onEditInput = (key: EditKey) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditInput({ ...editInput, [key]: secureWrap.encryptWrapper(e.target.value) });
    };

    const onClose = () => {
        useModal.closeModal()
    }

    const passwordValid = () => {
        //복호화 해서 체크해야함
        if(editInput.password !== editInput.passwordCheck) {
            return false;
        }
        return true
    }
    const onEdit = () => {
        if(!passwordValid()){
            return false; //비번 안맞다 에러.
        }
        const editData = {...editInput, changeNickname:editInput.nickName}
        Reflect.deleteProperty(editData, 'passwordCheck')
        Reflect.deleteProperty(editData, 'password')
        //비밀번호에 변동있으면 비번 보내서 바꾸기
        sendEditUserData(editData)
        useModal.closeModal()

    }
    return (
        <div>
            유저정보 변경
            <div>
                <span>닉네임변경</span>
                <input type="text" placeholder="닉네임" onChange={onEditInput('nickName')} defaultValue={editInput.nickName}/>
            </div>
            <div>
                <span>비밀번호변경</span>
                <input type="text" placeholder="비밀번호변경" onChange={onEditInput('password')} defaultValue={editInput.password}/>
            </div>
            <div>
                <span>비밀번호확인</span>
                <input type="text" placeholder="비밀번호확인" onChange={onEditInput('passwordCheck')} defaultValue={editInput.passwordCheck}/>
            </div>
            <button onClick={onEdit}>확인</button>
            <button onClick={onClose}>취소</button>
        </div>
    )
}