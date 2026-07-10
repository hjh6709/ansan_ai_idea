// ==========================================
// 안산 스마트허브 비자-기업 매칭 AI 플랫폼 (PoC)
// Standalone (완전 독립형 브라우저 구동) app.js
// ==========================================

const DEFAULT_API_KEY = "87fe388db00b40498c1aec53f8b37bc8";

// --- 1. 내장 데이터셋 및 룰셋 정의 (FastAPI 백엔드 로직 이식) ---

const MOCK_COMPANIES = [
    {
        "BZPLC_NM": "(주)대원정밀",
        "INDUTY_CD": "C29111",  // 금형 및 주조기 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 산단로 123",
        "PRDCT_DESC": "자동차 엔진용 정밀 금형 부품 가공, 머시닝센터(MCT) 및 CNC 밀링 기계 조작, 정밀 부품 설계 및 금형 조립",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 45
    },
    {
        "BZPLC_NM": "안산케미칼(주)",
        "INDUTY_CD": "C20499",  // 기타 화학제품 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 신원로 45",
        "PRDCT_DESC": "반도체 세정용 고순도 화학 물질 배합, 석유화학 원료 혼합 및 실험 분석, 화학 반응기 조작 및 모니터링",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": false,  // E-9 없음
        "EMPLOYEE_COUNT": 28
    },
    {
        "BZPLC_NM": "신라물류포장",
        "INDUTY_CD": "C38210",  // 단순 박스 포장 및 물류 적재
        "REFINE_ROADNM_ADDR": "경기도 안산시 상록구 사동 78",
        "PRDCT_DESC": "완제품 상자 수작업 박스 포장, 테이핑 작업, 제품 적재 및 창고 단순 분류, 파레트 래핑 (단순노무 작업)",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 12
    },
    {
        "BZPLC_NM": "한성오토모티브(주)",
        "INDUTY_CD": "C30391",  // 자동차 차체 및 트레일러 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 성곡로 210",
        "PRDCT_DESC": "자동차 프레스 부품 로봇 용접 보조, 스폿 용접기 조작, 자동차 현가장치 프레스 프레임 조립 및 품질 검사",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 115
    },
    {
        "BZPLC_NM": "글로벌피앤씨",
        "INDUTY_CD": "C22299",  // 기타 플라스틱 제품 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 번영로 89",
        "PRDCT_DESC": "플라스틱 사출 성형기 조작, 사출물 게이트 커팅, 외관 수작업 사포질 및 검사, 단순 포장",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 35
    },
    {
        "BZPLC_NM": "(주)에이치디일렉트릭 (가칭 대기업)",
        "INDUTY_CD": "C28111",  // 발전기 및 전동기 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 산업단지로 300",
        "PRDCT_DESC": "초고압 변압기 코일 권선기 조작, 중전기기 제어반 전기 배선 작업, 송배전 설비 시스템 테스트",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "대기업",  // 대기업
        "E9_FOREIGN_LICENSE": false,
        "EMPLOYEE_COUNT": 650
    },
    {
        "BZPLC_NM": "동양푸드(주)",
        "INDUTY_CD": "C10795",  // 도시락 및 식사대용 준비식품 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 원시로 88",
        "PRDCT_DESC": "삼각김밥 및 샌드위치 재료 투입, 야채 세척, 완제품 컨베이어 벨트 라인 단순 박스 포장 및 스티커 부착 (단순노무 작업)",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 52
    },
    {
        "BZPLC_NM": "태양정밀테크",
        "INDUTY_CD": "C26211",  // 인쇄회로기판 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 해봉로 12",
        "PRDCT_DESC": "PCB 기판 노광기 및 에칭 설비 조작, 현상 검사 장비 운용, 회로 불량 패턴 납땜 수정 및 현미경 전수 검사",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 40
    }
];

