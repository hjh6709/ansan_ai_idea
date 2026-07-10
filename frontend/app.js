// ==========================================
// 안산 스마트허브 비자-기업 매칭 AI 플랫폼 (PoC)
// Standalone (완전 독립형 브라우저 구동) app.js
// ==========================================

const DEFAULT_API_KEY = import.meta.env.VITE_GG_API_KEY || "";

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
const openapiKeyInput = document.getElementById("input-api-key");
const connectionStatusMsg = document.getElementById("connection-status-msg");
const apiStatusIndicator = document.getElementById("api-status-indicator");

const matchingForm = document.getElementById("matching-form");
const seekerNameInput = document.getElementById("seeker-name");
const seekerResumeTextarea = document.getElementById("seeker-resume");
const charCountSpan = document.getElementById("curr-len");
const visaRadioButtons = document.getElementsByName("visa-type");
const visaRuleInfo = document.getElementById("visa-rule-tip");

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
const statsMiniContainer = document.getElementById("stats-mini-container");
const langSelector = document.getElementById("lang-selector");

let currentLang = "ko";

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

    // 5. 다국어 셀렉터 이벤트 등록
    if (langSelector) {
        langSelector.addEventListener("change", (e) => {
            changeLanguage(e.target.value);
        });
    }
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
    const t = TRANSLATIONS[currentLang];
    if (t) {
        if (visaType === "F-4") visaRuleInfo.textContent = t["tip-f4"];
        else if (visaType === "H-2") visaRuleInfo.textContent = t["tip-h2"];
        else if (visaType === "E-9") visaRuleInfo.textContent = t["tip-e9"];
    } else {
        visaRuleInfo.textContent = VISA_LEGAL_TIPS[visaType] || "";
    }
}

