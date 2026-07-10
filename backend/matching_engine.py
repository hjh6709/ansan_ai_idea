# -*- coding: utf-8 -*-
import os
import re
import traceback

# sentence-transformers 및 torch 로딩 시도 (컴파일 이슈나 패키지 부재 시 Fallback)
AI_MODEL_AVAILABLE = False
model = None

try:
    from sentence_transformers import SentenceTransformer, util
    # 한국어 임베딩 성능이 우수한 모델 사용
    MODEL_NAME = 'jhgan/ko-sroberta-multitask'
    print(f"Loading Sentence-BERT Model ({MODEL_NAME})... This may take a while on first run.")
    model = SentenceTransformer(MODEL_NAME)
    AI_MODEL_AVAILABLE = True
    print("Sentence-BERT model loaded successfully.")
except Exception as e:
    print(f"WARNING: SentenceTransformer load failed: {str(e)}")
    print("Falling back to lexical & fuzzy matching engine for demonstration.")

from mock_data import VISA_RULES

def check_visa_regulation(company, visa_type):
    """
    1단계: 법적 규제 스크리닝 (Rule-based Filter)
    비자 자격별 법적 제한 사유를 검토하여 불법 고용 리스크를 사전 차단합니다.
    """
    rule = VISA_RULES.get(visa_type)
    if not rule:
        return {"passed": True, "reason": "비자 규제 스크리닝 예외 대상 (통과)"}

    # 1. F-4 비자: 단순노무행위 취업 제한
    if visa_type == "F-4":
        # 산업코드 대조
        industry_cd = company.get("INDUTY_CD", "")
        if industry_cd in rule["code_blacklist"]:
            return {
                "passed": False,
                "reason": f"F-4(재외동포) 비자는 법령상 단순노무 직종 취업이 제한됩니다. 해당 기업의 주요 업종({industry_cd})은 단순노무 성격으로 분류되어 채용이 불가합니다."
            }
        
        # 텍스트 내 블랙리스트 키워드 스크리닝
        product_desc = company.get("PRDCT_DESC", "")
        for kw in rule["keywords_blacklist"]:
            if kw in product_desc:
                return {
                    "passed": False,
                    "reason": f"F-4(재외동포) 비자는 단순노무행위가 제한됩니다. 이 기업의 주요 직무('{kw}')는 법령상 단순노무로 식별되어 채용이 불가합니다."
                }

    # 2. H-2 비자: 중소기업 제조업 한정 허용
    elif visa_type == "H-2":
        scale = company.get("COMPANY_SCALE", "중소기업")
        employee_count = company.get("EMPLOYEE_COUNT", 0)
        
        if scale == "대기업" or employee_count >= rule["max_employee_limit"]:
            return {
                "passed": False,
                "reason": f"H-2(방문취업) 비자는 상시근로자 300인 미만 중소기업에 한해 취업이 가능합니다. 이 기업은 {scale}(근로자 {employee_count}명)로 분류되어 법적으로 고용이 제한됩니다."
            }

    # 3. E-9 비자: 외국인 고용허가제 필수
    elif visa_type == "E-9":
        has_license = company.get("E9_FOREIGN_LICENSE", False)
        if not has_license:
            return {
                "passed": False,
                "reason": "E-9(비전문취업) 비자는 관할 고용센터의 외국인 고용허가(E-9 쿼터)를 취득하지 않은 기업에 근무하는 것이 법적으로 금지됩니다."
            }

    return {"passed": True, "reason": "법적 고용 기준 충족 (적합 사업장)"}