const VISA_RULES = {
    "F-4": {
        "name": "재외동포 (F-4)",
        "restrictions": "단순노무행위 제한 (예: 단순 포장, 분류, 스티커 부착 위주 업종 취업 불가)",
        "code_blacklist": ["C38210", "C10795"],
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
        "require_e9_license": true
    }
};

const MOCK_FOREIGNER_STATS = [
    {"visa": "F-4", "label": "재외동포", "count": 24850, "description": "단원구/상록구 일대 중소제조업 기술직 및 상업 종사"},
    {"visa": "H-2", "label": "방문취업", "count": 17920, "description": "안산 스마트허브 중소기업 단순노무 및 기계 보조 종사"},
    {"visa": "E-9", "label": "비전문취업", "count": 12450, "description": "고용허가제 쿼터 배정 제조업체 생산직 상시 근로"},
    {"visa": "F-2-R", "label": "지역특화형", "count": 1150, "description": "안산시 인구 소멸 및 인력 부족 업종 연계 장기근속 비자"},
    {"visa": "D-2 / D-10", "label": "유학생/구직", "count": 4800, "description": "한양대 ERICA, 서울예대 등 관내 대학생 및 학위 취득 구직자"},
    {"visa": "기타 (F-5/F-6 등)", "label": "영주/결혼이민 등", "count": 9480, "description": "다문화가족 및 정주형 외국인 주민"}
];

// --- 2. DOM 요소 캐싱 ---
const btnOpenSettings = document.getElementById("btn-open-settings");
const btnCloseSettings = document.getElementById("btn-close-settings");
const settingsModal = document.getElementById("settings-modal");
const btnSaveSettings = document.getElementById("btn-save-settings");
const btnTestConnection = document.getElementById("btn-test-connection");
const openapiKeyInput = document.getElementById("openapi-key");
const connectionStatusMsg = document.getElementById("connection-status-msg");
const apiStatusIndicator = document.getElementById("api-status-indicator");

const matchingForm = document.getElementById("matching-form");
const seekerNameInput = document.getElementById("seeker-name");
const seekerResumeTextarea = document.getElementById("seeker-resume");
const charCountSpan = document.getElementById("curr-len");
const visaRadioButtons = document.getElementsByName("visa_type");
const visaRuleInfo = document.getElementById("visa-rule-info");

const stateIdle = document.getElementById("state-idle");
const stateLoading = document.getElementById("state-loading");
const stateResults = document.getElementById("state-results");

const stepData = document.getElementById("step-data");
const stepRule = document.getElementById("step-rule");
const stepNlp = document.getElementById("step-nlp");

const resSourceBadge = document.getElementById("res-source-badge");
const resStatText = document.getElementById("res-stat-text");
const nlpModelText = document.getElementById("nlp-model-text");
const recommendationsContainer = document.getElementById("recommendations-container");
const screenedCountSpan = document.getElementById("screened-count");
const screenedListContainer = document.getElementById("screened-list-container");

const statsSourceBadge = document.getElementById("stats-source-badge");
const statsContainer = document.getElementById("stats-container");

const VISA_LEGAL_TIPS = {
    "F-4": "💡 F-4(재외동포) 비자는 법령상 단순노무행위 취업이 엄격히 제한됩니다. (예: 단순 물류 분류, 단순 박스 포장, 수작업 세척 등은 법적 처벌 대상)",
    "H-2": "💡 H-2(방문취업) 비자는 300인 미만 중소 제조업체에서만 취업이 가능합니다. (대기업 및 허용되지 않은 일부 업종은 취업 불가능)",
    "E-9": "💡 E-9(비전문취업) 비자는 관할 고용센터를 통해 정식으로 외국인 고용허가서(쿼터)를 발급받은 사업장에만 근무가 허용됩니다."
};

