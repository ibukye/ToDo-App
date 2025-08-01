[Read in English](./README.md)

---

# 高機能ToDoアプリ

**ReactとFirebaseで構築したリアルタイムToDoアプリケーションです**

[![Vercel](https://vercel.com/button)](https://to-do-app-react-two-tau.vercel.app)

## 概要

このアプリケーションは、基本的なToDo管理機能に加え、リアルタイムでのデータ同期、フィルタリング、ソート機能を備えた高機能なタスク管理ツールです

MUIを使ったモダンなUIと、ダークモード対応も特徴です

## 主な機能

- **リアルタイムなToDo管理 (CRUD)**: Firebase Firestoreとの連携による、ToDoの追加、更新、削除、読み込み
- **フィルタリング**: 「すべて」「未完了」「完了済み」でタスクを絞り込み表示
- **ソート**: 「タイトル」または「作成時間」での昇順・降順ソート
- **UI/UX**:
    - Material-UI (MUI) を利用した、クリーンで直感的なデザイン
    - ダークモード対応
    - レスポンシブデザインによるレイアウトの安定化

## 使用技術

- **フロントエンド**: React, Vite
- **UIライブラリ**: Material-UI (MUI)
- **バックエンド/DB**: Firebase (Firestore)
- **デプロイ**: Vercel