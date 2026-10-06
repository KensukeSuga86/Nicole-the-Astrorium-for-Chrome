# Nicole the Astrorium — GitHub Pages edition v1.1.0

このフォルダは GitHub Pages へそのまま公開できる構成です。

## 公開手順
1. GitHub で新しいリポジトリを作成します（例: `Nicole-the-Astrorium`）。
2. このフォルダの**中身をすべて**リポジトリ直下へアップロードします。
3. GitHub のリポジトリで **Settings → Pages** を開きます。
4. **Build and deployment → Source** を `Deploy from a branch` にします。
5. Branch を `main`、Folder を `/(root)` にして **Save**。
6. 数分後に表示される GitHub Pages の URL を開きます。

## Webアプリ / PWA
- `manifest.webmanifest` と `sw.js` を追加済みです。
- Chrome / Edge / Safari の対応環境ではホーム画面やDockへ追加して、Webアプリとして起動できます。
- 初回読み込み後は主要ファイルをService Workerへキャッシュします。
- 観測地点の「現在地」は HTTPS 上の GitHub Pages で利用できます（ブラウザの位置情報許可が必要）。

## GitHub Pages向けに追加・修正したもの
- PWA manifest
- Service Worker
- 192 / 512 / Apple touch icon
- `.nojekyll`
- 相対URLの `new URL()` を GitHub Pages のサブディレクトリでも動く形へ修正

## 注意
- Presenter と Projector の連携には同一ブラウザ・同一オリジンでの `BroadcastChannel` を利用します。
- ブラウザのポップアップブロックにより Projector が開けない場合は、このサイトのポップアップを許可してください。
- 保存データ（メディア、星カタログ、お気に入り、設定等）はブラウザ側の localStorage / IndexedDB に保存されます。
