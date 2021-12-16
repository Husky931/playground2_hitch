import { initMp3MediaEncoder } from "mp3-mediarecorder/worker"
//@ts-ignore
import wasmSrc from "vmsg/vmsg.wasm"

initMp3MediaEncoder({ vmsgWasmUrl: wasmSrc })