/**
 * 商品写真と販売情報の更新はこのファイルのみで行います。
 * photo: { src: "/img/goods/実物写真.webp", alt: "実物の説明" }
 * storeOrigin: 承認済みのSTORESショップURL（例はdocs/goods.md参照）。
 * status: "preparing" | "available" | "sold-out"
 * 販売開始を確認するまでstatusはpreparingのままにします。
 * priceText/specificationsは確認済みの情報だけを記載。未確定ならnull/[]。
 * 在庫・送料・決済はSTORES側で管理します。
 */
window.LAST_CALL_GOODS = {
  storeOrigin: null,
  products: [
    {
      id: "tote",
      name: "トートバッグ",
      label: "TOTE BAG",
      description: "映画の余韻を、日常へ。",
      photo: null,
      priceText: null,
      specifications: [],
      status: "preparing",
      productUrl: null
    },
    {
      id: "badge",
      name: "缶バッジ",
      label: "CAN BADGE",
      description: "小さなかたちで、映画をそばに。",
      photo: null,
      priceText: null,
      specifications: [],
      status: "preparing",
      productUrl: null
    },
    {
      id: "towel",
      name: "タオル",
      label: "TOWEL",
      description: "天草の夏を思い出す、一枚。",
      photo: null,
      priceText: null,
      specifications: [],
      status: "preparing",
      productUrl: null
    }
  ]
};
