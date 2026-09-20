# API Reference

## `compressImage(file, options?)`

压缩单个 `File`/`Blob`，或按并发限制压缩 `FileList`。

### 关键参数

| 参数                     | 类型                         | 默认         | 说明                               |
| ------------------------ | ---------------------------- | ------------ | ---------------------------------- |
| `preset`                 | `ImageCompressionPreset`     | `balanced`   | 场景预设                           |
| `quality`                | `number`                     | 由预设决定   | `0` 到 `1`                         |
| `mime`                   | `ImageType`                  | `image/jpeg` | JPEG、PNG、WebP 或 AVIF            |
| `maxWidth` / `maxHeight` | `number`                     | 由预设决定   | 等比例尺寸约束                     |
| `maxSize`                | `number`                     | -            | 同时设置宽高上限的兼容参数         |
| `maxPixels`              | `number`                     | 由预设决定   | 输出最大像素数                     |
| `maxCanvasDimension`     | `number`                     | `8192`       | Canvas 单边安全上限                |
| `targetFileSizeKB`       | `number \| null`             | 由预设决定   | 目标最大体积；`null` 禁用预设目标  |
| `minQuality`             | `number`                     | 由预设决定   | 目标体积迭代下限                   |
| `maxIterations`          | `number`                     | `8`          | 最大编码次数                       |
| `outputMode`             | `'legacy' \| 'compact'`      | `legacy`     | compact 不返回 Data URL/Uint8Array |
| `keepOriginalIfLarger`   | `boolean`                    | `true`       | 同格式结果更大时保留原文件         |
| `strictMime`             | `boolean`                    | `false`      | 拒绝 Canvas 格式回退               |
| `onProgress`             | `(progress: number) => void` | -            | 0 到 100 的进度                    |
| `signal`                 | `AbortSignal`                | -            | 取消压缩                           |
| `concurrency`            | `number`                     | `2`          | FileList 最大并发数                |

### 返回值

返回 `ICompressImgResult` 或其数组。核心字段：

- `file`：输出文件
- `width` / `height`：输出尺寸
- `mime`：Canvas 实际编码格式
- `beforeKB` / `afterKB`：输入和输出体积
- `quality`：最终编码质量
- `iterations`：编码次数
- `targetAchieved`：是否达到目标体积

## `supportCanvas()`

检测当前环境是否能够创建可用的 Canvas 2D 上下文。

## 类型

导出的类型包括 `ImageType`、`ImageCompressionPreset`、`CompressionPresetOptions`、`ICompressOptions` 和 `ICompressImgResult`。
