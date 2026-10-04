# グッズ紹介 / STORESへの販売導線

映画サイトは商品を紹介し、注文・決済・在庫・送料の管理はSTORESに任せます。
独自カート、決済API、注文フォーム、個人情報の収集はありません。
本変更は販売開始・本番公開を含みません。3商品とも準備中です。

## 更新する場所

- `assets/goods-data.js`: 商品名、短い説明、実物写真、確認済みの仕様・価格表示、販売状態、商品URL。
- `assets/goods.js`: 表示と外部リンクの検証。
- `assets/goods.css`: 青白の写真枠・カード・スマホの配置。
- `index.html#goods`: 見出しとSTORESでの購入案内。

## 写真が届いたら

1. 量産品の実物と一致する写真を `img/goods/` に置きます（WebP・AVIF・PNG・JPEG対応）。
2. 対象商品の `photo` を `{ src: "/img/goods/tote.webp", alt: "確認済みの実物写真の説明" }` の形で設定します。
3. 写真枠はPC 4:5、スマホ5:4。`object-fit: contain` で商品全体を切らずに表示します。
4. 写真未設定・不正なパス・画像読込失敗時は「商品写真は準備中です」に戻ります。

過去のモックアップは商品写真として使用していません。現物の型番・寸法・色・デザインが確認できるまでは、古い制作仕様を商品詳細に転記しません。

## STORES商品ページが完成したら

1. 正しいショップのHTTPS URLを `storeOrigin` に設定します。末尾は `/`（または省略）、商品パス・クエリ・ハッシュは含めません。
2. 各商品のSTORES商品URLを `productUrl` に設定します。確認済みショップと同じoriginの `/items/<商品ID>` のみ購入リンクになります。
3. 商品の販売開始を確認したら、その商品の `status` を `"available"` に変更します。
4. `priceText` は承認済み表示だけを設定します。未設定でも、STORESで価格を確認する案内を表示します。価格・在庫・送料・支払方法の最終情報はSTORES側です。
5. 販売停止・完売時は `"sold-out"`、準備中へ戻すなら `"preparing"` にします。

**URLだけ入力しても販売を開始しません。** `available` と有効な商品URL・ショップURLが揃った商品だけリンクが有効になります。HTTP、JavaScript、別ショップ、認証情報入り、ポート指定、商品パス欠損、クエリ・ハッシュ付きURLは拒否します。カスタムドメインの場合も、ショップの実在と管理権限を確認してから `storeOrigin` に登録してください。

3商品とも販売価格・現在庫・送料・商品URL・実物写真は未設定です。
Tシャツなど他の商品は追加していません。

## ローカル確認

ビルド工程のない静的サイトです。Python等でリポジトリを配信します。

```bash
python3 -m http.server 4177 --bind 127.0.0.1
node --check assets/goods-data.js
node --check assets/goods.js
node --check script.js
git diff --check
```

`tests/goods.browser.cjs` はPlaywrightが利用できる環境で実行します。
`LAST_CALL_BASE_URL` でローカルURL、`LAST_CALL_EVIDENCE_DIR` で画面画像の保存先を指定できます。

```bash
npm install --no-save --package-lock=false playwright@1.61.1
npx playwright install chromium
node tests/goods.browser.cjs
```

商品URLの検証では架空の `lastcall-check.stores.jp/items/test-item` をブラウザ内のデータ差し替えにだけ使います。実ファイルに架空の商品URL・価格・仕様は書き込みません。外部通信は遮断し、テスト購入・注文送信はしません。

最新本番 `c4e3db2` を基点に独立ブランチ `feat/stores-goods` で制作。既存の上映・ニュース・キャスト・ギャラリーには内容変更を加えていません。
