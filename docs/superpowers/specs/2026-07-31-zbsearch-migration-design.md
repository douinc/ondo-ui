# ZBSearch 마이그레이션 설계

## 배경

`fumadocs-core`를 16.11.1에서 16.14.0으로 업데이트하면 정적 검색
엔진의 계약이 `@orama/orama`에서 `zbsearch`로 변경된다. 현재
클라이언트 초기화 함수는 여전히 Orama 데이터베이스를 반환하므로,
Fumadocs가 `AnyZBSearch`를 기대하는 지점에서 TypeScript 오류가
발생한다. 같은 오류로 프로덕션 정적 내보내기도 중단된다.

검색 엔드포인트는 이미 `/api/search`에서 언어별 검색 인덱스를
제공한다. ZBSearch는 한국어 기본 토크나이저를 제공하지 않으므로
한국어 인덱싱에는 기존 커스텀 토크나이저를 사용한다.

## 목표

- Fumadocs 정적 검색에 ZBSearch를 직접 사용한다.
- 현재 영어 및 한국어 검색 동작을 유지한다.
- 문장 부호를 경계로 문자와 숫자를 나누는 기존 한국어 토큰화
  동작을 유지한다.
- 더 이상 권장되지 않는 Fumadocs 클라이언트 API 이름을 제거한다.
- 불필요해진 Orama 직접 의존성을 제거한다.
- 완전한 Next.js 정적 내보내기 호환성을 유지한다.

## 목표가 아닌 것

- 검색 UI 또는 결과 순위를 변경하는 작업
- 퍼지 검색, 벡터 검색 또는 원격 검색을 추가하는 작업
- 관련 없는 command menu 동작을 리팩터링하는 작업
- 동일한 변경에서 관련 없는 의존성 보안 경고를 해결하는 작업

## 검토한 접근 방식

### ZBSearch로 완전히 전환

Orama를 직접 고정한 ZBSearch 의존성으로 교체하고 데이터베이스
초기화 함수와 Fumadocs 클라이언트 API 이름을 함께 변경한다. 현재
Fumadocs 계약과 일치하고 deprecated 호환 별칭을 제거할 수 있으므로
이 방식을 선택했다.

### 호환성만 확보하는 최소 전환

ZBSearch 데이터베이스를 반환하도록 변경하되 `oramaStaticClient`와
`initOrama` 이름은 유지한다. 당장의 변경량은 적지만 deprecated
이름이 남고 이후에 불필요한 추가 작업이 발생한다.

### Fumadocs 버전 고정

`fumadocs-core`를 16.11.1로 유지한다. 구현 작업은 피할 수 있지만
의도한 의존성 업데이트가 차단되므로 선택하지 않았다.

## 의존성 설계

- 직접 의존성인 `@orama/orama`를 제거한다.
- 업데이트된 Fumadocs가 사용하는 버전과 동일한 `zbsearch@3.3.4`를
  정확한 버전으로 직접 추가한다.
- `packageManager` 및 CI와 동일한 Bun 1.3.14로 `bun.lock`을 다시
  생성한다.
- 잠금 파일 재생성 후 `bun install --frozen-lockfile`이 성공해야
  한다.

직접 의존성을 정확한 버전으로 고정하면 애플리케이션 초기화 함수와
Fumadocs가 호환되는 하나의 ZBSearch 구현을 사용하게 된다. 향후
Fumadocs와 ZBSearch 업데이트는 함께 검토한다.

## 검색 구조

`lib/search-index.ts`는 계속해서 검색 데이터베이스 초기화와 한국어
토큰화를 단독으로 담당한다.

- `createKoreanTokenizer()`는 정적 검색 라우트와 클라이언트 검색
  데이터베이스 초기화가 공유하는 토크나이저를 반환한다.
- `createStaticSearchIndex(locale)`는 ZBSearch 데이터베이스를
  생성한다.
- 한국어 데이터베이스에는 커스텀 토크나이저를 적용한다.
- 다른 언어에는 ZBSearch 기본 토크나이저를 사용한다.

`app/api/search/route.ts`는 `createFromSource`를 통해 정적인 언어별
검색 데이터를 계속 생성한다. 한국어 locale 설정에는 빈 `language`를
명시해 Fumadocs가 주입하는 `multilingual` 기본값을 막는다. ZBSearch는
커스텀 tokenizer와 truthy한 `language`를 함께 사용할 수 없기 때문이다.

`components/command-menu.tsx`는 deprecated되지 않은 Fumadocs
`staticClient` API를 사용하고 `createStaticSearchIndex`를 `initDB`로
전달한다. 클라이언트는 `/api/search`를 가져와 언어에 맞는 ZBSearch
데이터베이스를 생성하고, 내보낸 인덱스를 불러온 뒤 로컬에서 검색을
수행한다.

## 데이터 흐름

1. `next build` 중 정적 검색 라우트가 영어 및 한국어 문서를
   인덱싱한다.
2. Fumadocs가 두 인덱스를 정적 `/api/search` 출력으로 직렬화한다.
3. command menu가 브라우저에서 내보낸 데이터를 가져온다.
4. `staticClient`가 요청된 언어에 대해 `initDB`를 호출한다.
5. ZBSearch가 직렬화된 인덱스를 해당 데이터베이스에 불러온다.
6. 인덱싱할 때와 동일한 언어별 토크나이저로 로컬 검색을 수행한다.

라우트는 계속 정적으로 내보낼 수 있으며 런타임 서버를 추가하지
않는다.

## 오류 처리

검색 인덱스 가져오기 실패 또는 언어 데이터 누락에 대한 보고는
기존과 같이 Fumadocs가 담당한다. 이 마이그레이션에서는 타입
캐스팅이나 오류를 숨기는 호환 어댑터를 추가하지 않는다. 타입
불일치는 브라우저 런타임 오류가 될 가능성을 남기는 대신 컴파일
단계에서 실패해야 한다.

## 테스트 설계

기존 토크나이저 테스트는 문장 부호와 숫자를 처리하는 한국어
토큰화 동작의 계약으로 유지한다.

검색 인덱스 테스트에는 다음 검증을 추가한다.

- 영어 및 한국어 ZBSearch 데이터베이스를 생성한다.
- 대표 문서를 삽입하고 원본 데이터베이스를 직렬화한다.
- 직렬화된 데이터를 새로운 언어별 데이터베이스에 불러온다.
- 복원한 한국어 데이터베이스를 한국어 검색어로 조회한다.
- 예상한 문서가 반환되는지 확인한다.

구현은 Bun 1.3.14로 다음 항목이 모두 통과해야 완료된 것으로
판단한다.

1. `bun install --frozen-lockfile`
2. `bun run test`
3. `bun run lint`
4. `bun run typecheck`
5. `bun run build`

빌드 검증에서는 정적 `/api/search` 결과에 영어 및 한국어 인덱스
데이터가 모두 존재하는지 확인해야 한다.

## 예상 변경 파일

- `package.json`
- `bun.lock`
- `app/api/search/route.ts`
- `lib/search-index.ts`
- `lib/search-index.test.ts`
- `components/command-menu.tsx`

`components/ui/` 아래의 파일은 추가하거나 이름을 변경하거나
제거하지 않으므로 registry component 절차는 적용하지 않는다.
