# The F2E - 點點簽

## 網站介紹

參考 [點點簽](https://www.dottedsign.com/zh-tw/) 這個線上文件簽署網站來仿製一個具有類似功能的網頁。

### User Story

1. 使用者可以新增自己的簽名列表，並自動儲存
2. 使用者可以透過拖曳或點擊來把簽名放到文件中的正確位置
3. 使用者可以調整簽名擋的大小及位置
4. 使用者可以預覽最後簽名完以後的結果
5. 使用者可以一直到編輯滿意後，將完成的結果下載下來
6. 使用者可以看到進度條，得知目前的簽署進度

附註：為了在手機上也能有良好的使用體驗，此專案有盡可能做出完整的 RWD 功能，最小可支援到 375px（約 iPhone SE 大小）。

![Demo](./demo.gif)

線上預覽連結：https://jubeatt.github.io/the-f2e-online-pdf-signature/#/

## 使用技術

- React
- React useReducer / useContext（狀態管理）
- React router dom
- TypeScript
- SCSS
- CSS Flex / Grid
- CSS Animation

## 使用工具

- ant desig
- classnames（管理動態 class 名稱）
- fabric（增強 canvas 使用體驗）
- jspdf（輸出 pdf）
- lodash（整理資料 tool）
- pdfjs-dist（讀取 pdf 檔案）
- uniqid（產生 id）
- dayjs（日期處理）

## 資料夾結構

```
├── src
│   ├── assets
│   │   ├── fonts（字體）
│   │   │   ├── NotoSansTC-Black.otf
│   │   │   ├── NotoSansTC-Bold.otf
│   │   │   └── ...
│   │   ├── images（圖片）
│   │   │   ├── banner-bg.png
│   │   │   ├── banner-shadow.png
│   │   │   ├── ...
│   │   └── react.svg
│   ├── components（共用元件）
│   │   ├── Footer.tsx
│   │   ├── ...
│   ├── context（狀態管理）
│   │   └── AppContext.tsx
│   ├── main.tsx（進入點）
│   ├── styles
│   │   ├── components（改寫 antd 樣式及自訂元件）
│   │   │   ├── \_button.scss
│   │   │   ├── \_...
│   │   ├── layouts（主佈局樣式）
│   │   │   ├── \_home.scss
│   │   │   └── \_layout.scss
│   │   └── utils（輔助工具）
│   │   ├── \_animation.scss
│   │   ├── \_...
│   ├── svgs
│   │   ├── components（原始內容）
│   │   │   ├── Arrow.tsx
│   │   │   ├── Logo.tsx
│   │   │   ├── ...
│   │   └── index.tsx（統一匯出）
│   ├── utils（custom hook）
│   │   └── useAppContext.ts
│   ├── views（主要頁面）
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── ...
```

## 運行方式

1. clone 此專案到本地端

```
git clone https://github.com/jubeatt/the-f2e-online-pdf-signature.git
```

2. 安裝專案的 dependencies

```
npm install
```

3. 啟動開發環境

```
npm run dev
```

## To Do

- [x] 儲存簽名
- [x] RWD
- [x] 儲存已上傳文件
- [ ] 邀請他人簽署
- [ ] 登入 / 註冊頁面
- [ ] 透過上傳圖片來新增簽名檔
