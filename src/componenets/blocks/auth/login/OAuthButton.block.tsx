import { CommonButtonContainer } from "./styles";

export const OAuthButtonBlock = (props:any) => {
    const oauthGoogle = props.oauthGoogle
    const oauthKakao = props.oauthKakao
    return (
        <CommonButtonContainer>
            <button onClick={oauthGoogle}>구글</button>
            <button onClick={oauthKakao}>카카오</button>
        </CommonButtonContainer>
    )
};