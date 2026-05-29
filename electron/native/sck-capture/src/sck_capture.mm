// SPIKE — ScreenCaptureKit com SCContentFilter(display:excludingWindows:).
// Objetivo: capturar o display SEM incluir a janela do OS¹ nos frames.
// POC: entrega frames como Buffer JPEG via polling. Não otimizado.

#import <Foundation/Foundation.h>
#import <AppKit/AppKit.h>
#import <CoreGraphics/CoreGraphics.h>
#import <CoreVideo/CoreVideo.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreImage/CoreImage.h>
#import <ImageIO/ImageIO.h>
#import <UniformTypeIdentifiers/UniformTypeIdentifiers.h>
#import <ScreenCaptureKit/ScreenCaptureKit.h>

#include <napi.h>
#include <mutex>
#include <vector>
#include <atomic>

// ──────────────────────────────────────────────────────────────────────────
// Bridge: SCStreamDelegate + SCStreamOutput, mantém último frame como JPEG.
// ──────────────────────────────────────────────────────────────────────────
API_AVAILABLE(macos(12.3))
@interface SCKBridge : NSObject <SCStreamDelegate, SCStreamOutput> {
@public
  std::mutex _frameMutex;
  std::atomic<uint64_t> _frameCount;
  std::atomic<bool> _stopped;
  double _jpegQuality;
}
@property (nonatomic, strong) SCStream *stream;
@property (nonatomic, strong) CIContext *ciContext;
@property (nonatomic, strong) NSData *latestJpeg;
- (std::mutex&)frameMutexRef;
@end

@implementation SCKBridge

- (instancetype)init {
  if ((self = [super init])) {
    _ciContext = [CIContext contextWithOptions:nil];
    _frameCount = 0;
    _stopped = false;
    _jpegQuality = 0.55;
  }
  return self;
}

- (std::mutex&)frameMutexRef { return _frameMutex; }

- (void)stream:(SCStream *)stream didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer ofType:(SCStreamOutputType)type {
  if (_stopped.load()) return;
  if (type != SCStreamOutputTypeScreen) return;
  if (!CMSampleBufferIsValid(sampleBuffer)) return;

  CFArrayRef attachmentsArray = CMSampleBufferGetSampleAttachmentsArray(sampleBuffer, NO);
  if (attachmentsArray && CFArrayGetCount(attachmentsArray) > 0) {
    CFDictionaryRef att = (CFDictionaryRef)CFArrayGetValueAtIndex(attachmentsArray, 0);
    CFNumberRef status = (CFNumberRef)CFDictionaryGetValue(att, (__bridge CFStringRef)SCStreamFrameInfoStatus);
    if (status) {
      int s = 0;
      CFNumberGetValue(status, kCFNumberIntType, &s);
      // Só processar frames "complete". Idle/blank/suspended descartamos.
      if (s != SCFrameStatusComplete) return;
    }
  }

  CVPixelBufferRef pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer);
  if (!pixelBuffer) return;

  CIImage *ci = [CIImage imageWithCVPixelBuffer:pixelBuffer];
  CGRect ext = ci.extent;
  CGImageRef cg = [self.ciContext createCGImage:ci fromRect:ext];
  if (!cg) return;

  NSMutableData *jpegData = [NSMutableData data];
  CFStringRef jpegType = (__bridge CFStringRef)UTTypeJPEG.identifier;
  CGImageDestinationRef dest = CGImageDestinationCreateWithData((__bridge CFMutableDataRef)jpegData, jpegType, 1, NULL);
  if (dest) {
    NSDictionary *props = @{ (__bridge NSString *)kCGImageDestinationLossyCompressionQuality: @(self->_jpegQuality) };
    CGImageDestinationAddImage(dest, cg, (__bridge CFDictionaryRef)props);
    CGImageDestinationFinalize(dest);
    CFRelease(dest);
  }
  CGImageRelease(cg);

  if (jpegData.length > 0) {
    {
      std::lock_guard<std::mutex> lock([self frameMutexRef]);
      self.latestJpeg = [jpegData copy];
    }
    _frameCount.fetch_add(1);
  }
}

- (void)stream:(SCStream *)stream didStopWithError:(NSError *)error {
  NSLog(@"[sck] stream stopped: %@", error);
  _stopped.store(true);
}

@end

// ──────────────────────────────────────────────────────────────────────────
// State global do módulo.
// ──────────────────────────────────────────────────────────────────────────
static SCKBridge *gBridge API_AVAILABLE(macos(12.3)) = nil;

