import styled from "styled-components";

const EmailInput = () => {
    return (
        <LoginInput>
            <div>이메일</div>
            <input type="email" required />
        </LoginInput>
    )
};

const PasswordInput = () => {
    return (
        <LoginInput>
            <div>비밀번호</div>
            <input type="password" required />
        </LoginInput>
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
const LoginInput = styled.div`
    display: grid;
    grid-template-columns: 100px auto;
`;

const LoginContainer = styled.div`
    display: grid;
    gap: 5px;
    justify-content: center;
`;

//모달 변경되게
export const Login = () => {
    return (
        <LoginContainer>
            <div>로고</div>
            <LoginContainer>
                <EmailInput />
                <PasswordInput />
                <button>로그인</button>
            </LoginContainer>
            <div>회원가입은 여기 클릭</div>
            <OAuthButtonBlock />
        </LoginContainer>
    )
}
