import os
import sys
from github import Github, Auth
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime, timedelta, timezone

load_dotenv()

GH_TOKEN = os.getenv('GH_TOKEN')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
REPO_NAME = "2026-Capstone-Project/FrontEnd"

genai.configure(api_key=GEMINI_API_KEY)

def get_today_work():
    auth = Auth.Token(GH_TOKEN)
    g = Github(auth=auth)
    repo = g.get_repo(REPO_NAME)
    
    kst = timezone(timedelta(hours=9))
    since = datetime.now(kst) - timedelta(days=1)
    
    branches = repo.get_branches()
    work_details = ""
    seen_commits = set()
    
    for branch in branches:
        commits = repo.get_commits(since=since, sha=branch.name)
        if commits.totalCount == 0: continue
            
        work_details += f"\n## 🌿 Branch: {branch.name}\n"
        for commit in commits:
            if commit.sha in seen_commits: continue
            seen_commits.add(commit.sha)
            
            author = commit.commit.author.name
            message = commit.commit.message
            work_details += f"\n### [{author}] {message}\n"
            
            for file in commit.files:
                if any(x in file.filename for x in ['package-lock.json', 'yarn.lock', 'node_modules']): continue
                if file.patch:
                    work_details += f"- **{file.filename}** 변경:\n  ```diff\n  {file.patch[:500]}\n  ```\n"
    return work_details

def create_article(work_details):
    if not work_details:
        return "오늘은 업데이트된 작업이 없습니다. 내일 더 파이팅해봐요! 🚀"

    kst = timezone(timedelta(hours=9))
    today_str = datetime.now(kst).strftime('%Y년 %m월 %d일')

    model = genai.GenerativeModel('gemini-flash-latest')
    
    prompt = f"""
    팀 "Calio"의 시니어 개발자로서 오늘({today_str})의 개발 일지를 작성하라.

    [작업 데이터]
    {work_details}

    [필수 규칙]
    1. 제목 포맷: 반드시 "[{today_str}] 오늘의 핵심 요약 제목"으로 작성할 것.
    2. 서두에 팀 "Calio"의 전체적인 오늘 진행 상황을 부드럽게 요약할 것.
    3. 각 커밋 작성자의 이름을 언급하며 기술적으로 칭찬하거나 분석할 것.
    4. 너가 누구인지는 밝히지 말고, 전문적인 개발자 톤을 유지할 것.
    5. 한국어로 작성할 것.
    7. 반드시 너의 소개라거나, AI라거나 누구인지는 절대 밝히지 마.
    8. 브랜치 단위로 구분하여 작성하고, 코드 변경점은 마크다운 코드 블록으로 감싸줘.
    """
    
    response = model.generate_content(prompt, generation_config={"temperature": 0.5})
    return response.text

if __name__ == "__main__":
    log_data = get_today_work()
    article = create_article(log_data)
    
    os.makedirs("articles", exist_ok=True)
    filename = datetime.now(timezone(timedelta(hours=9))).strftime('%Y-%m-%d')
    with open(f"articles/{filename}.md", "w", encoding="utf-8") as f:
        f.write(article)
    print("Article generated successfully.")