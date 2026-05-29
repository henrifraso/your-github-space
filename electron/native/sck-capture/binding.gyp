{
  "targets": [
    {
      "target_name": "sck_capture",
      "sources": [ "src/sck_capture.mm" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS", "NAPI_VERSION=8" ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "conditions": [
        ["OS==\"mac\"", {
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "NO",
            "CLANG_ENABLE_OBJC_ARC": "YES",
            "MACOSX_DEPLOYMENT_TARGET": "13.0",
            "CLANG_CXX_LANGUAGE_STANDARD": "c++17",
            "OTHER_CPLUSPLUSFLAGS": [ "-std=c++17", "-stdlib=libc++" ],
            "OTHER_LDFLAGS": [
              "-framework", "ScreenCaptureKit",
              "-framework", "CoreMedia",
              "-framework", "CoreVideo",
              "-framework", "CoreGraphics",
              "-framework", "CoreImage",
              "-framework", "AppKit",
              "-framework", "Foundation",
              "-framework", "ImageIO",
              "-framework", "UniformTypeIdentifiers"
            ]
          }
        }]
      ]
    }
  ]
}
