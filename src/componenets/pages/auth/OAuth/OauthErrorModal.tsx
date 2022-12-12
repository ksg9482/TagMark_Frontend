import React from "react";
import { useNavigate } from "react-router-dom";
const OauthErrorModal = (props: any) => {
  const nav = useNavigate();

  const escKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      passwordFindCancle()
    }
  }

  const passwordFindCancle = () => {
    nav('/', { replace: true });
    window.removeEventListener('keydown', escKey)
  };

  window.addEventListener('keydown', escKey)

  return (
    <div className="fixed bg-slate-400 top-0 h-full w-full bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-1/3 pt-1 min-w-min max-w-sm rounded-sm">
        <div className="flex mb-5">
          <div className="w-64"></div>
        </div>
        <div className="flex flex-col mb-6 sm:pb-1">
          <div className="mb-4 px-1 sm:pb-1">
            소셜로그인에 실패했습니다.
          </div>
          <div className="mb-5 px-1">
            신속히 해결중이오니 고객님의 양해를 구합니다.
          </div>
        </div>
        <div className="flex justify-center gap-6 mb-4 px-4">
          <button
            className="border hover:bg-slate-300 w-28"
            onClick={passwordFindCancle}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default OauthErrorModal;