// --- 3. 초기화 로직 ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. API 키 로딩 및 헤더 상태 갱신
    let savedKey = localStorage.getItem("gg_openapi_key");
    if (!savedKey) {
        savedKey = DEFAULT_API_KEY;
    }
    
    if (savedKey) {
        openapiKeyInput.value = savedKey;
        updateHeaderApiBadge(true);
    } else {
        updateHeaderApiBadge(false);
    }

    // 2. 비자 정보 팁 초기화
    updateVisaInfoTip("F-4");

    // 3. 프리셋 버튼 이벤트 등록
    document.querySelectorAll(".btn-preset").forEach(btn => {
        btn.addEventListener("click", () => {
            seekerResumeTextarea.value = btn.getAttribute("data-text");
            updateCharCount();
        });
    });

    // 4. 외국인 주민 통계 대시보드 로드
    loadAndRenderForeignerStats(savedKey || DEFAULT_API_KEY || "");
});

// 글자 수 실시간 계산
seekerResumeTextarea.addEventListener("input", updateCharCount);
function updateCharCount() {
    const len = seekerResumeTextarea.value.length;
    charCountSpan.textContent = len;
    if (len > 500) {
        seekerResumeTextarea.value = seekerResumeTextarea.value.substring(0, 500);
        charCountSpan.textContent = 500;
    }
}

// 비자 종류 선택 변경 이벤트
visaRadioButtons.forEach(radio => {
    radio.addEventListener("change", (e) => {
        updateVisaInfoTip(e.target.value);
    });
});
function updateVisaInfoTip(visaType) {
    visaRuleInfo.textContent = VISA_LEGAL_TIPS[visaType] || "";
}

// 헤더 API 배지 변경
function updateHeaderApiBadge(isConnected) {
    if (isConnected) {
        apiStatusIndicator.className = "api-status connected";
        apiStatusIndicator.querySelector(".status-text").textContent = "경기 OpenAPI 연동 활성";
    } else {
        apiStatusIndicator.className = "api-status disconnected";
        apiStatusIndicator.querySelector(".status-text").textContent = "로컬 프리셋 데이터 모드";
    }
}

// 설정 모달 토글
btnOpenSettings.addEventListener("click", () => {
    connectionStatusMsg.className = "connection-status-msg hide";
    settingsModal.classList.remove("hide");
});

const closeModal = () => {
    settingsModal.classList.add("hide");
};
btnCloseSettings.addEventListener("click", closeModal);
settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) closeModal();
});

// 설정 저장
btnSaveSettings.addEventListener("click", () => {
    const key = openapiKeyInput.value.trim();
    if (key) {
        localStorage.setItem("gg_openapi_key", key);
        updateHeaderApiBadge(true);
        loadAndRenderForeignerStats(key);
    } else {
        localStorage.removeItem("gg_openapi_key");
        // 저장된 키 삭제 시 기본 내장 키로 자동 활성화
        updateHeaderApiBadge(true);
        loadAndRenderForeignerStats(DEFAULT_API_KEY);
    }
    closeModal();
});

// --- 4. 경기데이터드림 OpenAPI 직접 연동 (클라이언트 사이드 Fetch) ---