// ──────────────────────────────────────────────────────────────────────────
// listWindows() → [{ windowID, title, ownerName, ownerPID, onScreen }]
// listDisplays() → [{ displayID, width, height }]
// ──────────────────────────────────────────────────────────────────────────
Napi::Value ListContent(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (@available(macOS 12.3, *)) {
    dispatch_semaphore_t sem = dispatch_semaphore_create(0);
    __block SCShareableContent *content = nil;
    __block NSError *blockErr = nil;
    [SCShareableContent getShareableContentWithCompletionHandler:^(SCShareableContent * _Nullable c, NSError * _Nullable err) {
      content = c;
      blockErr = err;
      dispatch_semaphore_signal(sem);
    }];
    if (dispatch_semaphore_wait(sem, dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 5)) != 0) {
      Napi::Error::New(env, "Timeout esperando SCShareableContent").ThrowAsJavaScriptException();
      return env.Undefined();
    }
    if (blockErr || !content) {
      std::string msg = blockErr ? blockErr.localizedDescription.UTF8String : "no content";
      Napi::Error::New(env, msg).ThrowAsJavaScriptException();
      return env.Undefined();
    }
    Napi::Object result = Napi::Object::New(env);
    Napi::Array wins = Napi::Array::New(env);
    uint32_t i = 0;
    for (SCWindow *w in content.windows) {
      Napi::Object o = Napi::Object::New(env);
      o.Set("windowID", Napi::Number::New(env, (double)w.windowID));
      o.Set("title", Napi::String::New(env, w.title ? w.title.UTF8String : ""));
      o.Set("ownerName", Napi::String::New(env, w.owningApplication.applicationName ? w.owningApplication.applicationName.UTF8String : ""));
      o.Set("ownerPID", Napi::Number::New(env, (double)w.owningApplication.processID));
      o.Set("onScreen", Napi::Boolean::New(env, w.onScreen));
      wins.Set(i++, o);
    }
    result.Set("windows", wins);

    Napi::Array displays = Napi::Array::New(env);
    i = 0;
    for (SCDisplay *d in content.displays) {
      Napi::Object o = Napi::Object::New(env);
      o.Set("displayID", Napi::Number::New(env, (double)d.displayID));
      o.Set("width", Napi::Number::New(env, (double)d.width));
      o.Set("height", Napi::Number::New(env, (double)d.height));
      displays.Set(i++, o);
    }
    result.Set("displays", displays);
    return result;
  } else {
    Napi::Error::New(env, "Requires macOS 12.3+").ThrowAsJavaScriptException();
    return env.Undefined();
  }
}

// ──────────────────────────────────────────────────────────────────────────
// start({ displayId, excludeWindowIds: [], fps, scale, jpegQuality })
// ──────────────────────────────────────────────────────────────────────────
Napi::Value Start(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (@available(macOS 12.3, *)) {
    if (gBridge != nil) {
      Napi::Error::New(env, "Stream já iniciado, chame stop() antes").ThrowAsJavaScriptException();
      return env.Undefined();
    }
    if (info.Length() == 0 || !info[0].IsObject()) {
      Napi::Error::New(env, "Expected options object").ThrowAsJavaScriptException();
      return env.Undefined();
    }
    Napi::Object opts = info[0].As<Napi::Object>();
    uint32_t displayId = 0;
    if (opts.Has("displayId")) displayId = opts.Get("displayId").As<Napi::Number>().Uint32Value();
    std::vector<CGWindowID> excludeIds;
    if (opts.Has("excludeWindowIds")) {
      Napi::Array exArr = opts.Get("excludeWindowIds").As<Napi::Array>();
      for (uint32_t i = 0; i < exArr.Length(); i++) {
        excludeIds.push_back((CGWindowID)exArr.Get(i).As<Napi::Number>().Uint32Value());
      }
    }
    uint32_t fps = opts.Has("fps") ? opts.Get("fps").As<Napi::Number>().Uint32Value() : 15;
    if (fps < 1) fps = 1;
    if (fps > 60) fps = 60;
    double scale = opts.Has("scale") ? opts.Get("scale").As<Napi::Number>().DoubleValue() : 0.5;
    if (scale < 0.1) scale = 0.1;
    if (scale > 1.0) scale = 1.0;
    double jpegQuality = opts.Has("jpegQuality") ? opts.Get("jpegQuality").As<Napi::Number>().DoubleValue() : 0.55;

    dispatch_semaphore_t sem = dispatch_semaphore_create(0);
    __block bool didStart = false;
    __block NSString *errMsg = nil;

    [SCShareableContent getShareableContentWithCompletionHandler:^(SCShareableContent * _Nullable content, NSError * _Nullable err) {
      if (err || !content) {
        errMsg = err.localizedDescription ?: @"no content";
        dispatch_semaphore_signal(sem);
        return;
      }
      SCDisplay *target = nil;
      for (SCDisplay *d in content.displays) {
        if (displayId == 0 || d.displayID == displayId) { target = d; break; }
      }
      if (!target && content.displays.count > 0) target = content.displays.firstObject;
      if (!target) {
        errMsg = @"no display";
        dispatch_semaphore_signal(sem);
        return;
      }
      NSMutableArray<SCWindow*> *exWindows = [NSMutableArray array];
      for (SCWindow *w in content.windows) {
        for (auto id : excludeIds) {
          if (w.windowID == id) { [exWindows addObject:w]; break; }
        }
      }
      NSLog(@"[sck] start displayID=%u (%zux%zu) excludingWindows.count=%lu (requested %zu)",
            target.displayID, target.width, target.height,
            (unsigned long)exWindows.count, excludeIds.size());

      SCContentFilter *filter = [[SCContentFilter alloc] initWithDisplay:target excludingWindows:exWindows];
      SCStreamConfiguration *config = [[SCStreamConfiguration alloc] init];
      config.width = (size_t)((double)target.width * scale);
      config.height = (size_t)((double)target.height * scale);
      config.minimumFrameInterval = CMTimeMake(1, fps);
      config.pixelFormat = kCVPixelFormatType_32BGRA;
      config.colorSpaceName = kCGColorSpaceSRGB;
      config.showsCursor = YES;
      config.queueDepth = 5;

      gBridge = [[SCKBridge alloc] init];
      gBridge->_jpegQuality = jpegQuality;
      SCStream *stream = [[SCStream alloc] initWithFilter:filter configuration:config delegate:gBridge];
      NSError *addErr = nil;
      BOOL ok = [stream addStreamOutput:gBridge
                                   type:SCStreamOutputTypeScreen
                     sampleHandlerQueue:dispatch_get_global_queue(QOS_CLASS_USER_INTERACTIVE, 0)
                                  error:&addErr];
      if (!ok) {
        errMsg = addErr.localizedDescription ?: @"addStreamOutput failed";
        gBridge = nil;
        dispatch_semaphore_signal(sem);
        return;
      }
      gBridge.stream = stream;
      [stream startCaptureWithCompletionHandler:^(NSError * _Nullable startErr) {
        if (startErr) {
          errMsg = startErr.localizedDescription;
          gBridge = nil;
        } else {
          didStart = true;
        }
        dispatch_semaphore_signal(sem);
      }];
    }];
    if (dispatch_semaphore_wait(sem, dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 7)) != 0) {
      Napi::Error::New(env, "Timeout iniciando SCStream").ThrowAsJavaScriptException();
      return env.Undefined();
    }
    if (errMsg) {
      Napi::Error::New(env, errMsg.UTF8String).ThrowAsJavaScriptException();
      return env.Undefined();
    }
    return Napi::Boolean::New(env, didStart);
  } else {
    Napi::Error::New(env, "Requires macOS 12.3+").ThrowAsJavaScriptException();
    return env.Undefined();
  }
}

