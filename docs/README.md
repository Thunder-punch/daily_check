# 출근/퇴근 기록 및 관리자 출석 관리 시스템

## 프로젝트 개요
기업용 출근/퇴근 기록 및 관리자 출석 관리 시스템입니다. 일반 사용자는 웹에서 출근/퇴근 버튼을 눌러 자신의 출퇴근 기록을 남기고, 관리자는 전체 출석 데이터를 조회 및 엑셀로 다운로드할 수 있습니다.

## 주요 사용자 및 역할
- **일반 사용자**: 본인 출근/퇴근 기록 입력 및 조회
- **관리자**: 전체 출석 데이터 조회, 엑셀 다운로드

## 주요 기능
### 일반 사용자
- 출근 버튼 클릭 → 출근 시간 기록
- 퇴근 버튼 클릭 → 퇴근 시간 기록
- 본인 출퇴근 내역 조회

### 관리자
- 전체 출석 데이터 조회(날짜별, 사용자별 등)
- 엑셀 다운로드

## 실제 개발 및 연동 절차 (실행/테스트 경험 기반)

### 1. 개발 환경 준비 및 실행
- **백엔드(NestJS)**: 4000번 포트에서 실행
  ```bash
  cd backend_nestjs
  npm install
  npm run start:dev
  ```
- **프론트엔드(Next.js)**: 3000번 포트에서 실행
  ```bash
  cd frontend_nextjs
  npm install
  npm run dev
  ```
- **프론트엔드 환경변수 설정**: `frontend_nextjs/.env.local` 파일에 아래 내용 추가
  ```
  NEXT_PUBLIC_API_BASE=http://localhost:4000
  ```
- **DB(PostgreSQL, Docker)**:
  ```bash
  docker run --name daily-check-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=daily_check -p 5432:5432 -d postgres
  ```

### 2. Prisma 마이그레이션 및 DB 테이블 생성
- `.env` 파일의 DB 연결 정보와 도커 컨테이너 정보가 일치해야 함
- 마이그레이션 적용:
  ```bash
  cd backend_nestjs
  npx prisma migrate dev --name init
  ```
- 테이블 생성 확인:
  ```bash
  docker exec -it daily-check-db psql -U postgres -d daily_check
  \dt
  ```

### 3. 예시 데이터 삽입 및 확인
- 회사, 사용자, 출근/퇴근 기록 예시 데이터 삽입:
  ```sql
  INSERT INTO "Company" (name, "createdAt", "updatedAt") VALUES ('AI회사', NOW(), NOW());
  INSERT INTO "User" (name, "companyId", "createdAt", "updatedAt") VALUES ('홍길동', 1, NOW(), NOW());
  INSERT INTO "Record" ("userId", "checkIn", "createdAt", "updatedAt") VALUES (1, NOW(), NOW(), NOW());
  UPDATE "Record" SET "checkOut" = NOW() WHERE id = 1; -- 퇴근 기록 예시
  SELECT * FROM "Record";
  ```
- 실제로 프론트엔드에서 출근/퇴근 버튼을 누르면, 해당 정보가 DB에 반영되는지 위 쿼리로 확인

### 4. 프론트엔드-백엔드 연동 및 CORS 문제 해결
- 프론트엔드에서 API 요청 시 CORS 에러 발생 시, `backend_nestjs/src/main.ts`에 아래 코드 추가:
  ```typescript
  app.enableCors();
  ```
- 프론트엔드에서 출근/퇴근 시도 시, 백엔드 터미널에 POST/GET 로그가 찍히는지 확인
- 브라우저 개발자도구 네트워크 탭에서 실제 요청이 4000번 포트로 가는지 확인

### 5. 정상 동작 확인
- 출근/퇴근 버튼 클릭 시, "출근이 기록되었습니다!", "퇴근이 기록되었습니다!" 등 메시지 확인
- 이미 출근 기록이 있으면 "이미 출근 기록이 있습니다." 메시지 확인
- DB에서 checkIn, checkOut 값이 정상적으로 저장되는지 확인

## 데이터 흐름
1. 일반 사용자가 웹에서 출근/퇴근 버튼 클릭
2. 프론트엔드 → 백엔드 → DB에 출근/퇴근 시간 저장
3. 관리자는 웹에서 출석 데이터 조회/다운로드
4. 프론트엔드 → 백엔드 → DB에서 데이터 조회 및 엑셀 변환

## 전체 시스템 구조(아키텍처)

```
[ 사용자 브라우저 ]
      ↓
[ Vercel - Next.js 프론트엔드 ]
      ↓
[ Render - NestJS 백엔드 ]
      ↓
[ Redis (메시지 큐, BullMQ) ]
      ↓
[ 워커 프로세스 (백엔드에 내장 or 별도 실행) ]
      ↓
[ PostgreSQL (도커, 자체 서버) ]
```