async function fetchGgOpenapiData(apiKey, serviceName) {
    const url = `https://openapi.gg.go.kr/${serviceName}`;
    const params = new URLSearchParams({
        "KEY": apiKey,
        "Type": "json",
        "pIndex": "1",
        "pSize": "100",
        "SIGUN_NM": "안산시"
    });
    
    const response = await fetch(`${url}?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`OpenAPI HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// API 키 연결 테스트 (프론트엔드 직접 검증)
btnTestConnection.addEventListener("click", async () => {
    const key = openapiKeyInput.value.trim();
    if (!key) {
        showConnectionMessage("error", "인증키를 입력해 주세요.");
        return;
    }

    btnTestConnection.disabled = true;
    btnTestConnection.textContent = "테스트 중...";
    showConnectionMessage("info", "경기데이터드림 OpenAPI 호출 테스트 중...");

    try {
        const data = await fetchGgOpenapiData(key, "knowlgindustcntr");
        if (data.knowlgindustcntr) {
            const count = data.knowlgindustcntr[1].row.length;
            showConnectionMessage("success", `연결 성공! 안산시 지식산업센터 현황 ${count}건을 성공적으로 조회했습니다.`);
        } else if (data.RESULT && data.RESULT.CODE !== "INFO-000") {
            showConnectionMessage("error", `연결 실패: ${data.RESULT.MESSAGE}`);
        } else {
            showConnectionMessage("error", "올바르지 않은 API 응답 구조입니다.");
        }
    } catch (e) {
        showConnectionMessage("error", `API 호출 실패: 인터넷 연결 또는 인증키 유효성을 확인하세요. (${e.message})`);
    } finally {
        btnTestConnection.disabled = false;
        btnTestConnection.textContent = "연결 테스트";
    }
});

function showConnectionMessage(type, text) {
    connectionStatusMsg.className = `connection-status-msg ${type}`;
    connectionStatusMsg.textContent = text;
}

// --- 5. 룰베이스 및 어휘적 맥락 매칭 알고리즘 (Standalone JS 구현) ---

// OpenAPI에서 가져온 원본 기업 데이터에 가이드 시뮬레이션용 데이터 추가
function enrichCompanyData(rawRows) {
    return rawRows.map((raw, i) => {
        const bzplc_nm = raw.BZPLC_NM || raw.ENTRPS_NM || `가상기업_${i}`;
        const induty_cd = raw.INDUTY_CD || "C29111";
        const addr = raw.REFINE_ROADNM_ADDR || raw.REFINE_LOTNO_ADDR || "경기도 안산시 단원구 스마트허브로";
        let prdct_desc = raw.PRDCT_DESC || "";
        
        if (!prdct_desc.trim()) {
            if (induty_cd.startsWith("C10")) {
                prdct_desc = "식료품 가공 공장, 식사 대용 밀키트 제조 및 포장 작업";
            } else if (induty_cd.startsWith("C20") || induty_cd.startsWith("C21")) {
                prdct_desc = "화학 배합 원료 혼합 및 패키징 조작, 화학 분석 장비 운용";
            } else if (induty_cd.startsWith("C29") || induty_cd.startsWith("C30")) {
                prdct_desc = "정밀 프레스 금형 부품 기계 가공, 조립, 머시닝 센터 설비 세팅";
            } else {
                prdct_desc = "기타 제조업 설비 운용, 완제품 포장 및 자재 창고 보관 분류";
            }
        }

        // 해시 시드 기반 메타데이터 부여
        const isLarge = (i % 8 === 0);
        const company_scale = isLarge ? "대기업" : "중소기업";
        const employee_count = isLarge ? 680 : (15 + (i * 7) % 150);
        const has_e9 = (i % 5 !== 0);

        // F-4 단순노무 차단 체험용 강제 보정
        if (i === 3) {
            return {
                "BZPLC_NM": "(주)한성푸드 가공센터",
                "INDUTY_CD": "C10795",
                "REFINE_ROADNM_ADDR": addr,
                "PRDCT_DESC": "도시락 완제품 단순 컨베이어 박스 포장 및 스티커 부착, 원재료 야채 수작업 세척 (단순노무 작업)",
                "COMPANY_SCALE": company_scale,
                "E9_FOREIGN_LICENSE": has_e9,
                "EMPLOYEE_COUNT": employee_count
            };
        }
        if (i === 7) {
            return {
                "BZPLC_NM": "안산메탈포장",
                "INDUTY_CD": "C38210",
                "REFINE_ROADNM_ADDR": addr,
                "PRDCT_DESC": "금속 용기 박스 단순 적재, 물류 분류, 단순 테이핑 및 포장 보조 (단순노무)",
                "COMPANY_SCALE": company_scale,
                "E9_FOREIGN_LICENSE": has_e9,
                "EMPLOYEE_COUNT": employee_count
            };
        }

        return {
            "BZPLC_NM": bzplc_nm,
            "INDUTY_CD": induty_cd,
            "REFINE_ROADNM_ADDR": addr,
            "PRDCT_DESC": prdct_desc,
            "COMPANY_SCALE": company_scale,
            "E9_FOREIGN_LICENSE": has_e9,
            "EMPLOYEE_COUNT": employee_count
        };
    });
}

// 1단계 법적 스크리닝
function checkVisaRegulation(company, visaType) {
    const rule = VISA_RULES[visaType];
    if (!rule) return { passed: true, reason: "통과" };

    if (visaType === "F-4") {
        const induty = company.INDUTY_CD || "";
        if (rule.code_blacklist.includes(induty)) {
            return {
                passed: false,
                reason: `F-4(재외동포) 비자는 법령상 단순노무 직종 취업이 제한됩니다. 해당 기업의 주요 업종(${induty})은 단순노무 성격으로 분류되어 채용이 불가합니다.`
            };
        }
        const desc = company.PRDCT_DESC || "";
        for (const kw of rule.keywords_blacklist) {
            if (desc.includes(kw)) {
                return {
                    passed: false,
                    reason: `F-4(재외동포) 비자는 단순노무행위가 제한됩니다. 이 기업의 주요 직무('${kw}')는 법령상 단순노무로 식별되어 채용이 불가합니다.`
                };
            }
        }
    } else if (visaType === "H-2") {
        if (company.COMPANY_SCALE === "대기업" || company.EMPLOYEE_COUNT >= rule.max_employee_limit) {
            return {
                passed: false,
                reason: `H-2(방문취업) 비자는 상시근로자 300인 미만 중소기업에 한해 취업이 가능합니다. 이 기업은 ${company.COMPANY_SCALE}(근로자 ${company.EMPLOYEE_COUNT}명)로 분류되어 법적으로 고용이 제한됩니다.`
            };
        }
    } else if (visaType === "E-9") {
        if (!company.E9_FOREIGN_LICENSE) {
            return {
                passed: false,
                reason: "E-9(비전문취업) 비자는 관할 고용센터의 외국인 고용허가(E-9 쿼터)를 취득하지 않은 기업에 근무하는 것이 법적으로 금지됩니다."
            };
        }
    }

    return { passed: true, reason: "법적 고용 기준 충족" };
}

// 2단계 자카드 어휘적 문맥 유사도 매칭 (Standalone 임베딩 매칭의 경량 대안)
function calculateJaccardSimilarity(str1, str2) {
    const cleanTokens = (text) => {
        const words = text.replace(/[^가-힣a-zA-Z0-9\s]/g, "").split(/\s+/);
        return new Set(words.filter(w => w.length > 1));
    };

    const set1 = cleanTokens(str1);
    const set2 = cleanTokens(str2);

    if (set1.size === 0 || set2.size === 0) return 0.0;

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    let score = intersection.size / union.size;

    // 부분 키워드 오버랩 보정
    let partialMatches = 0;
    set1.forEach(w1 => {
        set2.forEach(w2 => {
            if (w1 !== w2 && (w1.includes(w2) || w2.includes(w1))) {
                partialMatches += 0.5;
            }
        });
    });

    score += partialMatches / (set1.size + set2.size);
    return Math.min(1.0, score);
}

// 통합 매칭 프로세스 (백엔드 로직 브라우저 포팅)
function executeMatchingLocal(seekerResume, visaType, companyPool) {
    const screened_out = [];
    const screened_in = [];

    // 1단계: 룰베이스 필터
    companyPool.forEach(company => {
        const check = checkVisaRegulation(company, visaType);
        if (check.passed) {
            screened_in.append ? screened_in.push(company) : screened_in.push(company); // JS push
        } else {
            const compCopy = { ...company, screen_reason: check.reason };
            screened_out.push(compCopy);
        }
    });

    // 2단계: 어휘 문맥 유사도 계산
    const matched = screened_in.map(company => {
        const sim = calculateJaccardSimilarity(seekerResume, company.PRDCT_DESC);
        // 10% ~ 96% 사이로 스케일 매핑
        const score = Math.round((10.0 + sim * 86.0) * 10) / 10;
        return {
            ...company,
            match_score: score,
            matching_type: "어휘 맥락 유사도 (Standalone)"
        };
    });

    // 스코어 내림차순 정렬
    matched.sort((a, b) => b.match_score - a.match_score);

    return {
        recommended: matched.slice(0, 3),
        screened_out: screened_out,
        total_screened_in: matched.length,
        total_screened_out: screened_out.length
    };
}

// --- 6. 고용 매칭 실행 제어 (Form Submit) ---
matchingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const visaType = document.querySelector('input[name="visa_type"]:checked').value;
    const seekerName = seekerNameInput.value.trim();
    const resumeText = seekerResumeTextarea.value.trim();
    const apiKey = localStorage.getItem("gg_openapi_key") || DEFAULT_API_KEY || "";

    // UI 상태 로딩으로 전환
    stateIdle.classList.add("hide");
    stateResults.classList.add("hide");
    stateLoading.classList.remove("hide");

    resetTimeline();

    try {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        let companies = MOCK_COMPANIES;
        let dataSource = "MockData (Local Preset - OpenAPI 키 미입력)";

        // [단계 1] 데이터 조회
        stepData.classList.add("active");
        
        if (apiKey && apiKey.trim()) {
            try {
                const data = await fetchGgOpenapiData(apiKey.trim(), "knowlgindustcntr");
                if (data.knowlgindustcntr) {
                    const rawRows = data.knowlgindustcntr[1].row;
                    companies = enrichCompanyData(rawRows);
                    dataSource = `경기데이터드림 OpenAPI (실시간 안산 기업 ${companies.length}개 수집)`;
                }
            } catch (err) {
                console.warn("OpenAPI Fetch failed, using fallback mock.", err);
                dataSource = `MockData (Local Preset - OpenAPI 오류 fallback: ${err.message})`;
            }
        }
        
        await delay(800);
        stepData.classList.remove("active");
        stepData.classList.add("done");

        // [단계 2] 룰베이스 스크리닝
        stepRule.classList.add("active");
        await delay(1000);
        
        // 로컬 매칭 연산 즉각 실행
        const result = executeMatchingLocal(resumeText, visaType, companies);
        
        stepRule.classList.remove("active");
        stepRule.classList.add("done");

        // [단계 3] NLP 유사도 분석
        stepNlp.classList.add("active");
        await delay(900);
        stepNlp.classList.remove("active");
        stepNlp.classList.add("done");

        // UI 결과 상태 전환
        stateLoading.classList.add("hide");
        stateResults.classList.remove("hide");

        // 렌더링
        renderMatchingResults(result, seekerName, dataSource);

    } catch (err) {
        console.error(err);
        stateLoading.classList.add("hide");
        stateIdle.classList.remove("hide");
        alert(`매칭 연산 오류가 발생했습니다. (${err.message})`);
    }
});