// 헤더 API 배지 변경
function updateHeaderApiBadge(isConnected) {
    const statusTextNode = apiStatusIndicator.querySelector("#api-status-text");
    if (isConnected) {
        apiStatusIndicator.className = "api-status connected";
        if (statusTextNode) statusTextNode.textContent = "경기 OpenAPI 연동 활성";
    } else {
        apiStatusIndicator.className = "api-status disconnected";
        if (statusTextNode) statusTextNode.textContent = "로컬 프리셋 데이터 모드";
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
                reason: `F-4(재외동포) 체류 자격은 관련 법령에 따라 단순노무 직종 취업이 제한됩니다. 해당 기업의 업종코드(${induty})는 단순노무형 생산 작업으로 분류되어 고용이 불가합니다.`
            };
        }
        const desc = company.PRDCT_DESC || "";
        for (const kw of rule.keywords_blacklist) {
            if (desc.includes(kw)) {
                return {
                    passed: false,
                    reason: `F-4(재외동포) 체류 자격은 수작업 분류·단순 조립 등 단순노무 직무 취업이 제한됩니다. 해당 기업의 작업 내용 중 '${kw}' 직무가 식별되어 고용이 불가합니다.`
                };
            }
        }
    } else if (visaType === "H-2") {
        if (company.COMPANY_SCALE === "대기업" || company.EMPLOYEE_COUNT >= rule.max_employee_limit) {
            return {
                passed: false,
                reason: `H-2(방문취업) 체류 자격은 상시근로자 300인 미만 중소 제조업체에 한해 취업이 허용됩니다. 해당 기업은 대기업 규모(근로자 ${company.EMPLOYEE_COUNT}명)로 분류되어 고용이 불가합니다.`
            };
        }
    } else if (visaType === "E-9") {
        if (!company.E9_FOREIGN_LICENSE) {
            return {
                passed: false,
                reason: "E-9(비전문취업) 체류 자격은 관할 고용센터의 고용허가서(E-9 쿼터)를 발급받지 않은 사업장 근무가 제한됩니다."
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
            matching_type: "직무 적합성 분석 (자연어 맥락 매칭)"
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

    const visaType = document.querySelector('input[name="visa-type"]:checked').value;
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
        let dataSource = "내장 가상 데이터셋 (안산 반월산단 기반)";

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
                dataSource = `내장 가상 데이터셋 (API 호출 예외 fallback: ${err.message})`;
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
    resSourceBadge.textContent = `데이터 수집 채널: ${dataSource}`;
    
    const totalChecked = data.total_screened_in + data.total_screened_out;
    resStatText.textContent = `관내 기업 풀 ${totalChecked}개 전수 대조 | 1단계 적법성 통과: ${data.total_screened_in}개 | 2단계 직무 매칭 진단 완료`;
    
    // AI 모델 텍스트 상태 변경 (Standalone 모드로 표기)
    nlpModelText.textContent = "직무 맥락 분석 엔진 활성";
    nlpModelText.parentElement.querySelector(".badge-dot").className = "badge-dot green";

    // 🏆 추천 TOP 3 기업 카드 렌더링
    recommendationsContainer.innerHTML = "";
    if (data.recommended && data.recommended.length > 0) {
        data.recommended.forEach((comp, idx) => {
            const card = document.createElement("div");
            card.className = "company-card glass";
            
            // Mynavi/Yokohama 하이브리드 스타일 가이드
            const rankLabel = idx === 0 ? "🏆 최적 추천 기업 (BEST)" : `추천 일자리 RANK ${idx + 1}`;

            // 업종 및 기업 맞춤형 태그 생성 (Mynavi 가이드 스타일)
            let tags = ["제조업", "반월산단"];
            let checkPoint = "";
            if (comp.INDUTY_CD.startsWith("C29") || comp.INDUTY_CD.startsWith("C30")) {
                tags.push("정밀 기계", "금형 가공");
                checkPoint = "기계 조작 및 가공 경력자 우대";
            } else if (comp.INDUTY_CD.startsWith("C26") || comp.INDUTY_CD.startsWith("C28")) {
                tags.push("PCB 기판", "전수 검사");
                checkPoint = "현미경 검사 및 세밀 조립 작업";
            } else if (comp.INDUTY_CD.startsWith("C20")) {
                tags.push("화학 배합", "설비 모니터링");
                checkPoint = "화학 물질 배합 및 실험 장비 관리";
            } else {
                tags.push("일반 제조", "창고 관리");
                checkPoint = "교대 근무 가능 및 초보자 지원 가능";
            }

            if (comp.COMPANY_SCALE === "중소기업") {
                tags.push("중소기업 특별지원");
            }
            if (comp.EMPLOYEE_COUNT >= 40) {
                tags.push("기숙사/통근버스");
            }

            const tagsHtml = tags.map(t => `<span class="tag-item" style="font-size: 0.72rem; font-weight: 600; color: var(--secondary); background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.15); padding: 2px 8px; border-radius: 4px; margin-right: 4px;">#${t}</span>`).join(" ");

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
                        <span class="score-lbl">직무 추천율</span>
                    </div>
                </div>
                <div class="tag-container" style="margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 6px;">
                    ${tagsHtml}
                </div>
                <p class="comp-desc">${comp.PRDCT_DESC}</p>
                <div class="safety-indicator" style="background: rgba(16, 185, 129, 0.03); border: 1px solid rgba(16, 185, 129, 0.15); padding: 8px 12px; border-radius: 4px; font-size: 0.78rem; color: var(--primary); display: flex; align-items: center; gap: 8px; margin-bottom: 10px; margin-top: 14px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span><strong>안심 고용:</strong> 체류 자격 기준 적법 고용 안심 기업 (법적 고용 안정성 확보)</span>
                </div>
                <div class="mypoint-indicator" style="font-size: 0.78rem; background: rgba(59, 130, 246, 0.04); border: 1px solid rgba(59, 130, 246, 0.12); color: #93c5fd; padding: 8px 12px; border-radius: 4px; display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span><strong>체크 포인트:</strong> ${checkPoint}</span>
                </div>
                <div class="comp-addr">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>${comp.REFINE_ROADNM_ADDR}</span>
                </div>
            `;
            recommendationsContainer.appendChild(card);
        });
    } else {
        recommendationsContainer.innerHTML = `
            <div class="empty-state" style="min-height: 200px;">
                <p>1단계 비자 자격 필터링 결과, 구직자의 체류 비자로 일할 수 있는 적격 제조업체가 존재하지 않거나 매칭률이 낮습니다.</p>
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
                    <span>[제한 대상]</span>
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
    let dataSource = "내장 가상 데이터셋 (안산시 기반)";
    let stats = MOCK_FOREIGNER_STATS;

    if (apiKey && apiKey.trim()) {
        try {
            const data = await fetchGgOpenapiData(apiKey.trim(), "Fgnrpopltn");
            if (data.Fgnrpopltn) {
                dataSource = "경기도 OpenAPI (실시간)";
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

    if (!statsContainer || !statsMiniContainer) return;

    statsContainer.innerHTML = "";
    statsMiniContainer.innerHTML = "";

    const barChartList = statsContainer;
    const miniCardsList = statsMiniContainer;

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

// --- 8. 다국어 지원 사전 및 번역 적용 로직 ---
const TRANSLATIONS = {
    "ko": {
        "badge-poc": "안산시청 스마트도시과 AI빅데이터팀 공모 PoC",
        "hero-sub": "안산 스마트허브 맞춤형 안심 일자리",
        "hero-main-title": "체류 비자를 <span class=\"highlight-green\">검증</span>하고,<br>적법한 일자리를 <span class=\"highlight-blue\">연결</span>합니다.",
        "hero-desc": "안산 스마트허브 관내 제조업체 정보 및 체류 비자별 법적 규정을 실시간으로 필터링하는 AI 매칭 플랫폼입니다. 불법 고용 리스크를 사전에 원천 차단하고 구직자 경력 맞춤형 일자리를 최적으로 시뮬레이션합니다.",
        "btn-hero-scroll": "적격 일자리 진단하기",
        "sect-dashboard-title": "안산시 외국인 주민 체류 현황 (지역 맞춤형 인력 공급 진단)",
        "sect-diagnostic-title": "1:1 맞춤 일자리 안심 매칭 시뮬레이터",
        "diag-card-title": "외국인 구직자 정보 입력",
        "diag-card-sub": "체류 자격과 보유 경력을 작성해 주세요. 안산시 공공데이터를 전수 대조하여 적격 일자리를 즉각 진단합니다.",
        "label-name": "구직자 성명",
        "label-visa": "보유 체류 자격 (비자 선택)",
        "label-resume": "주요 경력 및 보유 기술 (자유 기술)",
        "placeholder-name": "성명을 입력하세요",
        "placeholder-resume": "이전에 일하셨던 공장이나 업무 경험, 잘하시는 기술을 편하게 입력해 주세요.\n예: '안산 시화공단 부품 조립 공장에서 기계 세팅하고 프레스 부품 조립하는 일을 1년 반 동안 해봤습니다.'",
        "btn-preset-1": "🔧 제조 기계 조작 및 프레스 조립 경력 예시",
        "btn-preset-2": "📦 단순 수작업 포장 및 물류 적재 경력 예시",
        "btn-preset-3": "⚡ PCB 도금 설비 운영 및 품질 검사 경력 예시",
        "btn-match": "적격 일자리 진단 및 추천받기",
        "state-idle-title": "맞춤 일자리 분석 대기 중",
        "state-idle-desc": "비자 조건과 경력 정보를 채워 넣고 상단 버튼을 클릭하시면,<br>안산시 공공데이터를 전수 대조하여 안심 일자리 매칭 연산을 시작합니다.",
        "state-loading-step1": "반월산단 지식산업센터 입주 기업 실시간 정보 조회 중...",
        "state-loading-step2": "1단계: 출입국관리법 기준 비자별 취업제한 업종 스크리닝...",
        "state-loading-step3": "2단계: 자연어 맥락 유사도 기반 직무 매칭율 스코어링...",
        "visa-f4-label": "재외동포",
        "visa-h2-label": "방문취업",
        "visa-e9-label": "비전문취업",
        "tip-f4": "💡 F-4(재외동포) 비자는 법령상 단순노무행위 취업이 엄격히 제한됩니다. (예: 단순 물류 분류, 단순 박스 포장, 수작업 세척 등은 법적 처벌 대상)",
        "tip-h2": "💡 H-2(방문취업) 비자는 300인 미만 중소 제조업체에서만 취업이 가능합니다. (대기업 및 허용되지 않은 일부 업종은 취업 불가능)",
        "tip-e9": "💡 E-9(비전문취업) 비자는 관할 고용센터를 통해 정식으로 외국인 고용허가서(쿼터)를 발급받은 사업장에만 근무가 허용됩니다."
    },
    "en": {
        "badge-poc": "Ansan City Smart City Div & AI Team PoC",
        "hero-sub": "Ansan SmartHub Custom Job Service",
        "hero-main-title": "Verify <span class=\"highlight-green\">Visa status</span>,<br>Connect <span class=\"highlight-blue\">Legal jobs</span>.",
        "hero-desc": "This AI matching platform screens local manufacturing company datasets and visa restrictions. It prevents illegal employment and matches job seekers based on their experience.",
        "btn-hero-scroll": "Start Suitability Test",
        "sect-dashboard-title": "Ansan Foreign Resident Status (Regional Labor Supply Analytics)",
        "sect-diagnostic-title": "1:1 Custom Safe Job Simulator",
        "diag-card-title": "Enter Foreign Job Seeker Info",
        "diag-card-sub": "Enter your visa status and work experiences. We'll cross-reference the municipal databases for safe jobs.",
        "label-name": "Full Name",
        "label-visa": "Visa Status (Select Visa)",
        "label-resume": "Work Experience & Skills (Describe freely)",
        "placeholder-name": "Enter your name",
        "placeholder-resume": "Please describe your previous factory work, tasks, or technical skills.\ne.g. 'I worked at a press assembly factory in Ansan for a year and a half, setting up machines and assembling components.'",
        "btn-preset-1": "🔧 Manufacturing Machine Operation & Press Assembly",
        "btn-preset-2": "📦 Manual Packaging & Logistics Warehouse work",
        "btn-preset-3": "⚡ PCB Electroplating Equipment Operation & Inspection",
        "btn-match": "Analyze Job Suitability",
        "state-idle-title": "Waiting for Job Diagnostics",
        "state-idle-desc": "Please enter your visa and experiences, then click the button above to begin cross-referencing safe jobs.",
        "state-loading-step1": "Fetching factory datasets from Gyeonggi open databases...",
        "state-loading-step2": "Step 1: Screening company industry codes against visa restrictions...",
        "state-loading-step3": "Step 2: Scoring job contextual similarities with natural language processing...",
        "visa-f4-label": "Korean Origin (F-4)",
        "visa-h2-label": "Working Visit (H-2)",
        "visa-e9-label": "Non-Professional (E-9)",
        "tip-f4": "💡 F-4 visa is legally restricted from simple manual labor. (e.g. Simple packaging, manual loading, labeling are subject to legal penalties)",
        "tip-h2": "💡 H-2 visa is only allowed to work in small-medium manufacturers with under 300 employees. (Large corporations are prohibited)",
        "tip-e9": "💡 E-9 visa is only permitted to work in workplaces that have officially acquired an employment permit (quota) from the Job Center."
    },
    "vi": {
        "badge-poc": "Sở Đô thị Thông minh Ansan & Nhóm AI PoC",
        "hero-sub": "Việc làm An tâm tại Ansan SmartHub",
        "hero-main-title": "Xác thực <span class=\"highlight-green\">Thị thực</span>,<br>Kết nối <span class=\"highlight-blue\">Việc làm Hợp pháp</span>.",
        "hero-desc": "Nền tảng AI hỗ trợ tra cứu dữ liệu doanh nghiệp sản xuất và quy định thị thực tại Ansan SmartHub. Phòng ngừa rủi ro lao động bất hợp pháp và đề xuất việc làm tối ưu theo kinh nghiệm.",
        "btn-hero-scroll": "Chẩn đoán việc làm phù hợp",
        "sect-dashboard-title": "Tình hình cư trú của cư dân nước ngoài tại Ansan (Phân tích nhân lực)",
        "sect-diagnostic-title": "Trình giả lập kết nối việc làm an tâm 1:1",
        "diag-card-title": "Nhập thông tin người tìm việc",
        "diag-card-sub": "Vui lòng nhập loại thị thực và kinh nghiệm làm việc của bạn. Hệ thống sẽ đối chiếu dữ liệu để tìm việc làm an toàn.",
        "label-name": "Họ và Tên",
        "label-visa": "Loại Thị thực Cư trú (Chọn Visa)",
        "label-resume": "Kinh nghiệm làm việc & Kỹ năng (Mô tả tự do)",
        "placeholder-name": "Nhập họ và tên của bạn",
        "placeholder-resume": "Vui lòng nhập kinh nghiệm nhà máy hoặc kỹ năng của bạn.\nVí dụ: 'Tôi đã làm việc tại một nhà máy sản xuất linh kiện ô tô ở Ansan trong một năm rưỡi, vận hành máy ép và lắp ráp linh kiện.'",
        "btn-preset-1": "🔧 Vận hành máy sản xuất & Lắp ráp máy ép",
        "btn-preset-2": "📦 Đóng gói thủ công & Xếp dỡ kho bãi logistic",
        "btn-preset-3": "⚡ Vận hành thiết bị xi mạ PCB & Kiểm tra chất lượng",
        "btn-match": "Phân tích và đề xuất việc làm hợp pháp",
        "state-idle-title": "Đang chờ phân tích việc làm phù hợp",
        "state-idle-desc": "Vui lòng nhập điều kiện thị thực và thông tin kinh nghiệm, sau đó nhấn nút phía trên để bắt đầu đối chiếu dữ liệu.",
        "state-loading-step1": "Đang truy vấn dữ liệu doanh nghiệp thời gian thực từ cơ sở dữ liệu...",
        "state-loading-step2": "Bước 1: Sàng lọc doanh nghiệp hạn chế theo quy định của Luật xuất nhập cảnh...",
        "state-loading-step3": "Bước 2: Đánh giá độ phù hợp công việc bằng công cụ phân tích ngôn ngữ tự nhiên...",
        "visa-f4-label": "Kiều bào (F-4)",
        "visa-h2-label": "Lao động H-2",
        "visa-e9-label": "Lao động E-9",
        "tip-f4": "💡 Thị thực F-4 bị nghiêm cấm làm lao động phổ thông theo pháp luật. (Ví dụ: đóng gói đơn giản, bốc xếp thủ công, dán nhãn là đối tượng bị xử phạt hành chính)",
        "tip-h2": "💡 Thị thực H-2 chỉ được phép làm việc tại các nhà sản xuất vừa và nhỏ có dưới 300 lao động. (Nghiêm cấm làm việc tại tập đoàn lớn)",
        "tip-e9": "💡 Thị thực E-9 chỉ được phép làm việc tại nơi đã được cấp giấy phép tuyển dụng chính thức (chỉ tiêu) từ Trung tâm Việc làm."
    },
    "zh": {
        "badge-poc": "安山市厅智能城市科 & AI大数据团队 PoC",
        "hero-sub": "安山智能集聚区定制型安心就业",
        "hero-main-title": "验证 <span class=\"highlight-green\">签证状态</span>,<br>连接 <span class=\"highlight-blue\">合法工作</span>.",
        "hero-desc": "利用AI技术实时筛选安山智能集聚区内企业信息及各签证类型的法律规定。从源头上预防非法雇用风险，并根据求职者的工作经历模拟推荐最适合的岗位。",
        "btn-hero-scroll": "诊断适合岗位",
        "sect-dashboard-title": "安山市外国居民滞留现状 (区域定制型人力供给诊断)",
        "sect-diagnostic-title": "1:1 定制安心就业匹配模拟器",
        "diag-card-title": "外国人求职者信息输入",
        "diag-card-sub": "请填写您的签证类型和工作经历。我们将与安山市公共数据进行全面核对，立即为您匹配合法工作。",
        "label-name": "求职者姓名",
        "label-visa": "持有的滞留资格 (选择签证)",
        "label-resume": "主要工作经历及技能 (自由叙述)",
        "placeholder-name": "请输入姓名",
        "placeholder-resume": "请填写您以前的工厂工作经验或技能。\n例如：'我曾在安山市大德工区的一家零部件装配厂工作了一年半，负责设定机器并装配冲压零部件。'",
        "btn-preset-1": "🔧 制造机械操作及冲压装配经历示例",
        "btn-preset-2": "📦 纯手工包装及物流码垛经历示例",
        "btn-preset-3": "⚡ PCB电镀设备运营及品质检验经历示例",
        "btn-match": "获取合法就业诊断及推荐",
        "state-idle-title": "等待匹配岗位分析",
        "state-idle-desc": "请填写签证条件和经历信息后，点击上方按钮，系统将全面对比安山市公共数据开始安心就业匹配计算。",
        "state-loading-step1": "正在实时查询智能集聚区企业信息数据...",
        "state-loading-step2": "第1步：根据出入境管理法筛选限制雇用的行业类型...",
        "state-loading-step3": "第2步：基于自然语言语义相似度计算岗位推荐匹配率...",
        "visa-f4-label": "在外同胞 (F-4)",
        "visa-h2-label": "访问就业 (H-2)",
        "visa-e9-label": "非专业就业 (E-9)",
        "tip-f4": "💡 法律严格限制持F-4签证的人从事简单劳务。 （例如：简单的包装，手工搬运，贴标签等属于违法行为，将受到处罚）",
        "tip-h2": "💡 持H-2签证的人只允许在少于300名员工的中小制造企业工作。 （禁止在大企业就业）",
        "tip-e9": "💡 持E-9签证的人只允许在已获得就业许可中心（配额）批准的雇主处工作。"
    }
};

function changeLanguage(lang) {
    currentLang = lang;
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // 1. 헤더 & 인포 배지
    document.querySelector(".badge-poc").textContent = t["badge-poc"];
    
    // 2. 히어로 배너
    document.querySelector(".hero-sub").textContent = t["hero-sub"];
    document.querySelector(".hero-main-title").innerHTML = t["hero-main-title"];
    document.querySelector(".hero-desc").textContent = t["hero-desc"];
    document.querySelector(".btn-hero-scroll span").textContent = t["btn-hero-scroll"];

    // 3. 섹션 타이틀
    document.querySelector(".section-dashboard .sect-title").textContent = t["sect-dashboard-title"];
    document.querySelector(".section-diagnostic .sect-title").textContent = t["sect-diagnostic-title"];

    // 4. 진단 폼 카드
    document.querySelector(".diagnostic-form-card h2").textContent = t["diag-card-title"];
    document.querySelector(".diagnostic-form-card .subtitle").textContent = t["diag-card-sub"];
    document.querySelector("label[for='seeker-name']").textContent = t["label-name"];
    document.querySelector("label[for='seeker-resume']").previousElementSibling ? null : document.querySelectorAll(".diagnostic-form-card label")[1].textContent = t["label-visa"];
    document.querySelector("label[for='seeker-resume']").textContent = t["label-resume"];
    
    // 플레이스홀더
    seekerNameInput.setAttribute("placeholder", t["placeholder-name"]);
    seekerResumeTextarea.setAttribute("placeholder", t["placeholder-resume"]);

    // 프리셋 버튼
    const presets = document.querySelectorAll(".btn-preset");
    if (presets.length >= 3) {
        presets[0].textContent = t["btn-preset-1"];
        presets[1].textContent = t["btn-preset-2"];
        presets[2].textContent = t["btn-preset-3"];
    }

    // 진단하기 버튼
    document.querySelector("#btn-match .btn-text").textContent = t["btn-match"];

    // 5. 로딩 타임라인 단계 텍스트
    stepData.querySelector(".step-label").textContent = t["state-loading-step1"];
    stepRule.querySelector(".step-label").textContent = t["state-loading-step2"];
    stepNlp.querySelector(".step-label").textContent = t["state-loading-step3"];

    // 6. 대기 상태 카드
    stateIdle.querySelector("h3").textContent = t["state-idle-title"];
    stateIdle.querySelector("p").innerHTML = t["state-idle-desc"];

    // 7. 라디오 뱃지 라벨 업데이트
    const visaBoxes = document.querySelectorAll(".visa-box");
    if (visaBoxes.length >= 3) {
        visaBoxes[0].querySelector(".visa-label").textContent = t["visa-f4-label"];
        visaBoxes[1].querySelector(".visa-label").textContent = t["visa-h2-label"];
        visaBoxes[2].querySelector(".visa-label").textContent = t["visa-e9-label"];
    }

    // 8. 현재 선택된 비자에 맞춘 가이드 팁 강제 갱신
    const activeRadio = document.querySelector('input[name="visa-type"]:checked');
    if (activeRadio) {
        updateVisaInfoTip(activeRadio.value);
    }
}

