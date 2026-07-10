# -*- coding: utf-8 -*-

# 경기도 안산시 지식산업센터 현황 OpenAPI 데이터가 없거나 호출 실패 시 
# 기술 검증(PoC) 및 시각화 데모를 위해 작동하는 안산 스마트허브 실제 기반 Mock 데이터셋입니다.
# 공모전 시나리오를 위해 각 기업의 규모, 고용허가제 여부 등의 비자 룰셋용 메타데이터가 추가되었습니다.

MOCK_COMPANIES = [
    {
        "BZPLC_NM": "(주)대원정밀",
        "INDUTY_CD": "C29111",  # 금형 및 주조기 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 산단로 123",
        "PRDCT_DESC": "자동차 엔진용 정밀 금형 부품 가공, 머시닝센터(MCT) 및 CNC 밀링 기계 조작, 정밀 부품 설계 및 금형 조립",
        "SIGUN_NM": "안산시",
        # 비자 필터용 추가 데이터
        "COMPANY_SCALE": "중소기업",  # 중소기업 여부 (H-2 비자용)
        "E9_FOREIGN_LICENSE": True,  # E-9 고용허가증 보유 여부
        "EMPLOYEE_COUNT": 45
    },
    {
        "BZPLC_NM": "안산케미칼(주)",
        "INDUTY_CD": "C20499",  # 기타 화학제품 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 신원로 45",
        "PRDCT_DESC": "반도체 세정용 고순도 화학 물질 배합, 석유화학 원료 혼합 및 실험 분석, 화학 반응기 조작 및 모니터링",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": False,  # E-9 고용허가증 없음 (E-9 스크리닝 대상)
        "EMPLOYEE_COUNT": 28
    },
    {
        "BZPLC_NM": "신라물류포장",
        "INDUTY_CD": "C38210",  # 금속 포장용기 제조업 (실질적 작업은 단순 박스 포장 및 물류 적재)
        "REFINE_ROADNM_ADDR": "경기도 안산시 상록구 사동 78",
        "PRDCT_DESC": "완제품 상자 수작업 박스 포장, 테이핑 작업, 제품 적재 및 창고 단순 분류, 파레트 래핑 (단순노무 작업)",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "소기업",
        "E9_FOREIGN_LICENSE": True,
        "EMPLOYEE_COUNT": 12
    },
    {
        "BZPLC_NM": "한성오토모티브(주)",
        "INDUTY_CD": "C30391",  # 자동차 차체 및 트레일러 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 성곡로 210",
        "PRDCT_DESC": "자동차 프레스 부품 로봇 용접 보조, 스폿 용접기 조작, 자동차 현가장치 프레스 프레임 조립 및 품질 검사",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": True,
        "EMPLOYEE_COUNT": 115
    },
    {
        "BZPLC_NM": "글로벌피앤씨",
        "INDUTY_CD": "C22299",  # 기타 플라스틱 제품 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 번영로 89",
        "PRDCT_DESC": "플라스틱 사출 성형기 조작, 사출물 게이트 커팅, 외관 수작업 사포질 및 검사, 단순 포장",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": True,
        "EMPLOYEE_COUNT": 35
    },
    {
        "BZPLC_NM": "(주)에이치디일렉트릭 (가칭 대기업)",
        "INDUTY_CD": "C28111",  # 발전기 및 전동기 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 산업단지로 300",
        "PRDCT_DESC": "초고압 변압기 코일 권선기 조작, 중전기기 제어반 전기 배선 작업, 송배전 설비 시스템 테스트",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "대기업",  # 대기업 (H-2 비자 제한 대상)
        "E9_FOREIGN_LICENSE": False,
        "EMPLOYEE_COUNT": 650
    },
    {
        "BZPLC_NM": "동양푸드(주)",
        "INDUTY_CD": "C10795",  # 도시락 및 식사대용 준비식품 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 원시로 88",
        "PRDCT_DESC": "삼각김밥 및 샌드위치 재료 투입, 야채 세척, 완제품 컨베이어 벨트 라인 단순 박스 포장 및 스티커 부착 (단순노무 작업)",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": True,
        "EMPLOYEE_COUNT": 52
    },
    {
        "BZPLC_NM": "태양정밀테크",
        "INDUTY_CD": "C26211",  # 인쇄회로기판 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 해봉로 12",
        "PRDCT_DESC": "PCB 기판 노광기 및 에칭 설비 조작, 현상 검사 장비 운용, 회로 불량 패턴 납땜 수정 및 현미경 전수 검사",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": True,
        "EMPLOYEE_COUNT": 40
    }
]

# 출입국관리법 기준 비자별 제조업 취업 제한 규칙 정보
# F-4: 단순노무행위 취업 제한 (출입국관리법 시행령 별표1 등) -> 단순노무 성격의 생산품 설명/업종 필터링
# H-2: 중소기업(제조업 등) 취업만 허용 (상시근로자 300인 미만, 자본금 80억 이하) -> 대기업 필터링
# E-9: 제조업 고용허가서를 발급받은 사업장에만 근무 가능 -> 고용허가증(E9_FOREIGN_LICENSE) 없는 기업 필터링
VISA_RULES = {
    "F-4": {
        "name": "재외동포 (F-4)",
        "restrictions": "단순노무행위 제한 (예: 단순 포장, 분류, 스티커 부착 위주 업종 취업 불가)",
        "code_blacklist": ["C38210", "C10795"], # 수작업 단순 포장 및 식품 가공 단순 노무 업종 차단
        "keywords_blacklist": ["단순 포장", "박스 포장", "단순 분류", "재료 투입", "야채 세척", "스티커 부착"]
    },
    "H-2": {
        "name": "방문취업 (H-2)",
        "restrictions": "중소기업(상시근로자 300인 미만 또는 자본금 80억 이하) 제조업만 허용 (대기업 취업 불가)",
        "max_employee_limit": 300
    },
    "E-9": {
        "name": "비전문취업 (E-9)",
        "restrictions": "관할 고용센터의 외국인 고용허가(E-9 쿼터)를 취득한 중소 제조업체만 허용",
        "require_e9_license": True
    }
}

# [추가 공공데이터 통계 - 옵션 A] 
# 안산시 외국인 주민 및 등록 외국인 체류자격(비자)별 통계 현황 (공모전 정책 대시보드 시각화용)
MOCK_FOREIGNER_STATS = [
    {"visa": "F-4", "label": "재외동포", "count": 24850, "description": "단원구/상록구 일대 중소제조업 기술직 및 상업 종사"},
    {"visa": "H-2", "label": "방문취업", "count": 17920, "description": "안산 스마트허브 중소기업 단순노무 및 기계 보조 종사"},
    {"visa": "E-9", "label": "비전문취업", "count": 12450, "description": "고용허가제 쿼터 배정 제조업체 생산직 상시 근로"},
    {"visa": "F-2-R", "label": "지역특화형", "count": 1150, "description": "안산시 인구 소멸 및 인력 부족 업종 연계 장기근속 비자"},
    {"visa": "D-2 / D-10", "label": "유학생/구직", "count": 4800, "description": "한양대 ERICA, 서울예대 등 관내 대학생 및 학위 취득 구직자"},
    {"visa": "기타 (F-5/F-6 등)", "label": "영주/결혼이민 등", "count": 9480, "description": "다문화가족 및 정주형 외국인 주민"}
]
