// WASM 모듈과 rust_hello 함수를 import
import init, { rust_hello } from "./pkg/hello_wasm.js";

// 전역 변수로 WASM 초기화 상태 추적
let wasmInitialized = false;

// 페이지 로드 시 실행되는 초기화 함수
async function initializeWasm() {
    const outputDiv = document.getElementById("output");
    
    try {
        console.log("WASM 모듈 초기화 시작...");
        
        // CUDA의 cudaSetDevice() + 커널 로드와 유사한 과정
        // await init()는 .wasm 파일을 fetch하고 인스턴스화
        await init();
        
        wasmInitialized = true;
        console.log("WASM 모듈 초기화 완료!");
        
        // 초기화 성공 시 UI 업데이트
        outputDiv.textContent = "WASM 모듈이 성공적으로 로드되었습니다!";
        document.getElementById("callRustBtn").style.display = "block";
        
        // 자동으로 첫 번째 호출 실행
        callRustFunction();
        
    } catch (error) {
        console.error("WASM 초기화 실패:", error);
        outputDiv.textContent = `오류 발생: ${error.message}`;
    }
}

// Rust 함수를 호출하는 함수
// CUDA의 kernel<<<grid,block>>>(args) 호출과 유사
function callRustFunction() {
    if (!wasmInitialized) {
        console.error("WASM이 아직 초기화되지 않았습니다!");
        return;
    }
    
    console.log("JavaScript에서 Rust 함수 호출...");
    
    // rust_hello() 호출 - cross-runtime boundary를 넘는 호출
    // CUDA의 커널 실행과 개념적으로 유사
    const result = rust_hello();
    
    console.log("Rust 함수에서 받은 결과:", result);
    
    // UI에 결과 표시
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `
        <h3>실행 결과:</h3>
        <p><strong>Rust 함수 반환값:</strong> ${result}</p>
        <hr>
        <h4>실행 과정 설명:</h4>
        <ol>
            <li>JavaScript (Host) → WebAssembly (Guest) 호출</li>
            <li>Rust 코드가 WASM 런타임에서 실행됨</li>
            <li>결과가 JavaScript로 반환됨</li>
        </ol>
        <p>이는 CUDA의 CPU → GPU 커널 실행과 구조적으로 유사합니다!</p>
    `;
}

// 버튼 클릭 이벤트 리스너 등록
document.getElementById("callRustBtn").addEventListener("click", callRustFunction);

// 페이지 로드 시 WASM 초기화
initializeWasm();