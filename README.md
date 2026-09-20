# pic-compressor

[![CI](https://github.com/chandq/pic-compressor/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/chandq/pic-compressor/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/pic-compressor?logo=npm)](https://www.npmjs.com/package/pic-compressor)
[![Coverage](https://img.shields.io/badge/coverage-lines%2090.84%25-brightgreen?logo=vitest)](vitest.config.ts)
[![License](https://img.shields.io/npm/l/pic-compressor)](LICENSE)
[![Node.js](https://img.shields.io/node/v/pic-compressor)](package.json)

独立的浏览器图片压缩工具，基于 Canvas，零运行时依赖，支持普通图片、长截图、全景图、Blob、FileList、目标体积迭代和取消操作。

## 安装

```bash
npm install pic-compressor
```

## 使用

```ts
import { compressImage } from 'pic-compressor';

const result = await compressImage(file, {
  preset: 'balanced',
  outputMode: 'compact'
});

console.log(result.file, result.width, result.height, result.afterKB);
```

预设包括 `balanced`、`social`、`high-quality`、`thumbnail` 和 `long-image`。显式参数优先于预设。默认 `balanced` 目标为最大 1920px、约 500KB，长图会保留合理长边并受像素和 Canvas 上限约束。

指定目标体积时，压缩器会先搜索最高可接受质量，必要时再按比例缩小尺寸：

```ts
const result = await compressImage(file, {
  mime: 'image/webp',
  targetFileSizeKB: 300,
  outputMode: 'compact',
  onProgress: (progress) => console.log(`${progress}%`)
});
```

输入可以是 `File`、`Blob` 或 `FileList`。Blob 可通过 `fileName` 指定输出文件名。默认保留旧版 Data URL 和二进制字段；在生产环境推荐 `outputMode: 'compact'` 降低内存峰值。

格式转换允许体积变大，例如 JPEG 转 PNG。对于同格式输出，`keepOriginalIfLarger` 默认为 `true`；若业务需要保留更大的重编码结果，可设置为 `false`。

## 浏览器 CDN

```html
<script src="https://unpkg.com/pic-compressor/dist/index.umd.js"></script>
<script>
  const result = await PicCompressor.compressImage(file, { outputMode: 'compact' });
</script>
```

## 开发

```bash
npm install
npm run verify
npm run build
```

构建输出：

- `dist/index.mjs`：ESM
- `dist/index.cjs`：CommonJS
- `dist/index.d.mts` / `dist/index.d.cts`：TypeScript 声明
- `dist/index.umd.js`：压缩后的 UMD 浏览器包及 Source Map

ESM、CommonJS、UMD 和类型声明均由 tsdown 生成，Lint 和格式化由 Oxc 的 `oxlint`/`oxfmt` 完成。

## API

完整参数和返回值见 [docs/api.md](docs/api.md)。

## 社区与贡献

- 参与开发请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)
- 社区行为规范见 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- 安全问题请按照 [SECURITY.md](SECURITY.md) 私下报告，不要提交公开 Issue
- 仓库开发约定及自动化工具指南见 [AGENTS.md](AGENTS.md)

## 兼容性

目标环境需要 `File`、`Blob`、`FileReader`、`Canvas 2D` 和图片解码 API。原生 iOS、Android、React Native 文件 URI 需要先转换为 Web `File`，或使用原生图片 API。

## License

MIT
