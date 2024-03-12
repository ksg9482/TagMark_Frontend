# TAG-MARK

## 기획

인터넷을 검색하다가 내용을 탭으로 열어서 보다 보면 탭이 어느샌가 수십개가 넘어가곤 합니다. 그래서 탭을 좀 정리하려고 북마크를 써도 북마크는 북마크대로 어지럽고 탭은 탭대로 가득 차는 결말을 맞습니다.

차라리 폴더 단위로 구분하는 것이 아니라 북마크에 태크를 지정하고 태그 기반으로 북마크를 관리할 수 있는 어플리케이션을 구상하게 되었고, 태그를 기반으로 북마크를 분류하기 때문에 TAG-MARK라는 이름을 붙였습니다.

## TAG-MARK 상세

TAG-MARK는 태그를 기반으로 북마크를 '구분'하는데 초점을 맞추었습니다. 구분한 태그를 기준으로 AND/OR 검색을 통해 원하는 태그가 부여된 북마크만 나열할 수 있습니다.

### TAG-MARK 기술 스택

- Client: HTML, CSS, TypeScript, React, Redux
- Design: Styled-Component

## TAG-MARK 개발환경

- Ubuntu - 20.04
- node - 16.13.0
- npm - 8.1.0

## TAG-MARK 명령어

- 종속성 설치: npm install
- 종속성 설치중 ERESOLVE에러 발생시:
  npm install --legacy-peer-deps
  npm audit fix --legacy-peer-deps
- 실행: npm run start
