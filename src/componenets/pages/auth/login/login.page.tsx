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



const OAuthButtonBlock = () => {
    return (
        <div>
            <button>구글</button>
            <button>카카오</button>
        </div>
    )
}

//모달 변경되게
export const Login = () => {
    return (
        <div>
            <div>로고</div>
            <div>
                <EmailInput />
                <PasswordInput />
                <button>로그인</button>
            </div>
            <div>회원가입은 여기 클릭</div>
            <OAuthButtonBlock />
        </div>
    )
}
