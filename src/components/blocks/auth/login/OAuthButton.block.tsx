import { Img, OAuthButton, OauthButtonContainer } from "./styles";

export const OAuthButtonBlock = (props: any) => {
    const oauthGoogle = props.oauthGoogle;
    return (
        <OauthButtonContainer>
            <OAuthButton onClick={oauthGoogle}>
                <Img
                    src="Social-google.png"
                    alt="social"
                />
                <span>GOOGLE 아이디로 로그인</span>
            </OAuthButton>
        </OauthButtonContainer>
    )
};