Napi::Value Stop(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (@available(macOS 12.3, *)) {
    if (!gBridge) return Napi::Boolean::New(env, false);
    gBridge->_stopped.store(true);
    SCStream *s = gBridge.stream;
    if (s) {
      [s stopCaptureWithCompletionHandler:^(NSError * _Nullable err) {
        if (err) NSLog(@"[sck] stopCapture err: %@", err);
      }];
    }
    gBridge = nil;
    return Napi::Boolean::New(env, true);
  } else {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Value GetFrame(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (@available(macOS 12.3, *)) {
    if (!gBridge) return env.Null();
    NSData *jpeg = nil;
    {
      std::lock_guard<std::mutex> lock([gBridge frameMutexRef]);
      jpeg = gBridge.latestJpeg;
    }
    if (!jpeg) return env.Null();
    return Napi::Buffer<uint8_t>::Copy(env, (const uint8_t*)jpeg.bytes, jpeg.length);
  } else {
    return env.Null();
  }
}

Napi::Value GetStats(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  Napi::Object o = Napi::Object::New(env);
  if (@available(macOS 12.3, *)) {
    o.Set("running", Napi::Boolean::New(env, gBridge != nil));
    o.Set("frameCount", Napi::Number::New(env, (double)(gBridge ? gBridge->_frameCount.load() : 0)));
    NSData *latest = nil;
    if (gBridge) {
      std::lock_guard<std::mutex> lock([gBridge frameMutexRef]);
      latest = gBridge.latestJpeg;
    }
    o.Set("latestSize", Napi::Number::New(env, (double)(latest ? latest.length : 0)));
  } else {
    o.Set("running", Napi::Boolean::New(env, false));
    o.Set("frameCount", Napi::Number::New(env, 0));
    o.Set("latestSize", Napi::Number::New(env, 0));
  }
  return o;
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set("listContent", Napi::Function::New(env, ListContent));
  exports.Set("start", Napi::Function::New(env, Start));
  exports.Set("stop", Napi::Function::New(env, Stop));
  exports.Set("getFrame", Napi::Function::New(env, GetFrame));
  exports.Set("getStats", Napi::Function::New(env, GetStats));
  return exports;
}

NODE_API_MODULE(sck_capture, Init)
