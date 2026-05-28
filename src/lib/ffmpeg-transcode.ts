import { FFmpeg } from "@ffmpeg/ffmpeg";

let instance: FFmpeg | null = null;
let loading: Promise<FFmpeg> | null = null;

async function toBlobURL(url: string, mimeType: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return URL.createObjectURL(new Blob([buf], { type: mimeType }));
}

async function getFfmpeg(): Promise<FFmpeg> {
  if (instance) return instance;
  if (loading) return loading;
  loading = (async () => {
    const ff = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd";
    await ff.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    instance = ff;
    return ff;
  })();
  return loading;
}

export async function webmToMp4(
  webmBlob: Blob,
  onProgress?: (ratio: number) => void
): Promise<Blob> {
  const ff = await getFfmpeg();
  const progressHandler = ({ progress }: { progress: number }) => {
    if (onProgress) onProgress(progress);
  };
  if (onProgress) ff.on("progress", progressHandler);
  try {
    const data = new Uint8Array(await webmBlob.arrayBuffer());
    await ff.writeFile("input.webm", data);
    await ff.exec([
      "-i", "input.webm",
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-crf", "23",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "output.mp4",
    ]);
    const out = await ff.readFile("output.mp4");
    try { await ff.deleteFile("input.webm"); } catch {}
    try { await ff.deleteFile("output.mp4"); } catch {}
    const bytes = out as Uint8Array;
    return new Blob([bytes], { type: "video/mp4" });
  } finally {
    if (onProgress) ff.off("progress", progressHandler);
  }
}
