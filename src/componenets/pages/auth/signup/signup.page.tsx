const EmailInput = () => {
    return (
        <div>
            <div>이메일</div>
            <input type="email" required />
        </div>
    )
};

const PasswordInput = () => {
    return (
        <div>
            <div>비밀번호</div>
            <input type="password" required />
        </div>
    )
};

const PasswordCheckInput = () => {
    return (
        <div>
            <div>비밀번호확인</div>
            <input type="password" required />
        </div>
    )
};

const SignUpButtonBlock = () => {
    return (
        <div>
            <button>수정</button>
            <button>삭제</button>
        </div>
    )
}

//모달 변경되게
export const Signup = () => {
    return (
        <div>
            <EmailInput />
            <PasswordInput />
            <PasswordCheckInput />
            <SignUpButtonBlock />
        </div>
    )
}
