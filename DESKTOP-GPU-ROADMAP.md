# Nicole the Astrorium — Desktop / GPU Roadmap

## 現在: Safari版 v0.15.5
- LOCAL-first DB v0.3.2
- SceneState v2 + Realtime patch sync
- 単一Shared WebGL contextで恒星・天の川・星座絵・流星・大気光・自然Deep Skyを描画
- 恒星B−V色 / FOV連動限界等級LOD / D3-Celestial stars.8 約4.1万星
- WebGL失敗時Canvas自動フォールバック
- ユーザー変更可能なショートカット設定
- キーボードによる緯度経度連続移動
- 全天表示の文字を天頂中心・円周方向を下として放射回転
- Nicole Astronomy Database Editor（外部の正本Editor）

## 次の大工程
Safari版は独立して継続開発しつつ、macOS版はv0.14.4/v0.15系のWeb資産を基準にSwift + WKWebViewコンテナ化し、将来ProjectorだけMetal Rendererへ差し替え可能な構造を維持します。

Safariでは複数のフルサイズWebGL contextを使わず、Projector用GPU rendererを1 contextへ集約する方針です。