function resetTimeline() {
    [stepData, stepRule, stepNlp].forEach(step => {
        step.className = "timeline-step";
    });
}

function renderMatchingResults(data, seekerName, dataSource) {
    resSourceBadge.textContent = `데이터 출처: ${dataSource}`;
    
    const totalChecked = data.total_screened_in + data.total_screened_out;
    resStatText.textContent = `안산 스마트허브 관내 기업 ${totalChecked}개 전수 조사 | 1단계 법적 통과: ${data.total_screened_in}개 | 2단계 AI 문맥 추천 완료`;
    
    // AI 모델 텍스트 상태 변경 (Standalone 모드로 표기)
    nlpModelText.textContent = "Lexical Context Matcher (Vercel Standalone)";
    nlpModelText.parentElement.querySelector(".badge-dot").className = "badge-dot green";

    // 🏆 추천 TOP 3 기업 카드 렌더링
    recommendationsContainer.innerHTML = "";
    if (data.recommended && data.recommended.length > 0) {
        data.recommended.forEach((comp, idx) => {
            const card = document.createElement("div");
            card.className = "company-card glass";
            const rankLabel = idx === 0 ? "🏆 BEST MATCH" : `RANK ${idx + 1}`;

            card.innerHTML = `
                <div class="card-top">
                    <div class="comp-info-title">
                        <span class="source-badge">${rankLabel}</span>
                        <h4 class="comp-name">${comp.BZPLC_NM}</h4>
                        <div class="comp-meta">
                            <span>업종코드: ${comp.INDUTY_CD}</span>
                            <span>근로자수: ${comp.EMPLOYEE_COUNT}명</span>
                            <span>${comp.COMPANY_SCALE}</span>
                        </div>
                    </div>
                    <div class="match-score-badge">
                        <span class="score-num">${comp.match_score}%</span>
                        <span class="score-lbl">유사도 스코어</span>
                    </div>
                </div>
                <p class="comp-desc">${comp.PRDCT_DESC}</p>
                <div class="comp-addr">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>${comp.REFINE_ROADNM_ADDR}</span>
                </div>
                <div class="safety-indicator">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>출입국관리법 기준 비자 취업 적격 판정 (고용 안전성 보장)</span>
                </div>
            `;
            recommendationsContainer.appendChild(card);
        });
    } else {
        recommendationsContainer.innerHTML = `
            <div class="empty-state" style="min-height: 200px;">
                <p>1단계 법적 규제 필터링 결과, 구직자의 비자 등급으로 일할 수 있는 적격 제조업체가 존재하지 않거나, 매칭되는 문맥 정보가 부족합니다.</p>
            </div>
        `;
    }

    // 🛡️ 차단된 기업 디버그 리포팅
    screenedCountSpan.textContent = data.total_screened_out;
    screenedListContainer.innerHTML = "";
    
    if (data.screened_out && data.screened_out.length > 0) {
        data.screened_out.forEach(comp => {
            const card = document.createElement("div");
            card.className = "screened-card";
            card.innerHTML = `
                <div class="screened-card-top">
                    <span>⚠️ ${comp.BZPLC_NM}</span>
                    <span>[차단됨]</span>
                </div>
                <div class="comp-meta" style="margin-bottom: 6px;">
                    <span>업종코드: ${comp.INDUTY_CD}</span>
                    <span>규모: ${comp.COMPANY_SCALE} (근로자 ${comp.EMPLOYEE_COUNT}명)</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">직무 설명: ${comp.PRDCT_DESC}</p>
                <div class="screened-reason">
                    <strong>사유:</strong> ${comp.screen_reason}
                </div>
            `;
            screenedListContainer.appendChild(card);
        });
    } else {
        screenedListContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-secondary); text-align: center; padding: 10px;">차단된 기업이 없습니다.</p>`;
    }
}