## 기술 스택
- 프론트엔드: Vercel (Next.js)
- 백엔드: Render (NestJS)
- 데이터베이스: PostgreSQL (Docker, 자체 서버)
- 메시지 큐: Redis (BullMQ)
- 배포: 프론트는 Vercel, 백엔드는 Render 사용 예정

## 인증 방식
- 카카오 인증 + JWT

## 데이터 흐름도

```mermaid
graph TD
    A[Frontend] -->|HTTP Request| B[Backend API]
    B -->|메시지 큐잉| C[RabbitMQ]
    C -->|비동기 처리| D[PostgreSQL]
    D -->|데이터 조회| B
    B -->|HTTP Response| A

    subgraph Frontend
        A1[Next.js App] -->|UI| A2[ShadCN]
        A2 -->|스타일링| A3[TailwindCSS]
    end

    subgraph Backend
        B1[NestJS Server] -->|ORM| B2[Prisma]
        B1 -->|메시지 큐| B3[RabbitMQ Client]
    end

    subgraph Database
        D1[PostgreSQL] -->|Docker| D2[Container]
    end
```

## 주요 기능별 데이터 흐름

### 1. 출퇴근 기록
```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant Q as RabbitMQ
    participant DB as PostgreSQL

    F->>B: 출퇴근 요청
    B->>Q: 메시지 큐잉
    Q-->>B: 큐잉 완료
    B-->>F: 즉시 응답
    Q->>DB: 비동기 저장
    DB-->>Q: 저장 완료
```

### 2. 데이터 조회
```mermaid
sequenceDiagram
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL

    F->>B: 데이터 조회 요청
    B->>DB: 쿼리 실행
    DB-->>B: 데이터 반환
    B-->>F: 응답 전송
```

## 시스템 안정성 및 부하 관리 전략

| 문제 상황                        | 해결 방안(적용 기술)         | 설명/비고                        |
|----------------------------------|-----------------------------|----------------------------------|
| 너무 많은 요청이 한꺼번에 들어옴   | ✅ 메시지 큐로 줄 세움         | 백엔드-DB 사이에서 부하 분산      |
| 요청을 너무 자주 보내는 사용자     | ✅ Throttling(쓰로틀링)으로 제한 | 프론트/백엔드에서 요청 빈도 제한  |
| DB 응답이 느림                   | ✅ 캐시(예: Redis)로 빠르게 응답 | 자주 조회되는 데이터 캐싱         |
| 사용자에게 빠르게 반응            | ✅ 비동기 처리                 | 큐잉, Promise, async/await 등     |
| 인증 유지                        | ✅ JWT로 인증 관리             | 토큰 기반 인증, 세션 불필요       |

- 각 전략은 실제 트래픽 집중 시간대(출근/퇴근)에도 시스템이 안정적으로 동작하도록 설계되었습니다.
- 메시지 큐는 DB 부하를 분산하고, Throttling과 캐시는 서버와 DB 모두의 안정성을 높입니다.
- JWT 인증으로 사용자 인증 상태를 효율적으로 관리할 수 있습니다.

> 출퇴근 앱 개발 이후, 백엔드에서 Sentry, Prometheus, Grafana 등 외부 모니터링 도구와 연동하여 시스템 부하 및 장애 상황을 실시간으로 모니터링할 예정입니다.

## API 엔드포인트

### 출퇴근 관련
- POST `/attendance/check-in`: 출근 기록
- POST `/attendance/check-out`: 퇴근 기록
- GET `/attendance/my-records`: 개인 출퇴근 기록 조회
- GET `/attendance/admin/records`: 관리자용 전체 출퇴근 기록 조회

### 관리자 기능
- GET `/admin/export`: 엑셀 다운로드
- GET `/admin/old-records`: 오래된 데이터 조회
- POST `/admin/backup`: 수동 백업 생성
- DELETE `/admin/old-records`: 오래된 데이터 삭제

## 개발 환경 설정

### 프론트엔드 (Next.js)
```bash
cd frontend_nextjs
npm install
npm run dev
```

### 백엔드 (NestJS)
```bash
cd backend_nestjs
npm install
npm run start:dev
```

## 폴더 구조

- /backend_nestjs : NestJS 기반 백엔드 서버
- /frontend_nextjs : Next.js 기반 프론트엔드
- /docs : 프로젝트 문서
- /prisma : DB 스키마 및 마이그레이션
- /scripts : 데이터 생성/관리 스크립트
