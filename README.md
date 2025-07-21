# CUDA vs WebAssembly 개념 비교 데모

CUDA의 개념을 보고 WASM과의 유사성이 있는 것 같다고 느껴서 직접 코드 작성하면서 이해하고자 생성한 레포입니다.

## 개념적 비교

| CUDA | WebAssembly |
|------|------------|
| CPU (Host) → GPU (Device) | JavaScript (Host) → WASM (Guest) |
| `__global__ void kernel()` | `#[wasm_bindgen] pub fn rust_hello()` |
| `kernel<<<grid,block>>>()` | `rust_hello()` JavaScript 호출 |
| `cudaMemcpy()` | wasm-bindgen이 자동 처리 |
| PTX/SASS 명령어 세트 | WebAssembly bytecode |
| CUDA Runtime/Driver | WebAssembly Runtime |

## 필수 도구 설치

### 1. Rust 설치
```bash
# Rust 설치 (https://rustup.rs/)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. WebAssembly 타겟 추가
```bash
rustup target add wasm32-unknown-unknown
```

### 3. wasm-pack 설치
```bash
cargo install wasm-pack
```

만약 컴파일 실패한다면 뒤에 `--locked` 플래그를 붙여서 컴파일 시도합니다.

- 

## 프로젝트 구조

```
hello-wasm/
├── Cargo.toml          # Rust 프로젝트 설정
├── src/
│   └── lib.rs          # Rust 소스 코드 (rust_hello 함수)
├── index.html          # 웹 페이지
├── main.js             # JavaScript 코드
└── pkg/                # 빌드 후 생성되는 디렉토리
    ├── hello_wasm_bg.wasm    # 컴파일된 WebAssembly 바이너리
    ├── hello_wasm.js         # JavaScript glue 코드
    └── ...
```

## 빌드 방법

프로젝트 루트 디렉토리에서:

```bash
wasm-pack build --target web
```

이 명령은:
1. Rust 코드를 WebAssembly로 컴파일
2. JavaScript glue 코드 생성
3. `pkg/` 디렉토리에 모든 결과물 저장

## 실행 방법

### 1. HTTP 서버 시작 (브라우저는 file:// 프로토콜 차단)

Node.js가 있는 경우:
```bash
npx serve .
# 또는
npx http-server .
```

Python이 있는 경우:
```bash
python3 -m http.server 8000
```

### 2. 브라우저에서 열기

서버가 표시하는 URL로 접속 (예: http://localhost:8000)

## 코드 설명

### Rust 코드 (src/lib.rs)

```rust
#[wasm_bindgen]
pub fn rust_hello() -> String {
    "Hello World from Rust!".to_string()
}
```

- `#[wasm_bindgen]`: CUDA의 `__global__`과 유사한 export 매크로
- JavaScript에서 직접 호출 가능한 함수로 변환

### JavaScript 코드 (main.js)

```javascript
import init, { rust_hello } from "./pkg/hello_wasm.js";

await init();  // WASM 모듈 초기화 (CUDA의 cudaSetDevice()와 유사)
const result = rust_hello();  // Cross-runtime 호출 (kernel 실행과 유사)
```

## 실행 흐름

1. **초기화**: `await init()` - WASM 모듈을 fetch하고 인스턴스화
2. **함수 호출**: `rust_hello()` - JavaScript → WASM boundary 넘어 실행
3. **결과 반환**: Rust 문자열이 JavaScript 문자열로 자동 변환

## 추가 기능

프로젝트에는 CUDA와의 유사성을 보여주는 추가 예제도 포함:

- `add_numbers(a, b)`: 매개변수를 받는 함수
- `WasmContext`: 상태를 가진 구조체 (CUDA의 device 메모리 구조체와 유사)
- `internal_add()`: export되지 않은 내부 함수 (CUDA의 `__device__` 함수와 유사)

## 문제 해결

### "wasm-pack: command not found" 오류
```bash
cargo install wasm-pack
```

### 브라우저에서 CORS 오류
로컬 파일을 직접 열지 말고 반드시 HTTP 서버를 통해 접속

### WebAssembly.instantiate 실패
브라우저 개발자 도구에서 콘솔 오류 확인. 대부분 경로 문제나 서버 설정 문제