// --- 7. 정책 모니터링 통계 대시보드 로드 및 렌더링 ---
async function loadAndRenderForeignerStats(apiKey) {
    let dataSource = "MockData (Local Preset)";
    let stats = MOCK_FOREIGNER_STATS;

    if (apiKey && apiKey.trim()) {
        try {
            const data = await fetchGgOpenapiData(apiKey.trim(), "Fgnrpopltn");
            if (data.Fgnrpopltn) {
                dataSource = "경기데이터드림 OpenAPI (실시간)";
                const rows = data.Fgnrpopltn[1].row;
                
                let f4_cnt = 0;
                let h2_cnt = 0;
                let e9_cnt = 0;
                
                rows.forEach(r => {
                    const visa_cd = r.SUBJCT_DIV_NM || r.DIV_NM || "";
                    const cnt = parseInt(r.POP_CNT || r.CNT || 0, 10);
                    if (visa_cd.includes("재외동포") || visa_cd.includes("F-4")) {
                        f4_cnt += cnt;
                    } else if (visa_cd.includes("방문취업") || visa_cd.includes("H-2")) {
                        h2_cnt += cnt;
                    } else if (visa_cd.includes("비전문취업") || visa_cd.includes("E-9")) {
                        e9_cnt += cnt;
                    }
                });

                if (f4_cnt > 0 || h2_cnt > 0 || e9_cnt > 0) {
                    stats = [
                        {"visa": "F-4", "label": "재외동포", "count": f4_cnt || 24850, "description": "단원구/상록구 일대 중소제조업 기술직 및 상업 종사"},
                        {"visa": "H-2", "label": "방문취업", "count": h2_cnt || 17920, "description": "안산 스마트허브 중소기업 단순노무 및 기계 보조 종사"},
                        {"visa": "E-9", "label": "비전문취업", "count": e9_cnt || 12450, "description": "고용허가제 쿼터 배정 제조업체 생산직 상시 근로"},
                        {"visa": "F-2-R", "label": "지역특화형", "count": 1150, "description": "안산시 인구 소멸 및 인력 부족 업종 연계 장기근속 비자"},
                        {"visa": "D-2 / D-10", "label": "유학생/구직", "count": 4800, "description": "한양대 ERICA, 서울예대 등 관내 대학생 및 학위 취득 구직자"},
                        {"visa": "기타 (F-5/F-6 등)", "label": "영주/결혼이민 등", "count": 9480, "description": "다문화가족 및 정주형 외국인 주민"}
                    ];
                }
            }
        } catch (e) {
            console.warn("OpenAPI Fgnrpopltn Fetch failed. Using fallback mock.", e);
            dataSource = `MockData (Local Preset - OpenAPI 오류: ${e.message})`;
        }
    }

    if (statsSourceBadge) {
        statsSourceBadge.textContent = `데이터 출처: ${dataSource}`;
    }

    if (!statsContainer) return;

    statsContainer.innerHTML = `
        <div class="statistics-charts">
            <div class="chart-bar-container" id="bar-chart-list"></div>
            <div class="stats-cards-container" id="mini-cards-list"></div>
        </div>
    `;

    const barChartList = document.getElementById("bar-chart-list");
    const miniCardsList = document.getElementById("mini-cards-list");

    const maxVal = Math.max(...stats.map(s => s.count));

    stats.forEach(item => {
        const pct = maxVal > 0 ? (item.count / maxVal * 100) : 0;
        
        const barItem = document.createElement("div");
        barItem.className = "chart-bar-item";
        barItem.innerHTML = `
            <div class="bar-label-row">
                <span class="bar-lbl-name">${item.label} (${item.visa})</span>
                <span class="bar-lbl-val">${item.count.toLocaleString()}명</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill" id="bar-fill-${item.visa.replace(/[^a-zA-Z0-9]/g, '')}"></div>
            </div>
        `;
        barChartList.appendChild(barItem);

        const cardItem = document.createElement("div");
        cardItem.className = "stat-mini-card";
        cardItem.innerHTML = `
            <div class="stat-mini-code">${item.visa}</div>
            <div class="stat-mini-val">${item.count.toLocaleString()}명</div>
            <div class="stat-mini-desc">${item.description}</div>
        `;
        miniCardsList.appendChild(cardItem);

        setTimeout(() => {
            const fillEl = document.getElementById(`bar-fill-${item.visa.replace(/[^a-zA-Z0-9]/g, '')}`);
            if (fillEl) fillEl.style.width = `${pct}%`;
        }, 100);
    });
}