def calculate_jaccard_similarity(str1, str2):
    """
    Ko-sRoBERTa 미설치 시 작동할 Fallback 토큰 Jaccard 유사도 계산 엔진.
    간단한 한국어 형태소 분리(공백 및 정규식)를 수행하여 단어 매칭율을 계산합니다.
    """
    # 불필요한 특수문자 제거 및 토큰화
    def tokenize(text):
        text = re.sub(r'[^가-힣a-zA-Z0-9\s]', '', text)
        return set(word for word in text.split() if len(word) > 1)

    words1 = tokenize(str1)
    words2 = tokenize(str2)
    
    if not words1 or not words2:
        return 0.0
        
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    # 공통 단어 가중치 및 부분 매칭 가중치 부여
    score = len(intersection) / len(union)
    
    # 단어 부분 매칭 보정 (자소 기반 유사도는 아니지만 최소한의 겹침 보정)
    partial_match = 0
    for w1 in words1:
        for w2 in words2:
            if w1 != w2 and (w1 in w2 or w2 in w1):
                partial_match += 0.5
                
    adjusted_score = min(1.0, score + (partial_match / (len(words1) + len(words2))))
    return adjusted_score


def match_companies(resume_text, companies, visa_type):
    """
    2단계 하이브리드 매칭 파이프라인
    1단계: 법적 규제 스크리닝 필터
    2단계: 문맥 유사도 매칭 수행 후 정렬
    """
    screened_out = []
    screened_in = []

    # 1단계: 법적 규제 스크리닝
    for company in companies:
        regulation_check = check_visa_regulation(company, visa_type)
        if regulation_check["passed"]:
            screened_in.append(company)
        else:
            company_copy = company.copy()
            company_copy["screen_reason"] = regulation_check["reason"]
            screened_out.append(company_copy)

    results = []

    # 2단계: 문맥 유사도 매칭 (Sentence-BERT 또는 Fallback)
    if screened_in:
        descriptions = [c["PRDCT_DESC"] for c in screened_in]
        
        if AI_MODEL_AVAILABLE and model is not None:
            try:
                # 문장 벡터 임베딩 생성
                resume_embedding = model.encode(resume_text, convert_to_tensor=True)
                desc_embeddings = model.encode(descriptions, convert_to_tensor=True)
                
                # 코사인 유사도 계산
                cos_scores = util.cos_sim(resume_embedding, desc_embeddings)[0]
                
                for idx, company in enumerate(screened_in):
                    score = float(cos_scores[idx])
                    # 코사인 유사도 범위 (-1 ~ 1)를 0 ~ 100% 스케일로 변환
                    match_percentage = round((score + 1.0) / 2.0 * 100.0, 1)
                    
                    company_res = company.copy()
                    company_res["match_score"] = match_percentage
                    company_res["matching_type"] = "Sentence-BERT (AI)"
                    results.append(company_res)
            except Exception as ex:
                print(f"Error during Sentence-BERT inference: {str(ex)}")
                # 에러 발생 시 Fallback으로 전환
                results = fallback_match(resume_text, screened_in)
        else:
            # Fallback 엔진 작동
            results = fallback_match(resume_text, screened_in)

        # 유사도 점수 기준 내림차순 정렬
        results.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "recommended": results[:3],       # TOP 3 추천 기업
        "all_passed": results,            # 통과한 모든 기업
        "screened_out": screened_out,     # 법적으로 차단된 기업 리스트
        "ai_active": AI_MODEL_AVAILABLE
    }

def fallback_match(resume_text, companies):
    """
    Ko-sRoBERTa 모델 미사용 시 작동하는 어휘 및 맥락 매칭 Fallback
    """
    results = []
    for company in companies:
        jaccard = calculate_jaccard_similarity(resume_text, company["PRDCT_DESC"])
        
        # 키워드 매칭 기본 스코어 보정 (10% ~ 95% 사이 매핑)
        match_percentage = round(10.0 + (jaccard * 85.0), 1)
        
        # 만약 매칭 단어가 전혀 없더라도 단순 매치 보정
        company_res = company.copy()
        company_res["match_score"] = match_percentage
        company_res["matching_type"] = "Lexical-Overlap (Fallback)"
        results.append(company_res)
    return results
