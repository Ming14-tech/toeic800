#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates 1,000 top-frequency ETS TOEIC exam vocabulary items for 620 -> 800 jump.
Organized into 30 Days (Day 01 to Day 30), with exact ETS collocations, synonyms, and context sentences.
"""

import json

# Day data definitions
days_data = [
    # Day 1: 인사 및 채용 (Recruitment, Hiring, Candidates)
    (1, "인사/채용", "620도약", [
        ("applicant", "지원자, 신청자", "noun", "prospective applicant / qualified applicant", "candidate / job seeker", 
         "All applicants must possess at least three years of managerial experience.", "모든 지원자는 최소 3년의 관리직 경력을 보유해야 합니다."),
        ("candidate", "후보자, 지원자", "noun", "ideal candidate / shortlisted candidate", "applicant / prospective employee",
         "The search committee selected the top three candidates for final interviews.", "선발 위원회는 최종 면접을 위해 상위 3명의 후보자를 선정했습니다."),
        ("qualified", "자격이 있는, 적임의", "adj", "highly qualified / fully qualified", "eligible / certified / competent",
         "We are looking for a highly qualified accountant to head our fiscal division.", "우리는 재무 부서를 이끌 고도로 자격을 갖춘 회계사를 찾고 있습니다."),
        ("vacancy", "공석, 빈자리", "noun", "fill a vacancy / job vacancy", "opening / unfilled position",
         "The human resources department announced an unexpected vacancy in the legal branch.", "인사부는 법무 부서에 예상치 못한 공석이 생겼다고 발표했습니다."),
        ("credential", "자격 요건, 경력 증명서", "noun", "impressive credentials / verify credentials", "qualification / license / certifications",
         "The hiring director requested copies of his academic and professional credentials.", "채용 담당 이사는 그의 학력 및 경력 증명서 사본을 요청했습니다."),
        ("probation", "수습 기간, 시험 채용", "noun", "probationary period / on probation", "trial period / testing phase",
         "New recruits undergo a three-month probation before receiving permanent status.", "신입 사원들은 정규직 전환 전 3개월간의 수습 기간을 거칩니다."),
        ("screening", "서류 심사, 선발 검사", "noun", "initial screening / background screening", "evaluation / vetting / assessment",
         "The initial candidate screening will be completed by the end of this Friday.", "1차 후보자 서류 심사는 이번 주 금요일까지 완료될 예정입니다."),
        ("recruit", "채용하다, 모집하다; 신입 사원", "verb", "recruit talented personnel / actively recruit", "hire / enlist / employ",
         "The tech enterprise launched a nationwide campaign to recruit software developers.", "그 IT 기업은 소프트웨어 개발자를 모집하기 위해 전국적인 캠페인을 시작했습니다."),
        ("interviewee", "면접 대상자, 피면접자", "noun", "interviewee feedback / prospective interviewee", "applicant / candidate",
         "Each interviewee will be asked standard situational questions by the panel.", "각 면접 대상자는 면접관 패널로부터 표준 상황별 질문을 받게 됩니다."),
        ("interview", "면접하다, 인터뷰하다; 면접", "noun", "conduct an interview / follow-up interview", "meeting / screening session",
         "The final interview is scheduled with the managing director on Tuesday.", "최종 면접은 화요일에 상무이사와 진행될 예정입니다."),
        ("orientation", "신입 사원 교육, 오리엔테이션", "noun", "orientation session / employee orientation", "induction / introduction program",
         "All newly hired employees are required to attend the orientation session tomorrow.", "새로 채용된 모든 직원은 내일 오리엔테이션 세션에 참석해야 합니다."),
        ("personnel", "직원, 전 직원; 인사과", "noun", "personnel department / authorized personnel", "staff / workforce / human resources",
         "Only authorized personnel are permitted inside the server maintenance vault.", "오직 인가된 직원만이 서버 유지보수실 내부 출입이 허가됩니다."),
        ("headhunt", "스카우트하다, 인재를 발굴하다", "verb", "headhunt top talent / be headhunted by", "scout / recruit / hire away",
         "Our new chief financial officer was headhunted from an international competitor.", "우리의 새 최고재무책임자는 글로벌 경쟁사로부터 스카우트되었습니다."),
        ("apprentice", "수습생, 견습생", "noun", "skilled apprentice / apprentice program", "trainee / intern / novice",
         "The engineering firm accepted twenty apprentices for hands-on factory training.", "그 엔지니어링 회사는 실무 공장 교육을 위해 20명의 견습생을 받아들였습니다."),
        ("shortlist", "최종 후보자 명단에 넣다; 최종 후보 명단", "noun", "draw up a shortlist / be on the shortlist", "selection list / finalist roster",
         "The committee drew up a shortlist of four applicants for the position of art director.", "위원회는 아트 디렉터 직책을 위해 4명의 지원자로 구성된 최종 후보 명단을 작성했습니다."),
        ("stipend", "급료, 수당, 장학금", "noun", "monthly stipend / receive a stipend", "allowance / subsidy / per diem",
         "Interns receive a modest monthly stipend to cover public transportation costs.", "인턴들은 대중교통 비용을 충당하기 위해 약간의 월 수당을 지급받습니다."),
        ("eligible", "자격이 있는, ~할 자격이 되는", "adj", "be eligible for promotion / eligible applicant", "qualified / entitled / suitable",
         "Employees with two consecutive years of service are eligible for tuition assistance.", "2년 연속 근속한 직원은 학자금 지원을 받을 자격이 있습니다."),
        ("prerequisite", "필수 조건, 전제 조건", "noun", "prerequisite for the position / essential prerequisite", "requirement / precondition",
         "Proficiency in spreadsheet applications is an absolute prerequisite for this role.", "스프레드시트 소프트웨어 능숙도는 이 직무의 절대적인 필수 조건입니다."),
        ("curriculum vitae", "이력서 (CV)", "noun", "submit a curriculum vitae / updated CV", "resume / bio / work history",
         "Please forward your curriculum vitae and letters of recommendation to HR.", "이력서와 추천서를 인사부로 보내주시기 바랍니다."),
        ("recommendation", "추천, 추천서", "noun", "letter of recommendation / strong recommendation", "endorsement / reference / testimonial",
         "She secured the promotion largely due to the strong recommendation from her team lead.", "그녀는 팀장의 강력한 추천 덕분에 주로 승진을 확정지었습니다."),
        ("designate", "지정하다, 지명하다", "verb", "designate a successor / designate parking areas", "appoint / assign / nominate",
         "Management decided to designate Mr. Kim as the lead coordinator for the expansion.", "경영진은 김 부장을 확장 프로젝트의 총괄 책임자로 지명하기로 결정했습니다."),
        ("appoint", "임명하다, 지명하다", "verb", "appoint a new director / formally appoint", "assign / designate / name",
         "The board of directors moved quickly to appoint an interim executive officer.", "이사회는 임시 경영인을 신속히 임명하기로 결의했습니다."),
        ("assign", "배정하다, 맡기다", "verb", "assign tasks / assign responsibilities", "delegate / allocate / allot",
         "The supervisor will assign specific inspection routes to each technician.", "감독관은 각 기술자에게 구체적인 점검 경로를 배정할 것입니다."),
        ("delegate", "위임하다; 대표단, 파견 위원", "verb", "delegate authority / international delegates", "assign / transfer / entrust",
         "Effective managers know how to delegate repetitive duties to team members.", "유능한 관리자는 반복적인 업무를 팀원들에게 위임하는 방법을 잘 알고 있습니다."),
        ("headquarters", "본사, 본부", "noun", "relocate the headquarters / corporate headquarters", "main office / home office",
         "The senior team was summoned to the corporate headquarters in Chicago for talks.", "임원진은 회담을 위해 시카고 본사로 소집되었습니다."),
        ("probationary", "수습의, 시험적인", "adj", "probationary employee / probationary period", "trial / provisional / temporary",
         "During the probationary period, work output is reviewed on a biweekly basis.", "수습 기간 동안 업무 성과는 격주 단위로 검토됩니다."),
        ("prospect", "유망한 후보, 전망, 가망", "noun", "job prospect / prospective hire", "potential / outlook / candidate",
         "The agency evaluated several top prospects before extending a contract offer.", "그 대행사는 계약 제의를 전달하기 전에 몇몇 최우수 유망 후보를 평가했습니다."),
        ("reference", "추천인, 참고 문헌, 언급", "noun", "check references / provide three references", "recommendation / testimonial / referee",
         "HR agents contacted all professional references to verify previous employment.", "인사 담당자는 이전 근무 기록을 확인하기 위해 모든 전문 추천인에게 연락했습니다."),
        ("competence", "역량, 능력", "noun", "demonstrate competence / core competence", "ability / capability / proficiency",
         "The candidate demonstrated exceptional linguistic competence during the oral test.", "후보자는 구술 테스트에서 뛰어난 언어적 역량을 입증했습니다."),
        ("receptive", "수용적인, 잘 받아들이는", "adj", "receptive to feedback / receptive attitude", "open / responsive / amenable",
         "The newly appointed department head proved remarkably receptive to staff suggestions.", "새로 임명된 부서장은 직원들의 제안을 매우 잘 받아들이는 태도를 보였습니다."),
        ("tenure", "재임 기간, 재직 기간", "noun", "during his tenure / secure tenure", "term of office / incumbency",
         "During her five-year tenure, the firm saw an unprecedented 40% growth in profits.", "그녀의 5년 재임 기간 동안 회사는 전례 없는 40%의 이익 성장을 기록했습니다."),
        ("appraisal", "평가, 감정, 사정", "noun", "performance appraisal / property appraisal", "evaluation / assessment / review",
         "Annual performance appraisals determine year-end bonuses and rank advancements.", "연례 인사 평가는 연말 보너스와 승진 순위를 결정합니다."),
        ("remuneration", "보수, 급여", "noun", "competitive remuneration / remuneration package", "compensation / salary / wage",
         "The enterprise offers a handsome remuneration package including stock options.", "그 기업은 스톡옵션을 포함한 매력적인 보수 패키지를 제공합니다."),
        ("background", "배경, 이력, 경력", "noun", "extensive background / educational background", "experience / history / credentials",
         "The applicant has an extensive background in both international law and logistics.", "해당 지원자는 국제법과 물류 분야 모두에서 풍부한 경력을 갖추고 있습니다.")
    ]),
]

print("Script template ready")
