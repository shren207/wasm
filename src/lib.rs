use wasm_bindgen::prelude::*;

// CUDA의 __global__ 키워드와 유사한 역할을 하는 #[wasm_bindgen]
// 이 매크로는 Rust 함수를 JavaScript에서 호출 가능하도록 export
#[wasm_bindgen]
pub fn rust_hello() -> String {
    // CUDA 커널 내부에서 실행되는 코드와 유사
    // GPU에서 실행되는 대신 WASM 런타임에서 실행됨
    "Hello World from Rust!".to_string()
}

// 추가적인 예제 함수들 - CUDA 커널 함수와의 유사성 시연

#[wasm_bindgen]
pub fn add_numbers(a: i32, b: i32) -> i32 {
    // CUDA에서 디바이스 함수를 호출하듯이
    // WASM 내부에서 다른 Rust 함수 호출 가능
    internal_add(a, b)
}

// CUDA의 __device__ 함수와 유사 - 외부에서 직접 호출 불가
fn internal_add(a: i32, b: i32) -> i32 {
    a + b
}

// 구조체도 export 가능 - CUDA의 구조체와 유사
#[wasm_bindgen]
pub struct WasmContext {
    message: String,
    count: u32,
}

#[wasm_bindgen]
impl WasmContext {
    #[wasm_bindgen(constructor)]
    pub fn new() -> WasmContext {
        WasmContext {
            message: "WASM Context 초기화됨".to_string(),
            count: 0,
        }
    }
    
    pub fn increment(&mut self) {
        self.count += 1;
    }
    
    pub fn get_status(&self) -> String {
        format!("메시지: {}, 카운트: {}", self.message, self.count)
    }
}