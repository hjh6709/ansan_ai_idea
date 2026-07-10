#!/bin/bash

# 반월산단 비자-기업 매칭 AI 플랫폼 PoC 통합 실행 스크립트

echo "=========================================================="
echo " 안산 스마트허브 비자-기업 매칭 AI 플랫폼 (PoC)"
echo "=========================================================="

# 스크립트 중단 시 모든 백그라운드 프로세스 종료 처리
cleanup() {
    echo "서버를 종료하는 중입니다..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM EXIT

# 1. 백엔드 구동 확인 및 실행
echo "1. 백엔드 (FastAPI) 가동을 시작합니다..."
if [ ! -d "venv" ]; then
    echo "가상환경(venv)을 찾을 수 없습니다. 패키지 설치 완료를 기다려주세요."
    exit 1
fi

source venv/bin/activate
python3 backend/app.py &
BACKEND_PID=$!
echo "백엔드 실행 중 (PID: $BACKEND_PID)"

# 2. 프론트엔드 구동 (Vite)
echo "2. 프론트엔드 (Vite) 의존성 설치 및 가동을 시작합니다..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "프론트엔드 npm 패키지를 설치합니다..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
echo "프론트엔드 실행 중 (PID: $FRONTEND_PID)"

# 메인 루프 대기
wait
