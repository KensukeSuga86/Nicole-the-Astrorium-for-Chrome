# SceneState v2

PresenterとProjectorの描画境界です。

- schema: `nicole-astrorium-scene-state`
- version: 2
- observer: 緯度・経度・標高・地点名
- time: 時刻・再生状態・倍率
- camera / projection
- layers / display
- constellations / asterisms / highlights / labels
- annotations
- media: 観客画面へ投影するNicoleメディアライブラリ項目
- engineState: 既存Canvasエンジン互換payload

将来のWebGPU/Metal描画では、このSceneStateを受け取るRenderer Adapterを実装することでPresenterを維持したまま描画側を交換します。
