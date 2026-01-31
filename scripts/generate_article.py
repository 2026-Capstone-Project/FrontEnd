import os
import sys
from github import Github, Auth
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime, timedelta, timezone

# .env 로드 (로컬 테스트용)
load_dotenv()

# 환경 변수 검증 (Copilot 피드백 반영)
GH_TOKEN = os.getenv('GH_TOKEN')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
REPO_NAME = os.getenv('REPO_NAME', "2026-Capstone-Project/FrontEnd")

if not GH_TOKEN or not GEMINI_API_KEY:
    print("Error: 필수 환경 변수(GH_TOKEN, GEMINI_API_KEY)가 설정되지 않았습니다.", file=sys.stderr)
    sys.exit(1)

genai.configure(api_key=GEMINI_API_KEY)

def get_today_work():
    try:
        auth = Auth.Token(GH_TOKEN)
        g = Github(auth=auth)
        repo = g.get_repo(REPO_NAME)
        
        kst = timezone(timedelta(hours=9))
        since = datetime.now(kst) - timedelta(days=1)
        
        # 성능 최적화: 모든 브랜치가 아닌 최근 활동 브랜치 위주 (필요시 리스트 수정)
        branches = repo.get_branches()
        work_details = ""
        seen_commits = set()
        
        for branch in branches:
            # API 레이트 리밋 방지를 위해 간단한 예외 처리 포함
            commits = repo.get_commits(since=since, sha=branch.name)
            if commits.totalCount == 0:
                continue
                
            work_details += f"\n## 🌿 Branch: {branch.name}\n"
            for commit in commits:
                if commit.sha in seen_commits:
                    continue
                seen_commits.add(commit.sha)
                
                author = commit.commit.author.name
                message = commit.commit.message
                
                # 보안: 메시지에 포함된 민감 정보 노출 방지 (간단한 필터링)
                low_message = message.lower()
                if any(secret in low_message for secret in ['api_key', 'password', 'secret', 'token']):
                    message = "[보안을 위해 생략된 메시지]"

                work_details += f"\n### [{author}] {message}\n"
                
                for file in commit.files:
                    # 불필요한 파일 제외
                    if any(x in file.filename for x in ['package-lock.json', 'yarn.lock', 'node_modules', '.env']):
                        continue
                    if file.patch:
                        # Diff 길이 제한 (토큰 절약 및 보안)
                        work_details += f"- **{file.filename}** 변경:\n  ```diff\n  {file.patch[:500]}\n  ```\n"
        
        return work_details.strip()
    except Exception as e:
        print(f"GitHub API Error: {e}", file=sys.stderr)
        return ""

def create_article(work_details):
    if not work_details:
        return "오늘은 업데이트된 작업이 없습니다. 내일 더 파이팅해봐요! 🚀"

    kst = timezone(timedelta(hours=9))
    today_str = datetime.now(kst).strftime('%Y년 %m월 %d일')

    # 모델명 명시화 (Copilot 피드백: gemini-1.5-flash 권장)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = f"""
    팀 "Calio"의 시니어 개발자로서 오늘({today_str})의 개발 일지를 작성하라.

    [작업 데이터]
    {work_details}

    [필수 규칙]
    1. 제목 포맷: 반드시 "[{today_str}] 오늘의 핵심 요약 제목"으로 작성할 것.
    2. 서두에 팀 "Calio"의 전체적인 오늘 진행 상황을 요약할 것.
    3. 각 커밋 작성자의 이름을 언급하며 기술적으로 분석할 것.
    4. 코드 변경점은 마크다운 코드 블록으로 감싸줄 것.
    5. 너가 AI라거나 누구인지는 절대 밝히지 말 것.
    6. 반드시 한국어로 작성할 것.
    7. 브랜치 단위로 구분하여 작성하고, 코드 변경점은 마크다운 코드 블록으로 감싸줘.
    """
    
    try:
        response = model.generate_content(prompt, generation_config={"temperature": 0.5})
        if not response or not hasattr(response, "text"):
            raise ValueError("API로부터 유효한 응답을 받지 못했습니다.")
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}", file=sys.stderr)
        return f"오늘의 개발 일지 생성 중 오류가 발생했습니다. (에러: {str(e)})"

if __name__ == "__main__":
    log_data = get_today_work()
    article = create_article(log_data)
    
    try:
        os.makedirs("articles", exist_ok=True)
        filename = datetime.now(timezone(timedelta(hours=9))).strftime('%Y-%m-%d')
        with open(f"articles/{filename}.md", "w", encoding="utf-8") as f:
            f.write(article)
    except IOError as e:
        print(f"File Write Error: {e}", file=sys.stderr)
        sys.exit(1)