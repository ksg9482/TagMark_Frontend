import { UseModal } from "../../../interface/header";
import { secure } from "../../../utils/secure";

export const DeleteUser = (props:any) => {
    const useModal: UseModal = props.useModal;
    const secureWrap = secure().wrapper()
    const sendDelete = props.sendDelete
    //const [loginInput, setLoginInput] = useState({ email: '', password: '' })

    // const onLoginInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    //     setLoginInput({ ...loginInput, [key]: secureWrap.encryptWrapper(e.target.value) });
    // };

    const onClose = () => {
        useModal.closeModal()
    }

    const onDelete = () => {
        //sendDelete()
        useModal.closeModal()

    }
    return (
        <div>
            회원 탈퇴
            <div>아이디를 삭제하시려면 비밀번호를 입력해주세요.</div>
            <div>소셜로그인의 경우 비밀번호 확인 과정 없이 회원탈퇴가 진행됩니다.</div>
            <input type="password" placeholder="비밀번호"/>
            <button onClick={onDelete}>확인</button>
            <button onClick={onClose}>취소</button>
        </div>
    )
}