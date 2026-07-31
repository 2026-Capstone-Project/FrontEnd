/*
  CloudFront Function (viewer request)

  라우트별 정적 HTML(`/login` -> `/login/index.html`)을 서빙하기 위한 URL 재작성입니다.
  이 함수를 붙이지 않으면 dist의 라우트별 HTML은 사용되지 않고,
  모든 경로가 기존처럼 `/index.html`(랜딩) 하나로 서빙됩니다.

  적용 방법
  1) CloudFront 콘솔 > 함수 > 함수 생성
     - 이름: calio-spa-router (계정 내 유일해야 하고, 생성 후 변경 불가)
     - 런타임: cloudfront-js-2.0
  2) 이 파일 내용을 붙여넣고 게시(Publish)
  3) 배포 > 동작 > 기본 동작 편집 > 뷰어 요청에 이 함수 연결
  4) 무효화(/*) 후 확인:
     curl -sI https://calio.co.kr/login | head -1        # 200
     curl -s  https://calio.co.kr/login | grep '<title>' # 로그인 | Calio

  동작 규칙
  - 확장자가 있는 요청(/assets/x.js, /robots.txt 등)은 그대로 통과시킵니다.
  - 그 외 경로는 `<경로>/index.html`로 바꿉니다.
  - 존재하지 않는 경로는 S3가 403을 반환하고, 기존 오류 페이지 설정에 따라
    `/index.html`로 폴백됩니다. (지금 동작과 동일)
*/
function handler(event) {
  var request = event.request
  var uri = request.uri

  // 파일 요청(확장자 포함)은 재작성하지 않습니다.
  if (uri.indexOf('.') !== -1) {
    return request
  }

  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html'
  } else {
    request.uri = uri + '/index.html'
  }

  return request
}
