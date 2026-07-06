# last-call-movie

映画「ラストコール」公式サイト。ビルド工程のない単一ページの静的サイト（`index.html`）。

## このリポジトリが正本
本作サイトの正はこのリポジトリ。lumina 等にある過去のコピーは編集しない。

## 構成
- `index.html` … 全セクション（HERO / INTRO / STORY / CAST / …）
- `assets/colors_and_type.css` … 色・タイポのトークン。直値をHTMLに書かずここを経由
- `assets/photos/` `assets/deco/` … 画像素材

## ルール
- デザイン変更はトーン（夏・青春・ノスタルジー、純白ベース）を維持する
- `.vercel/` はローカル設定なのでコミットしない（.gitignore 済み）
- 事業判断は yolo-members リポジトリの `docs/creative-yolo/` が正

## デプロイ
Vercel（main へのプッシュで公開）

## コミット規約
Conventional Commits + 日本語本文（例: `design: ヒーローを縦書きに変更`）
