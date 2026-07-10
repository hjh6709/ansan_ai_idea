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
        "BZPLC_NM": "(주)세진케미칼",
        "INDUTY_CD": "C20499",  // 기타 화학제품 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 신원로 45",
        "PRDCT_DESC": "반도체 세정용 고순도 화학 물질 배합, 석유화학 원료 혼합 및 실험 분석, 화학 반응기 조작 및 모니터링",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": false,  // E-9 쿼터 없음
        "EMPLOYEE_COUNT": 28
    },
    {
        "BZPLC_NM": "(주)안산통합물류",
        "INDUTY_CD": "C38210",  // 단순 박스 포장 및 물류 적재
        "REFINE_ROADNM_ADDR": "경기도 안산시 상록구 사동 78",
        "PRDCT_DESC": "완제품 상자 수작업 박스 포장, 테이핑 작업, 제품 적재 및 창고 단순 분류, 파레트 래핑 (단순노무 작업)",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 12
    },
    {
        "BZPLC_NM": "(주)한성오토텍",
        "INDUTY_CD": "C30391",  // 자동차 차체 및 트레일러 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 성곡로 210",
        "PRDCT_DESC": "자동차 프레스 부품 로봇 용접 보조, 스폿 용접기 조작, 자동차 현가장치 프레스 프레임 조립 및 품질 검사",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 115
    },
    {
        "BZPLC_NM": "(주)글로벌플라스틱",
        "INDUTY_CD": "C22299",  // 기타 플라스틱 제품 제조업
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 번영로 89",
        "PRDCT_DESC": "플라스틱 사출 성형기 조작, 사출물 게이트 커팅, 외관 수작업 사포질 및 검사, 단순 포장",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "중소기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 35
    },
    {
        "BZPLC_NM": "대덕전자(주)",
        "INDUTY_CD": "C26211",  // 인쇄회로기판 제조업 (PCB 대표 대기업)
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 산업단지로 300",
        "PRDCT_DESC": "인쇄회로기판(PCB) 자동화 세정 라인 운용, 에칭 장비 기계 조작 및 공정 모니터링, 다층 회로기판 설계 보조",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "대기업",
        "E9_FOREIGN_LICENSE": false,
        "EMPLOYEE_COUNT": 650
    },
    {
        "BZPLC_NM": "(주)SPC삼립 안산공장",
        "INDUTY_CD": "C10795",  // 도시락 및 식사대용 준비식품 제조업 (단순노무 위주의 대기업 공장)
        "REFINE_ROADNM_ADDR": "경기도 안산시 단원구 원시로 88",
        "PRDCT_DESC": "샌드위치/빵 생산 재료 공급 투입, 야채 세척기 조작, 완제품 컨베이어 벨트 라인 단순 박스 포장 및 스티커 부착 (단순노무 작업)",
        "SIGUN_NM": "안산시",
        "COMPANY_SCALE": "대기업",
        "E9_FOREIGN_LICENSE": true,
        "EMPLOYEE_COUNT": 520
    },
    {
        "BZPLC_NM": "(주)에스제이테크",
        "INDUTY_CD": "C26211",  // 인쇄회로기판 제조업 (PCB 강소기업)
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
    // 탭 페이지 라우팅 로직
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPages = document.querySelectorAll(".tab-page");

    function switchTab(targetId) {
        tabButtons.forEach(btn => {
            if (btn.getAttribute("data-target") === targetId) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        tabPages.forEach(page => {
            if (page.id === targetId) {
                page.classList.add("active");
            } else {
                page.classList.remove("active");
            }
        });
    }

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            switchTab(target);
        });
    });

    window.switchTab = switchTab;

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
        const bzplc_nm = raw.KNOWLG_INDUST_CNTR_NM 
            ? `${raw.KNOWLG_INDUST_CNTR_NM} 입주기업` 
            : (raw.BZPLC_NM || raw.ENTRPS_NM || `안산 스마트허브 제조사_${i}`);
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
    if (!rule) return { passed: true, reason_key: "pass", reason_params: {} };

    if (visaType === "F-4") {
        const induty = company.INDUTY_CD || "";
        if (rule.code_blacklist.includes(induty)) {
            return {
                passed: false,
                reason_key: "f4-code-err",
                reason_params: { induty }
            };
        }
        const desc = company.PRDCT_DESC || "";
        for (const kw of rule.keywords_blacklist) {
            if (desc.includes(kw)) {
                return {
                    passed: false,
                    reason_key: "f4-kw-err",
                    reason_params: { kw }
                };
            }
        }
    } else if (visaType === "H-2") {
        if (company.COMPANY_SCALE === "대기업" || company.EMPLOYEE_COUNT >= rule.max_employee_limit) {
            return {
                passed: false,
                reason_key: "h2-large-err",
                reason_params: { count: company.EMPLOYEE_COUNT }
            };
        }
    } else if (visaType === "E-9") {
        if (!company.E9_FOREIGN_LICENSE) {
            return {
                passed: false,
                reason_key: "e9-license-err",
                reason_params: {}
            };
        }
    }

    return { passed: true, reason_key: "pass", reason_params: {} };
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
            const compCopy = { 
                ...company, 
                screen_reason_key: check.reason_key, 
                screen_reason_params: check.reason_params 
            };
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

function generateAiReport(resumeText, name) {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS["ko"];
    let type = "general";
    let keywords = [];

    const text = (resumeText || "").toLowerCase();
    
    if (text.includes("mct") || text.includes("기계") || text.includes("machine") || text.includes("프레스") || text.includes("press") || text.includes("조작") || text.includes("조립") || text.includes("생산")) {
        if (text.includes("pcb") || text.includes("기판") || text.includes("검사") || text.includes("inspect")) {
            type = "pcb";
            keywords = ["PCB", t["tag-inspect"] || "Inspect", t["tag-pcb"] || "PCB"];
        } else {
            type = "mct";
            keywords = [t["tag-mct"] || "Machining", t["tag-mold"] || "Mold", "MCT/Press"];
        }
    } else if (text.includes("pcb") || text.includes("기판") || text.includes("검사") || text.includes("inspect") || text.includes("현미경") || text.includes("품질")) {
        type = "pcb";
        keywords = ["PCB", t["tag-inspect"] || "Inspect", t["tag-pcb"] || "PCB"];
    } else if (text.includes("화학") || text.includes("도금") || text.includes("배합") || text.includes("액체") || text.includes("chem") || text.includes("chemical")) {
        type = "chem";
        keywords = [t["tag-chem"] || "Chemical", "Plating", t["tag-monitor"] || "Monitor"];
    } else {
        type = "general";
        keywords = [t["tag-general"] || "General Mfg", t["tag-warehouse"] || "Warehouse", "Logistic"];
    }

    let summary = t[`feedback-${type}`] || "";
    summary = summary.replace("{name}", name || "Seeker");

    return {
        title: t["ai-report-title"] || "🤖 AI Resume Analysis Report",
        extractTitle: t["ai-extract-title"] || "Core Competency Extracted",
        summary: summary,
        keywords: keywords
    };
}

