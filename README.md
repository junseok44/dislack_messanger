# Dislack Channel

Dislack Channel은 Discord와 Slack의 기능을 결합한 실시간 채팅 애플리케이션입니다.

## 프로젝트 구조

```
.
├── client/                    # React 기반 프론트엔드
│   ├── src/
│   │   ├── api/              # API 통신 관련
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── contexts/         # React Context
│   │   ├── hooks/            # 커스텀 훅
│   │   ├── lib/              # 외부 라이브러리 설정
│   │   ├── pages/            # 페이지 컴포넌트
│   │   ├── store/            # 상태 관리
│   │   ├── utils/            # 유틸리티 함수
│   │   └── @types/           # 타입 정의
│   └── public/               # 정적 파일
│
├── server/                    # Node.js 기반 백엔드
│   ├── src/
│   │   ├── config/           # 설정 파일
│   │   ├── controllers/      # 요청 처리 컨트롤러
│   │   ├── lib/              # 공통 라이브러리
│   │   ├── middleware/       # 미들웨어
│   │   ├── routes/           # API 라우트
│   │   ├── sockets/          # 소켓 이벤트 핸들러
│   │   ├── utils/            # 유틸리티 함수
│   │   └── @types/           # 타입 정의
│   └── prisma/               # 데이터베이스 스키마 및 마이그레이션
│
└── docker-compose.yml         # Docker 설정
```

## 기술 스택

### 프론트엔드

- React
- TypeScript
- Tailwind CSS
- Socket.io-client

### 백엔드

- Node.js
- Express
- TypeScript
- Prisma (ORM)
- Socket.io
- PostgreSQL

## 시작하기

### 필수 조건

- Docker
- Docker Compose
- Node.js (개발용)

### 설치 및 실행

1. 저장소 클론

```bash
git clone [repository-url]
cd dislack_channel
```

2. 환경 변수 설정

```bash
# server/.env 파일 생성 후 필요한 값 입력.
cp server/.env.example server/.env
```

3. Docker를 통한 실행

```bash
docker-compose up -d
```

## 주요 기능

### 클라이언트 (Frontend)

- **실시간 채팅**

  - Socket.io를 통한 실시간 메시지 송수신
  - 메시지 읽음 표시 기능
  - 이모지 지원
  - 파일 업로드 및 공유

- **채널 관리**

  - 채널 생성 및 삭제
  - 채널 목록 조회
  - 채널 참여/나가기
  - 채널 설정 관리

- **사용자 인증**

  - JWT 기반 로그인/회원가입
  - 소셜 로그인 (Google, GitHub)
  - 프로필 관리
  - 온라인/오프라인 상태 표시

- **UI/UX**
  - 반응형 디자인
  - 다크/라이트 모드
  - 키보드 단축키 지원
  - 알림 시스템

### 서버 (Backend)

- **API 서비스**

  - RESTful API 엔드포인트
  - JWT 인증 미들웨어
  - 요청 유효성 검사
  - 에러 핸들링

- **실시간 통신**

  - Socket.io 서버 구현
  - 이벤트 기반 메시지 처리
  - 연결 상태 관리
  - 실시간 알림 전송

- **데이터베이스**

  - Prisma ORM을 통한 데이터 관리
  - 관계형 데이터 모델링
  - 데이터 마이그레이션
  - 쿼리 최적화

- **보안**
  - 비밀번호 암호화
  - CORS 설정
  - 요청 제한 (Rate Limiting)
  - 보안 헤더 설정

## 라이센스

MIT
