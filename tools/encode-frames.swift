// Encodes numbered frames (frame-00000.jpg, ...) into an H.264 MP4 with AVFoundation (no ffmpeg needed).
// Usage: swift tools/encode-frames.swift <frames-dir> <out.mp4> [fps=30]
import AVFoundation
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: encode-frames.swift <frames-dir> <out.mp4> [fps]"); exit(2) }
let dir = args[1], out = args[2], fps = args.count > 3 ? Int32(args[3])! : 30
let files = try FileManager.default.contentsOfDirectory(atPath: dir).filter { $0.hasPrefix("frame-") }.sorted()
guard let first = files.first, let img0 = NSImage(contentsOfFile: dir + "/" + first),
      let cg0 = img0.cgImage(forProposedRect: nil, context: nil, hints: nil) else { print("no frames"); exit(1) }
let w = cg0.width, h = cg0.height
try? FileManager.default.removeItem(atPath: out)
let writer = try AVAssetWriter(outputURL: URL(fileURLWithPath: out), fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: w, AVVideoHeightKey: h,
  AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 10_000_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
                                    AVVideoMaxKeyFrameIntervalKey: Int(fps)]])
input.expectsMediaDataInRealTime = false
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
  kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA, kCVPixelBufferWidthKey as String: w, kCVPixelBufferHeightKey as String: h])
writer.add(input); writer.startWriting(); writer.startSession(atSourceTime: .zero)

func buffer(_ path: String) -> CVPixelBuffer? {
  guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { return nil }
  var pb: CVPixelBuffer?
  CVPixelBufferCreate(nil, w, h, kCVPixelFormatType_32BGRA, nil, &pb)
  guard let b = pb else { return nil }
  CVPixelBufferLockBaseAddress(b, [])
  let ctx = CGContext(data: CVPixelBufferGetBaseAddress(b), width: w, height: h, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(b),
                      space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue | CGBitmapInfo.byteOrder32Little.rawValue)!
  ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))
  CVPixelBufferUnlockBaseAddress(b, [])
  return b
}
for (i, f) in files.enumerated() {
  while !input.isReadyForMoreMediaData { Thread.sleep(forTimeInterval: 0.005) }
  guard let b = buffer(dir + "/" + f) else { print("bad frame", f); exit(1) }
  adaptor.append(b, withPresentationTime: CMTime(value: Int64(i), timescale: fps))
}
input.markAsFinished()
let sem = DispatchSemaphore(value: 0)
writer.finishWriting { sem.signal() }
sem.wait()
print(writer.status == .completed ? "wrote \(out): \(files.count) frames, \(w)x\(h)" : "failed: \(String(describing: writer.error))")