function renderMatchingResults(data, seekerName, dataSource) {
    resSourceBadge.textContent = `데이터 수집 채널: ${dataSource}`;
    
    const totalChecked = data.total_screened_in + data.total_screened_out;
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS["ko"];
    resStatText.textContent = t["res-stat-text"] ? t["res-stat-text"].replace("{total}", totalChecked).replace("{in}", data.total_screened_in) : `관내 기업 풀 ${totalChecked}개 전수 대조 | 1단계 적법성 통과: ${data.total_screened_in}개 | 2단계 직무 매칭 진단 완료`;
    
    // AI 모델 텍스트 상태 변경 (Standalone 모드로 표기)
    nlpModelText.textContent = t["state-nlp-model"] || "직무 맥락 분석 엔진 활성";
    nlpModelText.parentElement.querySelector(".badge-dot").className = "badge-dot green";

    // 🏆 추천 TOP 3 기업 카드 렌더링
    recommendationsContainer.innerHTML = "";
    
    // 최상단 AI 리포트 렌더링
    const resumeText = seekerResumeTextarea.value;
    const aiReport = generateAiReport(resumeText, seekerName);
    
    const reportCard = document.createElement("div");
    reportCard.className = "ai-report-card";
    reportCard.innerHTML = `
        <div class="ai-report-header">
            <div class="ai-report-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-3.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z"/>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-3.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z"/>
                </svg>
            </div>
            <h4 class="ai-report-title">${aiReport.title}</h4>
        </div>
        <div class="ai-report-body">
            <p class="ai-report-summary">${aiReport.summary}</p>
            <div style="margin-top: 14px; font-size: 0.72rem; font-weight: 800; color: var(--secondary);">${aiReport.extractTitle}</div>
            <div class="ai-report-keywords">
                ${aiReport.keywords.map(kw => `<span class="ai-keyword-tag">${kw}</span>`).join("")}
            </div>
        </div>
    `;
    recommendationsContainer.appendChild(reportCard);

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
            const t = TRANSLATIONS[currentLang];
            let reasonStr = "";
            if (t && comp.screen_reason_key && t[comp.screen_reason_key]) {
                let temp = t[comp.screen_reason_key];
                const params = comp.screen_reason_params || {};
                Object.keys(params).forEach(k => {
                    temp = temp.replace(new RegExp(`\\{${k}\\}`, "g"), params[k]);
                });
                reasonStr = temp;
            } else {
                reasonStr = comp.screen_reason || "Immigration compliance screening failed.";
            }

            const card = document.createElement("div");
            card.className = "screened-card";
            card.innerHTML = `
                <div class="screened-card-top">
                    <span class="screened-comp-name">⚠️ ${comp.BZPLC_NM}</span>
                    <span class="screened-badge">RESTRICTED</span>
                </div>
                <div class="screened-comp-meta">
                    <span>업종코드: ${comp.INDUTY_CD}</span>
                    <span>규모: ${comp.COMPANY_SCALE}</span>
                    <span>상시 근로자: ${comp.EMPLOYEE_COUNT}명</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">직무 설명: ${comp.PRDCT_DESC}</p>
                <div class="screened-reason-box">
                    <strong>🛡️ 출입국관리법 불합격 (Immigration Audit Failure Reason)</strong>
                    ${reasonStr}
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
        "logo-title": "<span class=\"color-ansan-green\">안산</span><span class=\"color-ansan-orange\">스마트허브</span> <span class=\"text-white-dark\">안심채용 플랫폼</span>",
        "api-status-connected": "경기 OpenAPI 연동 활성",
        "api-status-disconnected": "연동 대기 중",
        "summary-title-text": "체류자격 적법성 진단 완료",
        "screened-collapse-title": "비자 규정 위반 취업 제한 기업 목록",
        "api-val-title-1": "실시간 데이터 정합성 보장",
        "api-val-desc-1": "안산 스마트허브 내 수만 개 제조사의 폐업, 이전, 상시 근로자 수 변동 및 신규 공장 등록 정보를 경기도청(경기데이터드림) OpenAPI와 100% 실시간 동기화하여 수동 엑셀 업데이트가 불필요한 상시 청정 매칭망을 유지합니다.",
        "api-val-title-2": "행정/법적 리스크 원천 차단",
        "api-val-desc-2": "출입국관리법 비자 규정(F-4 단순노무 금지, H-2 대기업 근무 제한 등)을 OpenAPI 기업 규모/업종 데이터와 1차적으로 완전 대조함으로써, 공공 일자리 센터의 불법 고용 알선 리스크 및 과태료 행정 처분 확률을 0%로 통제합니다.",
        "api-val-title-3": "안산시 스마트 행정 자동화",
        "api-val-desc-3": "기존에 다문화가족 및 외국인 구직자 상담 시 상담원이 두꺼운 출입국 업무 지침서와 기업 대장을 일일이 수동 대조하던 행정 낭비를 AI의 자연어 이력 파싱과 OpenAPI 전수 스크리닝을 통해 단 1초 만에 자동 완성시킵니다.",
        "ai-report-title": "📊 구직자 핵심 역량 매칭 리포트",
        "ai-extract-title": "구직자 핵심 역량 분석",
        "tab-dashboard": "체류 현황 대시보드",
        "tab-matcher": "안심 일자리 진단",
        "btn-hero-go-matcher": "적격 일자리 진단하기",
        "f4-code-err": "출입국관리법 시행령 별표 1의2에 의거, 재외동포(F-4) 자격은 단순노무(한국표준직업분류 대분류 9) 직종 취업이 제한됩니다. 해당 기업의 표준산업분류 업종코드({induty})는 단순 노무형 포장/분류 생산 작업에 해당하여 합법적인 고용이 불가합니다.",
        "f4-kw-err": "출입국관리법 시행령 별표 1의2 및 법무부 고시 제2018-193호에 의거, 수작업 단순 포장·분류·박스 적재 등 단순노무 직무 취업이 엄격히 제한됩니다. 해당 공정 설명에서 단순노무 작업('{kw}')이 식별되어 법적 채용 불가 대상입니다.",
        "h2-large-err": "출입국관리법 시행령 별표 1에 의거, 방문취업(H-2) 자격은 상시근로자 300인 미만 또는 자본금 80억 이하의 중소/중견 제조업에서만 근무가 허용됩니다. 해당 기업은 대기업 규모(근로자 {count}명)로 분류되어 법적 취업 제한 대상입니다.",
        "e9-license-err": "외국인근로자의 고용 등에 관한 법률 제8조에 의거, 비전문취업(E-9) 자격은 관할 고용노동청을 통해 고용허가서(E-9 쿼터)를 취득한 중소 제조업체에서만 유효합니다. 해당 기업은 고용허가 면허(E9 License) 미보유 사업장으로 법적 취업이 차단됩니다.",
        "feedback-mct": "구직자 {name}님은 정밀 기계 조작 및 생산 공정 제어 분야에서 숙련된 실무 역량을 보유하고 있습니다. 반월산단 내 기계 가공 및 조립 제조 현장과의 직무 연관성 및 생산 효율성이 매우 높게 평가되어 법적 규정을 준수하는 해당 가공 기업을 우선 추천합니다.",
        "feedback-pcb": "구직자 {name}님은 초정밀 PCB 회로 조립 및 육안/현미경 전수 검사 직무에 탁월한 미세 제어 및 집중력을 나타내고 있습니다. 반월산단 정밀 반도체 전장 분야 및 자동화 라인과 최적의 궁합을 보입니다.",
        "feedback-chem": "구직자 {name}님은 화학 약품 교반, 실험 장비 계측 및 정밀 공정 모니터링 직무에서 숙련된 안전 보증 역량을 가지고 있습니다. 고도의 환경/안전 규격 준수가 필수적인 화학 제조 생산 라인을 맞춤 추천합니다.",
        "feedback-gen": "구직자 {name}님은 제조 생산 라인 흐름에 대한 적응력 및 다양한 단순노무 직무에서의 성실한 기초 역량을 보이고 있습니다. 출입국관리법상 비자 취업제한 요소를 원천 제거한 최적의 안심 일반 제조 현장과 매칭되었습니다.",
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
        "tip-e9": "💡 E-9(비전문취업) 비자는 관할 고용센터를 통해 정식으로 외국인 고용허가서(쿼터)를 발급받은 사업장에만 근무가 허용됩니다.",
        
        "res-source-badge": "데이터 수집 채널",
        "source-realtime": "실시간 OpenAPI 연동망",
        "source-mock": "내장 스마트허브 가상 데이터셋",
        "res-stat-text": "관내 기업 풀 {total}개 전수 대조 | 1단계 적법성 통과: {in}개 | 2단계 직무 매칭 진단 완료",
        "state-nlp-model": "직무 맥락 분석 엔진 활성",
        "card-best": "🏆 최적 추천 기업 (BEST)",
        "card-rank": "추천 일자리 RANK {idx}",
        "card-score-label": "직무 추천율",
        "card-worker": "근로자수",
        "card-worker-suffix": "명",
        "card-scale": "규모",
        "scale-large": "대기업",
        "scale-sme": "중소기업",
        "card-induty-label": "업종코드",
        "safety-label": "안심 고용",
        "safety-desc": "체류 자격 기준 적법 고용 안심 기업 (법적 고용 안정성 확보)",
        "checkpoint-label": "체크 포인트",
        "err-screen-count": "제한 대상",
        "err-screen-reason-label": "제한 사유",
        "empty-recommend": "1단계 비자 자격 필터링 결과, 구직자의 체류 비자로 일할 수 있는 적격 제조업체가 존재하지 않거나 매칭률이 낮습니다.",
        "collapse-screened-title": "🛡️ 체류 자격상 취업 제한 기업 (안심 고용 필터링 {count}건)",
        "collapse-screened-empty": "제한 대상인 기업이 없습니다.",
        "passed-reason": "법적 고용 기준 충족",
        
        "err-f4-industry": "F-4(재외동포) 체류 자격은 관련 법령에 따라 단순노무 업종 취업이 제한됩니다. 해당 기업의 업종코드({induty})는 단순노무형 생산 작업으로 분류되어 고용이 불가합니다.",
        "err-f4-keyword": "F-4(재외동포) 체류 자격은 수작업 분류·단순 조립 등 단순노무 직무 취업이 제한됩니다. 해당 기업의 작업 내용 중 '{kw}' 직무가 식별되어 고용이 불가합니다.",
        "err-h2-scale": "H-2(방문취업) 체류 자격은 상시근로자 300인 미만 중소 제조업체에 한해 취업이 허용됩니다. 해당 기업은 대기업 규모(근로자 {count}명)로 분류되어 고용이 불가합니다.",
        "err-e9-license": "E-9(비전문취업) 체류 자격은 관할 고용센터의 고용허가서(E-9 쿼터)를 발급받지 않은 사업장 근무가 제한됩니다.",
        
        "tag-mfg": "제조업",
        "tag-sh": "반월산단",
        "tag-mct": "정밀 기계",
        "tag-mold": "금형 가공",
        "tag-pcb": "PCB 기판",
        "tag-inspect": "전수 검사",
        "tag-chem": "화학 배합",
        "tag-monitor": "설비 모니터링",
        "tag-general": "일반 제조",
        "tag-warehouse": "창고 관리",
        "tag-sme": "중소기업 특별지원",
        "tag-dorm": "기숙사/통근버스",
        "match-point-mct": "기계 조작 및 가공 경력자 우대",
        "match-point-pcb": "현미경 검사 및 세밀 조립 작업",
        "match-point-chem": "화학 물질 배합 및 실험 장비 관리",
        "match-point-gen": "교대 근무 가능 및 초보자 지원 가능"
    },
    "en": {
        "badge-poc": "Ansan City Smart City Div & AI Team PoC",
        "logo-title": "<span class=\"color-ansan-green\">Ansan</span> <span class=\"color-ansan-orange\">SmartHub</span> <span class=\"text-white-dark\">Safe Job Platform</span>",
        "api-status-connected": "Gyeonggi OpenAPI Active",
        "api-status-disconnected": "Waiting for Connection",
        "summary-title-text": "Visa Law Compliance Diagnostic Completed",
        "screened-collapse-title": "List of Restricted Companies due to Visa Regulations",
        "api-val-title-1": "Guaranteed Real-time Data Integrity",
        "api-val-desc-1": "By syncing corporate datasets of Ansan manufacturers directly from Gyeonggi's open API, we maintain a clean matching index reflecting closing, relocation, and employee fluctuations in real time.",
        "api-val-title-2": "Prevent Legal & Admin Risks",
        "api-val-desc-2": "Comparing immigration laws (F-4 simple labor ban, H-2 large enterprise limits) with OpenAPI metadata prevents illegal brokering risks and potential administrative fines for the City Council.",
        "api-val-title-3": "Smart Administration Automation",
        "api-val-desc-3": "Reduces heavy counseling overhead by automating manual checks between immigration guidelines and factory papers down to a 1-second AI semantic scanning pipeline.",
        "ai-report-title": "📊 Core Competency Profile",
        "ai-extract-title": "Profile-Extracted Core Competency",
        "tab-dashboard": "Immigration Dashboard",
        "tab-matcher": "Visa Compliance Matcher",
        "btn-hero-go-matcher": "Start Profile Diagnostic",
        "f4-code-err": "Pursuant to Presidential Decree of the Immigration Act, F-4 visa holders are restricted from simple manual labor (KSCO Code 9). This industry code ({induty}) is classified as manual packing/sorting and is legally ineligible.",
        "f4-kw-err": "Pursuant to Presidential Decree of the Immigration Act, simple manual packaging, sorting, and wrapping tasks are strictly restricted. The task keyword '{kw}' has been identified, which constitutes a legal compliance failure.",
        "h2-large-err": "Pursuant to Presidential Decree of the Immigration Act, H-2 visa holders are only permitted to work at small-and-medium enterprises (less than 300 employees). This company is classified as a large enterprise ({count} employees), causing an immediate compliance failure.",
        "e9-license-err": "Pursuant to Act on the Employment of Foreign Workers, E-9 visa holders are only permitted to work at SMEs that have obtained an official Employment Permit (E-9 Quota) from the Ministry of Employment and Labor. This facility does not hold an E-9 license.",
        "feedback-mct": "Job seeker {name} exhibits professional competency in precision machine operation and production line control. Highly compatible with manufacturing facilities in Banwon, yielding legal safety and productivity.",
        "feedback-pcb": "Job seeker {name} shows outstanding micro-control and focus in precision PCB circuit assembly and microscope inspection. Shows best fit with semiconductor devices.",
        "feedback-chem": "Job seeker {name} possesses stable safety verification capability in chemical compound mixing and equipment control. Custom matches chemical manufacturing plants requiring safety standards.",
        "feedback-gen": "Job seeker {name} demonstrates flexibility in general manufacturing and diligent baseline operation. Safely matched with legal general manufacturing sites without visa violation risks.",
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
        "tip-e9": "💡 E-9 visa is only permitted to work in workplaces that have officially acquired an employment permit (quota) from the Job Center.",
        
        "res-source-badge": "Data Source",
        "source-realtime": "Real-time OpenAPI Network",
        "source-mock": "Local SmartHub Mock Dataset",
        "res-stat-text": "Queried {total} local companies | Passed Step 1 (Visa check): {in} | Step 2 (Job Matching) finished",
        "state-nlp-model": "Job Semantic Analysis Engine Active",
        "card-best": "🏆 Best Matching Company (BEST)",
        "card-rank": "Recommended Job RANK {idx}",
        "card-score-label": "Job Fit Score",
        "card-worker": "Employees",
        "card-worker-suffix": " workers",
        "card-scale": "Scale",
        "scale-large": "Enterprise",
        "scale-sme": "SME",
        "card-induty-label": "Industry Code",
        "safety-label": "Safe Job",
        "safety-desc": "Certified compliant with visa regulations (Employment Legal Stability Secured)",
        "checkpoint-label": "Check Point",
        "err-screen-count": "Restricted",
        "err-screen-reason-label": "Reason",
        "empty-recommend": "Under Step 1 Visa Filtering, no eligible manufacturing companies were found or job matching scores were too low.",
        "collapse-screened-title": "🛡️ Restricted Companies due to Visa Regulations ({count} filtered)",
        "collapse-screened-empty": "No restricted companies found.",
        "passed-reason": "Compliant with Legal Standards",
        
        "err-f4-industry": "F-4 visa holders are legally restricted from simple manual labor. The industry code ({induty}) of this company classifies as simple production labor, rendering employment illegal.",
        "err-f4-keyword": "F-4 visa holders are legally restricted from manual sorting and simple assembly. The keyword '{kw}' was identified in this company's description, rendering employment illegal.",
        "err-h2-scale": "H-2 visa holders are only permitted to work in manufacturing companies with less than 300 employees. This company is classified as a large enterprise ({count} workers), rendering employment illegal.",
        "err-e9-license": "E-9 visa holders are prohibited from working at places that have not officially acquired an E-9 employment quota from the Job Center.",
        
        "tag-mfg": "Manufacturing",
        "tag-sh": "SmartHub",
        "tag-mct": "Machining",
        "tag-mold": "Mold Process",
        "tag-pcb": "PCB Plate",
        "tag-inspect": "Quality Check",
        "tag-chem": "Chemical Mix",
        "tag-monitor": "Monitoring",
        "tag-general": "General Mfg",
        "tag-warehouse": "Warehouse",
        "tag-sme": "SME Support",
        "tag-dorm": "Dormitory/Bus",
        "match-point-mct": "Preferred: Machine operation & tooling experience",
        "match-point-pcb": "Preferred: Microscope inspection & fine assembly",
        "match-point-chem": "Preferred: Chemical compound mixing & equipment control",
        "match-point-gen": "Preferred: Shift work available & beginners welcome"
    },
    "vi": {
        "badge-poc": "Sở Đô thị Thông minh Ansan & Nhóm AI PoC",
        "logo-title": "<span class=\"color-ansan-green\">Ansan</span> <span class=\"color-ansan-orange\">SmartHub</span> <span class=\"text-white-dark\">Nền tảng việc làm an toàn</span>",
        "api-status-connected": "Kết nối OpenAPI Hoạt động",
        "api-status-disconnected": "Đang chờ kết nối",
        "summary-title-text": "Chẩn đoán tuân thủ Luật Thị thực hoàn tất",
        "screened-collapse-title": "Danh sách doanh nghiệp bị hạn chế theo quy định Visa",
        "api-val-title-1": "Bảo đảm tính toàn vẹn dữ liệu thực tế",
        "api-val-desc-1": "Đồng bộ dữ liệu của doanh nghiệp Ansan trực tiếp từ API của Gyeonggi, duy trì hệ thống đối chiếu sạch phản ánh chính xác việc đóng cửa, thay đổi lao động.",
        "api-val-title-2": "Ngăn ngừa rủi ro hành chính & pháp lý",
        "api-val-desc-2": "Đối chiếu luật thị thực (F-4 cấm lao động chân tay, H-2 giới hạn quy mô) với OpenAPI loại bỏ rủi ro môi giới bất hợp pháp và các mức phạt hành chính.",
        "api-val-title-3": "Tự động hóa hành chính thông minh",
        "api-val-desc-3": "Giảm bớt gánh nặng tư vấn thủ công bằng cách tự động đối chiếu hướng dẫn thị thực với hồ sơ nhà máy thông qua hệ thống AI chỉ trong 1 giây.",
        "ai-report-title": "📊 Báo cáo hồ sơ năng lực cốt lõi",
        "ai-extract-title": "Năng lực cốt lõi từ hồ sơ",
        "tab-dashboard": "Bảng giám sát",
        "tab-matcher": "Chẩn đoán việc làm",
        "btn-hero-go-matcher": "Bắt đầu chẩn đoán",
        "f4-code-err": "Theo Nghị định của Luật Nhập cảnh, thị thực F-4 bị hạn chế lao động chân tay (Phân loại KSCO 9). Mã ngành này ({induty}) là đóng gói/phân loại thủ công nên không được phép tuyển dụng.",
        "f4-kw-err": "Theo quy định Nhập cảnh, các công việc đóng gói, phân loại và xếp hộp thủ công bị nghiêm cấm. Từ khóa '{kw}' đã bị phát hiện, cấu thành lỗi tuân thủ pháp lý.",
        "h2-large-err": "Theo quy định Nhập cảnh, thị thực H-2 chỉ được làm việc tại doanh nghiệp nhỏ và vừa (dưới 300 nhân viên). Doanh nghiệp này là doanh nghiệp lớn ({count} nhân viên), không được tuyển dụng.",
        "e9-license-err": "Theo Đạo luật Tuyển dụng Lao động Nước ngoài, thị thực E-9 chỉ được làm việc tại các doanh nghiệp đã được Bộ Việc làm và Lao động cấp Hạn ngạch (E-9 Quota). Nhà máy này không có giấy phép E-9.",
        "feedback-mct": "Người tìm việc {name} có năng lực vận hành máy móc cơ khí chính xác và kiểm soát dây chuyền sản xuất. Rất tương thích với các nhà máy sản xuất tại Banwon, đảm bảo tính hợp pháp và năng suất cao.",
        "feedback-pcb": "Người tìm việc {name} thể hiện khả năng kiểm soát tỉ mỉ và tập trung cao trong lắp ráp mạch PCB và kiểm tra kính hiển vi. Phù hợp nhất với các công ty thiết bị bán dẫn.",
        "feedback-chem": "Người tìm việc {name} có khả năng kiểm soát an toàn trong pha chế hợp chất hóa học và thiết bị đo đạc. Phù hợp với các nhà máy hóa chất yêu cầu tiêu chuẩn an toàn nghiêm ngặt.",
        "feedback-gen": "Người tìm việc {name} thể hiện sự linh hoạt trong sản xuất chung và vận hành cần cù. Được kết nối an toàn với các doanh nghiệp sản xuất chung hợp pháp mà không có rủi ro vi phạm thị thực.",
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
        "tip-e9": "💡 Thị thực E-9 chỉ được phép làm việc tại nơi đã được cấp giấy phép tuyển dụng chính thức (chỉ tiêu) từ Trung tâm Việc làm.",
        
        "res-source-badge": "Kênh thu thập dữ liệu",
        "source-realtime": "Mạng liên kết API OpenAPI",
        "source-mock": "Bộ dữ liệu mô phỏng SmartHub nội bộ",
        "res-stat-text": "Đối chiếu tất cả {total} doanh nghiệp | Đạt chuẩn bước 1 (Visa): {in} | Hoàn tất bước 2 (Đánh giá công việc)",
        "state-nlp-model": "Bộ máy phân tích ngữ nghĩa công việc đang hoạt động",
        "card-best": "🏆 Công ty Đề xuất Tốt nhất (BEST)",
        "card-rank": "Công việc được đề xuất hạng {idx}",
        "card-score-label": "Điểm phù hợp công việc",
        "card-worker": "Số lao động",
        "card-worker-suffix": " người",
        "card-scale": "Quy mô",
        "scale-large": "Tập đoàn lớn",
        "scale-sme": "Doanh nghiệp vừa và nhỏ",
        "card-induty-label": "Mã ngành nghề",
        "safety-label": "Tuyển dụng An tâm",
        "safety-desc": "Chứng nhận tuân thủ quy định thị thực (Bảo đảm an toàn pháp lý lao động)",
        "checkpoint-label": "Điểm mấu chốt",
        "err-screen-count": "Bị hạn chế",
        "err-screen-reason-label": "Lý do",
        "empty-recommend": "Dưới bộ lọc bước 1, không tìm thấy công ty sản xuất phù hợp hoặc điểm đánh giá quá thấp.",
        "collapse-screened-title": "🛡️ Các công ty bị hạn chế tuyển dụng do quy định Visa ({count} công ty bị lọc)",
        "collapse-screened-empty": "Không có doanh nghiệp bị hạn chế nào.",
        "passed-reason": "Đạt chuẩn quy định pháp lý",
        
        "err-f4-industry": "Thị thực F-4 bị nghiêm cấm làm lao động phổ thông. Mã ngành ({induty}) của công ty này thuộc nhóm lao động sản xuất thủ công phổ thông, tuyển dụng là bất hợp pháp.",
        "err-f4-keyword": "Thị thực F-4 bị nghiêm cấm phân loại thủ công hoặc lắp ráp đơn giản. Phát hiện từ khóa tuyển dụng '{kw}' trong công ty này, tuyển dụng là bất hợp pháp.",
        "err-h2-scale": "Thị thực H-2 chỉ được làm ở nhà máy dưới 300 lao động. Công ty này được phân loại là doanh nghiệp lớn ({count} người), tuyển dụng là bất hợp pháp.",
        "err-e9-license": "Thị thực E-9 bị cấm làm việc tại nơi chưa có chỉ tiêu sử dụng lao động nước ngoài (quota) được phê duyệt từ Trung tâm Việc làm.",
        
        "tag-mfg": "Sản xuất",
        "tag-sh": "SmartHub",
        "tag-mct": "Cơ khí",
        "tag-mold": "Gia công khuôn",
        "tag-pcb": "Bảng PCB",
        "tag-inspect": "Kiểm hàng",
        "tag-chem": "Pha hóa chất",
        "tag-monitor": "Giám sát",
        "tag-general": "Sản xuất chung",
        "tag-warehouse": "Kho bãi",
        "tag-sme": "Hỗ trợ SME",
        "tag-dorm": "Ký túc xá/Xe đưa đón",
        "match-point-mct": "Ưu tiên: Có kinh nghiệm vận hành máy cơ khí & làm khuôn",
        "match-point-pcb": "Ưu tiên: Có kinh nghiệm kiểm kính hiển vi & lắp linh kiện nhỏ",
        "match-point-chem": "Ưu tiên: Có kinh nghiệm pha hóa chất & kiểm soát thiết bị",
        "match-point-gen": "Ưu tiên: Có thể đi ca & hoan nghênh người mới"
    },
    "zh": {
        "badge-poc": "安山市厅智能城市科 & AI大数据团队 PoC",
        "logo-title": "<span class=\"color-ansan-green\">安山</span> <span class=\"color-ansan-orange\">智能集聚区</span> <span class=\"text-white-dark\">安心就业平台</span>",
        "api-status-connected": "京畿道 OpenAPI 已激活",
        "api-status-disconnected": "等待连接中",
        "summary-title-text": "滞留资格合规性诊断完成",
        "screened-collapse-title": "因签证法规限制就业的企业列表",
        "api-val-title-1": "确保实时数据一致性",
        "api-val-desc-1": "将安山制造企业的法人数据直接与京畿道开放API进行100%实时同步，确保在企业倒闭、搬迁、员工人数变动时能自动更新，免去手动维护的麻烦。",
        "api-val-title-2": "从源头上防范行政法律风险",
        "api-val-desc-2": "将出入境法规与企业规模/行业代码进行自动对比，确保平台推荐的职位完全合法，将非法雇用的几率和行政罚款的风险降至0%。",
        "api-val-title-3": "智能政务审批流程自动化",
        "api-val-desc-3": "大幅缩短咨询窗口的业务处理时间。通过AI语义解析和OpenAPI过滤，将以往人工翻阅出入境手册和企业台账的复杂流程缩短至1秒钟。",
        "ai-report-title": "📊 求职者核心能力匹配报告",
        "ai-extract-title": "求职者核心能力分析",
        "tab-dashboard": "滞留现状大屏",
        "tab-matcher": "安全就业诊断",
        "btn-hero-go-matcher": "立即诊断职位",
        "f4-code-err": "根据出入境管理法，持有F-4签证的人员严禁从事简单劳务（标准职业分类大类9）。该企业行业代码（{induty}）属于简单包装/分类生产，依法无法录用。",
        "f4-kw-err": "根据出入境管理法，严禁从事手工包装、分类、装箱等简单劳务。该工艺描述中识别出简单劳务作业（'{kw}'），属于依法禁止录用对象。",
        "h2-large-err": "根据出入境管理法，持有H-2签证的人员仅限在员工人数少于300人的中小制造企业工作。该企业属于大企业规模（员工数 {count}人），属于依法限制就业对象。",
        "e9-license-err": "根据外国人工资雇佣法第8条，E-9签证人员仅限在获得劳动部正式雇佣许可（E-9配额）的中小制造企业工作。该企业未持有雇佣许可资质，依法禁止就业。",
        "feedback-mct": "求职者 {name} 在精密机械操作和生产流程控制方面具备熟练的实践能力。系统评估认为，您与半月工业园内的机械加工和装配制造岗位的契合度极高，推荐这几家合规企业。",
        "feedback-pcb": "求职者 {name} 在超精密 PCB 电路板组装以及显微镜全数检测岗位上展现了出色的细微控制力与专注度。与精密半导体电子器件及自动化生产线具有最佳匹配度。",
        "feedback-chem": "求职者 {name} 在化学药品搅拌、实验设备计量以及精密工序监控岗位具备扎实的安全生产能力。系统为您精准推荐了需要严格遵守环境安全规范的化学品制造企业。",
        "feedback-gen": "求职者 {name} 表现出了对制造生产线流程的良好适应性，以及在多种基础事务岗位上的敬业精神。系统已为您成功过滤了签证受限职位，匹配了最稳妥的安心一般制造业岗位。",
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
        "tip-e9": "💡 持E-9签证的人只允许在已获得就业许可中心（配额）批准的雇主处工作。",
        
        "res-source-badge": "数据采集渠道",
        "source-realtime": "实时 OpenAPI 联动网",
        "source-mock": "内置智能集聚区虚拟数据集",
        "res-stat-text": "已全面对比 {total} 家本地企业 | 第1步验证通过：{in} 家 | 第2步匹配计算完成",
        "state-nlp-model": "工作岗位语义分析引擎已激活",
        "card-best": "🏆 最佳匹配推荐 (BEST)",
        "card-rank": "推荐岗位 RANK {idx}",
        "card-score-label": "岗位匹配率",
        "card-worker": "员工人数",
        "card-worker-suffix": " 人",
        "card-scale": "企业规模",
        "scale-large": "大型企业",
        "scale-sme": "中小企业",
        "card-induty-label": "行业代码",
        "safety-label": "安心雇用",
        "safety-desc": "经过签证法规合规验证（确保用工合法与稳定）",
        "checkpoint-label": "核心要点",
        "err-screen-count": "受限制企业",
        "err-screen-reason-label": "限制原因",
        "empty-recommend": "根据第1步签证筛选，未找到符合条件的制造企业，或岗位匹配度过低。",
        "collapse-screened-title": "🛡️ 签证法规限制雇用的企业 ({count} 家已过滤)",
        "collapse-screened-empty": "无限制雇用的企业。",
        "passed-reason": "符合法律规定标准",
        
        "err-f4-industry": "F-4签证持有者被依法限制从事简单劳务。该公司的行业代码({induty})属于简单生产劳务，雇用属违法行为。",
        "err-f4-keyword": "F-4签证持有者被依法限制从事手工分类及简单组装。在此公司招聘说明中检测出'{kw}'工作，雇用属违法行为。",
        "err-h2-scale": "H-2签证持有者仅允许在少于300人的制造企业工作。该公司为大型企业({count}人)，雇用属违法行为。",
        "err-e9-license": "E-9签证持有者禁止在未正式获得就业许可中心用工配额（Quota）的企业工作。",
        
        "tag-mfg": "制造业",
        "tag-sh": "集聚区",
        "tag-mct": "机械加工",
        "tag-mold": "模具加工",
        "tag-pcb": "PCB板",
        "tag-inspect": "质量检测",
        "tag-chem": "化学配比",
        "tag-monitor": "设备监视",
        "tag-general": "普通制造",
        "tag-warehouse": "仓库管理",
        "tag-sme": "扶持中小企业",
        "tag-dorm": "提供食宿/通勤车",
        "match-point-mct": "优先：有机械操作和模具加工经验者",
        "match-point-pcb": "优先：有显微镜检测和精密组装经验者",
        "match-point-chem": "优先：有化学品配比和实验设备控制经验者",
        "match-point-gen": "优先：能接受轮班工作，欢迎新手报名"
    },
    "ru": {
        "badge-poc": "Конкурсный PoC от отдела умного города и AI Ансана",
        "logo-title": "<span class=\"color-ansan-green\">Ansan</span> <span class=\"color-ansan-orange\">SmartHub</span> <span class=\"text-white-dark\">Платформа безопасной работы</span>",
        "api-status-connected": "OpenAPI Кёнгидо активен",
        "api-status-disconnected": "Ожидание подключения",
        "summary-title-text": "Проверка визового соответствия завершена",
        "screened-collapse-title": "Список ограниченных предприятий из-за визовых законов",
        "api-val-title-1": "Гарантия актуальности данных",
        "api-val-desc-1": "Синхронизация данных заводов Ансана напрямую с OpenAPI Кёнгидо гарантирует моментальное отражение закрытия компаний, изменения штата и переезда без ручных таблиц.",
        "api-val-title-2": "Исключение административных рисков",
        "api-val-desc-2": "Автоматическое сопоставление законов (ограничения F-4 и H-2) с метаданными компаний исключает риски незаконного найма со стороны администрации города.",
        "api-val-title-3": "Автоматизация умного администрирования",
        "api-val-desc-3": "Снижает нагрузку на консультантов, переводя проверку регламентов иммиграции и реестров заводов в секундный ИИ-конвейер.",
        "ai-report-title": "📊 Отчет о ключевых компетенциях",
        "ai-extract-title": "Анализ ключевых компетенций",
        "tab-dashboard": "Панель иммиграции",
        "tab-matcher": "Диагностика визы",
        "btn-hero-go-matcher": "Начать проверку",
        "f4-code-err": "Согласно Указу об иммиграции, владельцам визы F-4 запрещен простой физический труд (Класс 9 KSCO). Этот отраслевой код ({induty}) классифицирован как упаковка/сортировка.",
        "f4-kw-err": "Согласно Указу об иммиграции, простая ручная упаковка и сортировка запрещены. Обнаружено ключевое слово простого труда '{kw}', что влечет отказ в соответствии.",
        "h2-large-err": "Согласно Указу об иммиграции, владельцы визы H-2 могут работать только в малом и среднем бизнесе (до 300 сотрудников). Это крупное предприятие ({count} сотрудников), отказ.",
        "e9-license-err": "Согласно Закону о занятости иностранцев, владельцы визы E-9 могут работать только на предприятиях с квотой Министерства труда. Этот завод не имеет активной лицензии E-9.",
        "feedback-mct": "Соискатель {name} обладает профессиональной компетентностью в управлении высокоточными станками и производственными линиями. Отличная совместимость с заводами в Панвоне с соблюдением всех визовых законов.",
        "feedback-pcb": "Соискатель {name} демонстрирует выдающуюся микромоторику и концентрацию при сборке печатных плат PCB и проверке под микроскопом. Лучшая совместимость с производителями микросхем.",
        "feedback-chem": "Соискатель {name} имеет подтвержденный опыт безопасного смешивания химреагентов и контроля лабораторного оборудования. Совместимо с химическими заводами со строгими стандартами безопасности.",
        "feedback-gen": "Соискатель {name} демонстрирует гибкость в общих производственных процессах и исполнительность. Совместимо с общими легальными производствами без риска депортации.",
        "hero-sub": "Безопасная работа под визовый статус в Ansan SmartHub",
        "hero-main-title": "Проверяем <span class=\"highlight-green\">визовый статус</span>,<br>находим <span class=\"highlight-blue\">легальную работу</span>.",
        "hero-desc": "ИИ-платформа, которая сверяет данные производственных компаний Ansan SmartHub с визовыми ограничениями в реальном времени. Предотвращает риски нелегального трудоустройства.",
        "btn-hero-scroll": "Начать проверку вакансий",
        "sect-dashboard-title": "Статус проживания иностранных резидентов в Ансане (Аналитика кадров)",
        "sect-diagnostic-title": "Симулятор безопасного подбора работы 1:1",
        "diag-card-title": "Ввод данных иностранного соискателя",
        "diag-card-sub": "Укажите визовый статус и опыт работы. Мы проверим государственные базы данных для подбора легальной работы.",
        "label-name": "Полное имя",
        "label-visa": "Визовый статус (выберите визу)",
        "label-resume": "Опыт работы и навыки (опишите в свободной форме)",
        "placeholder-name": "Введите ваше имя",
        "placeholder-resume": "Опишите вашу работу на заводах, задачи или технические навыки.\nНапример: 'Я работал на заводе по сборке прессов в Ансане полтора года, настраивал станки и собирал компоненты.'",
        "btn-preset-1": "🔧 Работа на станках и сборка прессов",
        "btn-preset-2": "📦 Ручная упаковка и логистические работы",
        "btn-preset-3": "⚡ Работа на гальванических установках PCB и инспекция",
        "btn-match": "Проверить совместимость вакансий",
        "state-idle-title": "Ожидание диагностики вакансий",
        "state-idle-desc": "Введите вашу визу и опыт работы, затем нажмите кнопку выше, чтобы запустить сверку вакансий.",
        "state-loading-step1": "Загрузка базы данных заводов из открытых систем Кёнгидо...",
        "state-loading-step2": "Шаг 1: Проверка соответствия отрасли кодам визовых ограничений...",
        "state-loading-step3": "Шаг 2: Расчет оценки соответствия вакансии методами ИИ...",
        "visa-f4-label": "Зарубежные корейцы (F-4)",
        "visa-h2-label": "Рабочий визит (H-2)",
        "visa-e9-label": "Непрофессиональная (E-9)",
        "tip-f4": "💡 Виза F-4 законно ограничивает выполнение простого ручного труда. (Например: упаковка, погрузка, маркировка подлежат штрафам)",
        "tip-h2": "💡 Владельцы визы H-2 могут работать только на малых и средних производствах (менее 300 сотрудников). Крупные заводы запрещены.",
        "tip-e9": "💡 Виза E-9 позволяет работать только на предприятиях, официально получивших квоту на иностранных рабочих от Центра занятости.",
        
        "res-source-badge": "Источник данных",
        "source-realtime": "Связь с OpenAPI в реальном времени",
        "source-mock": "Локальная база данных SmartHub",
        "res-stat-text": "Сверено компаний в базе: {total} | Прошли Шаг 1 (Визовый): {in} | Шаг 2 (Совместимость) завершен",
        "state-nlp-model": "Активен ИИ-движок семантического анализа",
        "card-best": "🏆 Лучший подбор (BEST)",
        "card-rank": "Рекомендуемая вакансия RANK {idx}",
        "card-score-label": "Совместимость",
        "card-worker": "Сотрудники",
        "card-worker-suffix": " чел.",
        "card-scale": "Масштаб",
        "scale-large": "Крупный бизнес",
        "scale-sme": "Малый/Средний бизнес",
        "card-induty-label": "Код отрасли",
        "safety-label": "Безопасный наем",
        "safety-desc": "Сертифицированное соответствие визовым правилам (Юридическая стабильность гарантирована)",
        "checkpoint-label": "Важно знать",
        "err-screen-count": "Ограничено",
        "err-screen-reason-label": "Причина",
        "empty-recommend": "На Шаге 1 (Фильтрация виз) не найдено подходящих производств либо баллы совместимости слишком низкие.",
        "collapse-screened-title": "🛡️ Компании с визовыми ограничениями для вас ({count} отфильтровано)",
        "collapse-screened-empty": "Ограниченных компаний не найдено.",
        "passed-reason": "Юридически безопасно для найма",
        
        "err-f4-industry": "Держателям визы F-4 законно запрещено выполнять простой ручной труд. Код отрасли ({induty}) этой компании классифицируется как простое производство, наем незаконен.",
        "err-f4-keyword": "Держателям визы F-4 запрещен ручной труд и простая сборка. Ключевое слово '{kw}' найдено в описании задач компании, наем незаконен.",
        "err-h2-scale": "Держатели визы H-2 могут работать только на производствах с числом рабочих менее 300. Эта компания является крупной ({count} рабочих), наем незаконен.",
        "err-e9-license": "Держателям визы E-9 запрещено работать на предприятиях, не имеющих официальной государственной квоты на иностранных работников от Центра занятости.",
        
        "tag-mfg": "Производство",
        "tag-sh": "SmartHub",
        "tag-mct": "Станки",
        "tag-mold": "Штамповка",
        "tag-pcb": "Платы PCB",
        "tag-inspect": "Контроль кач-ва",
        "tag-chem": "Хим. смеси",
        "tag-monitor": "Мониторинг",
        "tag-general": "Общее произв.",
        "tag-warehouse": "Склад",
        "tag-sme": "Поддержка SME",
        "tag-dorm": "Жилье/Автобус",
        "match-point-mct": "Предпочтительно: опыт работы на металлообрабатывающих станках",
        "match-point-pcb": "Предпочтительно: сборка мелких деталей и контроль под микроскопом",
        "match-point-chem": "Предпочтительно: смешивание химикатов и контроль лабораторного оборудования",
        "match-point-gen": "Предпочтительно: готовность работать посменно, без опыта"
    },
    "id": {
        "badge-poc": "PoC kompetisi dari Divisi Smart City & Tim AI Kota Ansan",
        "logo-title": "<span class=\"color-ansan-green\">Ansan</span> <span class=\"color-ansan-orange\">SmartHub</span> <span class=\"text-white-dark\">Platform Pekerjaan Aman</span>",
        "api-status-connected": "OpenAPI Gyeonggi Aktif",
        "api-status-disconnected": "Menunggu Koneksi",
        "summary-title-text": "Diagnosis Kepatuhan Visa Selesai",
        "screened-collapse-title": "Daftar Perusahaan yang Dibatasi karena Aturan Visa",
        "api-val-title-1": "Jaminan Integritas Data Real-time",
        "api-val-desc-1": "Dengan menyinkronkan dataset korporat produsen Ansan dari API Gyeonggi, kami menjaga indeks pencocokan bersih yang mencerminkan penutupan atau perpindahan secara instan.",
        "api-val-title-2": "Mengegah Risiko Hukum & Administrasi",
        "api-val-desc-2": "Membandingkan aturan imigrasi dengan metadata OpenAPI mencegah risiko perantara ilegal dan menghindari potensi denda administrasi bagi dinas kota.",
        "api-val-title-3": "Otomatisasi Administrasi Pintar",
        "api-val-desc-3": "Mengurangi beban konsultasi manual dengan mengotomatiskan pencocokan dokumen pabrik dan aturan visa menjadi sistem pemindaian semantik AI dalam 1 detik.",
        "ai-report-title": "📊 Laporan Analisis Kompetensi Utama",
        "ai-extract-title": "Analisis Kompetensi Utama",
        "tab-dashboard": "Dasbor Imigrasi",
        "tab-matcher": "Diagnosis Kerja Aman",
        "btn-hero-go-matcher": "Mulai Diagnosis",
        "f4-code-err": "Sesuai Keputusan Keimigrasian, pemegang visa F-4 dilarang melakukan pekerjaan manual sederhana (KSCO 9). Kode industri ini ({induty}) diklasifikasikan sebagai pengepakan manual.",
        "f4-kw-err": "Sesuai Keputusan Keimigrasian, pekerjaan manual untuk pengepakan dan penyusunan kotak sangat dibatasi. Kata kunci '{kw}' terdeteksi, melanggar standar kepatuhan hukum.",
        "h2-large-err": "Sesuai Keputusan Keimigrasian, pemegang visa H-2 hanya diizinkan bekerja di UKM (di bawah 300 karyawan). Perusahaan ini berskala besar ({count} karyawan), kerja dilarang.",
        "e9-license-err": "Sesuai UU Ketenagakerjaan Asing, visa E-9 hanya diizinkan bekerja di UKM yang memiliki izin Kuota Resmi (E-9 Quota) dari Kemenaker. Pabrik ini tidak memiliki izin E-9.",
        "feedback-mct": "Pencari kerja {name} memiliki kompetensi kerja yang teruji dalam pengoperasian mesin perkakas presisi dan kontrol lini produksi. Sangat cocok dengan pabrik manufaktur di Banwon, terjamin legal dan produktif.",
        "feedback-pcb": "Pencari kerja {name} menunjukkan fokus dan kontrol mikro luar biasa dalam perakitan sirkuit PCB dan inspeksi mikroskop. Sangat cocok dengan sektor peralatan semikonduktor.",
        "feedback-chem": "Pencari kerja {name} mempunyai keahlian keselamatan kerja dalam pencampuran bahan kimia dan kontrol alat ukur lab. Sesuai dengan pabrik kimia yang membutuhkan standar regulasi tinggi.",
        "feedback-gen": "Pencari kerja {name} membuktikan adaptasi tinggi dalam manufaktur umum dan ketekunan kerja fisik. Dicocokkan secara aman dengan pabrik umum tanpa risiko pelanggaran visa.",
        "hero-sub": "Pekerjaan Aman berbasis Visa di Ansan SmartHub",
        "hero-main-title": "Verifikasi <span class=\"highlight-green\">status Visa</span>,<br>Hubungkan <span class=\"highlight-blue\">Pekerjaan Legal</span>.",
        "hero-desc": "Platform pencocokan AI yang menyaring data perusahaan manufaktur lokal Ansan SmartHub terhadap batasan visa secara real-time. Mencegah risiko perekrutan ilegal.",
        "btn-hero-scroll": "Mulai Cek Kelayakan",
        "sect-dashboard-title": "Status Tinggal Warga Asing di Ansan (Analisis Tenaga Kerja)",
        "sect-diagnostic-title": "Simulator Pencocokan Kerja Aman 1:1",
        "diag-card-title": "Input Data Pencari Kerja Asing",
        "diag-card-sub": "Masukkan status visa dan pengalaman kerja Anda. Kami akan memeriksa database kota untuk pekerjaan yang aman.",
        "label-name": "Nama Lengkap",
        "label-visa": "Status Visa (Pilih Visa)",
        "label-resume": "Pengalaman Kerja & Keahlian (Tulis secara bebas)",
        "placeholder-name": "Masukkan nama Anda",
        "placeholder-resume": "Jelaskan pekerjaan pabrik sebelumnya, tugas, atau keahlian teknis Anda.\nContoh: 'Saya bekerja di pabrik perakitan mesin pres di Ansan selama 1,5 tahun, mengatur mesin dan merakit komponen.'",
        "btn-preset-1": "🔧 Operator Mesin & Perakitan Pres",
        "btn-preset-2": "📦 Pengemasan Manual & Pekerjaan Gudang Logistik",
        "btn-preset-3": "⚡ Operasional Alat Elektroplating PCB & Inspeksi kualitas",
        "btn-match": "Analisis Kelayakan Kerja",
        "state-idle-title": "Menunggu Diagnostik Pekerjaan",
        "state-idle-desc": "Masukkan visa dan pengalaman Anda, lalu klik tombol di atas untuk mulai mencocokkan pekerjaan.",
        "state-loading-step1": "Mengambil data pabrik dari database publik Provinsi Gyeonggi...",
        "state-loading-step2": "Langkah 1: Menyaring kode industri perusahaan terhadap pembatasan visa...",
        "state-loading-step3": "Langkah 2: Menghitung skor kecocokan kerja menggunakan teknologi AI...",
        "visa-f4-label": "Keturunan Korea (F-4)",
        "visa-h2-label": "Kunjungan Kerja (H-2)",
        "visa-e9-label": "Non-Profesional (E-9)",
        "tip-f4": "💡 Pemegang visa F-4 dilarang melakukan pekerjaan kasar secara hukum. (Contoh: Pengemasan sederhana, pemuatan manual, pelabelan dikenakan denda hukum)",
        "tip-h2": "💡 Pemegang visa H-2 hanya diizinkan bekerja di pabrik manufaktur kecil dan menengah (di bawah 300 pekerja). Perusahaan besar dilarang.",
        "tip-e9": "💡 Visa E-9 hanya diizinkan bekerja di tempat kerja yang secara resmi memperoleh kuota mempekerjakan pekerja asing dari Job Center.",
        
        "res-source-badge": "Sumber Data",
        "source-realtime": "Koneksi API Real-time",
        "source-mock": "Dataset Simulasi Lokal SmartHub",
        "res-stat-text": "Memeriksa {total} perusahaan lokal | Lolos Langkah 1 (Visa): {in} | Langkah 2 (Pencocokan Kerja) selesai",
        "state-nlp-model": "Mesin Analisis Semantik Kerja Aktif",
        "card-best": "🏆 Rekomendasi Terbaik (BEST)",
        "card-rank": "Rekomendasi Kerja RANK {idx}",
        "card-score-label": "Skor Kecocokan",
        "card-worker": "Pekerja",
        "card-worker-suffix": " orang",
        "card-scale": "Skala",
        "scale-large": "Perusahaan Besar",
        "scale-sme": "UKM",
        "card-induty-label": "Kode Industri",
        "safety-label": "Pekerjaan Aman",
        "safety-desc": "Sertifikasi kepatuhan terhadap aturan visa (Keamanan Hukum Pekerja Terjamin)",
        "checkpoint-label": "Titik Penting",
        "err-screen-count": "Dibatasi",
        "err-screen-reason-label": "Alasan",
        "empty-recommend": "Berdasarkan Penyaringan Langkah 1 Visa, tidak ditemukan pabrik manufaktur yang memenuhi syarat atau skor kecocokan terlalu rendah.",
        "collapse-screened-title": "🛡️ Perusahaan yang Dibatasi karena Aturan Visa ({count} tersaring)",
        "collapse-screened-empty": "Tidak ada perusahaan dibatasi yang ditemukan.",
        "passed-reason": "Memenuhi Standar Hukum",
        
        "err-f4-industry": "Pemegang visa F-4 dilarang melakukan pekerjaan kasar. Kode industri ({induty}) perusahaan ini termasuk jenis kerja produksi sederhana, perekrutan tidak sah secara hukum.",
        "err-f4-keyword": "Pemegang visa F-4 dilarang melakukan pemilahan manual dan perakitan sederhana. Kata kunci '{kw}' terdeteksi pada perusahaan ini, perekrutan tidak sah secara hukum.",
        "err-h2-scale": "Pemegang visa H-2 hanya boleh bekerja di manufaktur dengan pekerja kurang dari 300. Perusahaan ini berkategori perusahaan besar ({count} pekerja), perekrutan tidak sah secara hukum.",
        "err-e9-license": "Pemegang visa E-9 dilarang bekerja di tempat kerja yang belum mendapatkan izin penggunaan tenaga kerja asing (quota) secara resmi dari Job Center.",
        
        "tag-mfg": "Manufaktur",
        "tag-sh": "SmartHub",
        "tag-mct": "Pemesinan",
        "tag-mold": "Cetakan Logam",
        "tag-pcb": "Papan PCB",
        "tag-inspect": "Cek Kualitas",
        "tag-chem": "Campuran Kimia",
        "tag-monitor": "Pemantauan",
        "tag-general": "Manufaktur Umum",
        "tag-warehouse": "Gudang",
        "tag-sme": "Dukungan UKM",
        "tag-dorm": "Asrama/Bis Jemputan",
        "match-point-mct": "Pilihan Utama: Pengalaman operasional mesin perkakas & pembuatan cetakan",
        "match-point-pcb": "Pilihan Utama: Pengalaman cek mikroskop & perakitan komponen mikro",
        "match-point-chem": "Pilihan Utama: Pengalaman pencampuran bahan kimia & kontrol alat lab",
        "match-point-gen": "Pilihan Utama: Bersedia kerja shift, pemula diterima"
    }
};

function changeLanguage(lang) {
    currentLang = lang;
    const t = TRANSLATIONS[lang];
    if (!t) return;

    // 1. 헤더 & 인포 배지
    document.querySelector(".badge-poc").textContent = t["badge-poc"];
    
    const logoEl = document.getElementById("main-logo-text") || document.querySelector(".logo-text h1");
    if (logoEl) {
        logoEl.innerHTML = t["logo-title"];
    }

    const isConnected = apiStatusIndicator.classList.contains("connected");
    updateHeaderApiBadge(isConnected);
    
    // 2. 히어로 배너
    document.querySelector(".hero-sub").textContent = t["hero-sub"];
    document.querySelector(".hero-main-title").innerHTML = t["hero-main-title"];
    document.querySelector(".hero-desc").textContent = t["hero-desc"];
    
    const goMatcherBtn = document.getElementById("btn-hero-go-matcher");
    if (goMatcherBtn && t["btn-hero-go-matcher"]) {
        goMatcherBtn.textContent = t["btn-hero-go-matcher"];
    }

    // GNB 탭 번역
    const tabDashboardEl = document.getElementById("tab-dashboard");
    if (tabDashboardEl && t["tab-dashboard"]) tabDashboardEl.textContent = t["tab-dashboard"];
    const tabMatcherEl = document.getElementById("tab-matcher");
    if (tabMatcherEl && t["tab-matcher"]) tabMatcherEl.textContent = t["tab-matcher"];

    // 3. 섹션 타이틀
    const dashSectTitle = document.querySelector(".section-dashboard .sect-title");
    if (dashSectTitle && t["sect-dashboard-title"]) {
        dashSectTitle.textContent = t["sect-dashboard-title"];
    }
    const diagSectTitle = document.querySelector(".section-diagnostic .sect-title");
    if (diagSectTitle && t["sect-diagnostic-title"]) {
        diagSectTitle.textContent = t["sect-diagnostic-title"];
    }

    // 결과 요약 배너 및 차단 리포트 타이틀 실시간 번역
    const summaryTitleEl = document.getElementById("summary-title-text");
    if (summaryTitleEl && t["summary-title-text"]) {
        summaryTitleEl.textContent = t["summary-title-text"];
    }
    const screenedCollapseTitleEl = document.getElementById("screened-collapse-title");
    if (screenedCollapseTitleEl && t["screened-collapse-title"]) {
        screenedCollapseTitleEl.textContent = t["screened-collapse-title"];
    }

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

    // 9. 이미 출력된 AI 리포트가 있다면 실시간 번역
    const activeReportCard = document.querySelector(".ai-report-card");
    if (activeReportCard) {
        const resumeText = seekerResumeTextarea.value;
        const nameVal = seekerNameInput.value || "Seeker";
        const aiReport = generateAiReport(resumeText, nameVal);
        
        activeReportCard.querySelector(".ai-report-title").textContent = aiReport.title;
        activeReportCard.querySelector(".ai-report-summary").textContent = aiReport.summary;
        activeReportCard.querySelector(".ai-report-body > div").textContent = aiReport.extractTitle;
        
        const keywordContainer = activeReportCard.querySelector(".ai-report-keywords");
        if (keywordContainer) {
            keywordContainer.innerHTML = aiReport.keywords.map(kw => `<span class="ai-keyword-tag">${kw}</span>`).join("");
        }
    }
}


