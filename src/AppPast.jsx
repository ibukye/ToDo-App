import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import {
  Container,
  Typography,
  Box,
  TextField, 
  Button, 
  List, 
  ListItem,
  IconButton,
  Checkbox,
  ListItemText
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DeleteIcon from '@mui/icons-material/Delete';


// dark mode用のテーマ
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  // Todoリストを保存するためのstate
  const [todos, setTodos] = useState([]);

  // loading状態を管理するためのstate
  const [loading, setLoading] = useState(true);

  // Todoの個数を管理するためのstate for id
  const [nums, setNums] = useState(10);

  // 新しいTodoを一時記憶させるためのstate
  const [newTodo, setNewTodo] = useState('');

  // どのフィルターが選択されているかを記憶するstate
  const [filter, setFilter] = useState('all');  // all, active, completeのどれか

  // componentが最初に表示されたときに一度だけ実行する処理
  useEffect(() => {
    // APIからdataを処理する関数
    const fetchTodos = async() => {
      try {
        // JSONPlaceholderからTodo dataを取得(先頭10件のみ)
        // await: データ取得が終わるまで次の処理を待つことができる
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10');
        // 取得したデータをstateに保存
        setTodos(response.data);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      } finally {
        // データ取得が完了したらloading状態を解除
        setLoading(false);
      }
    };

    fetchTodos();   // 関数を実行
  }, []);   // 第2引数の配列を空にすることで初回rendaring時のみ実行される

  // 新しいtodoを追加する関数
  const handleAdd = () => {
    // 入力が空の場合は何もしない
    if (newTodo.trim() === '') { return; }

    // 追加する新しいTodo objectを作成
    const newTodoObj = {
      id: nums + 1,
      title: newTodo,
      completed: false,
    };

    // setTodosを使ってTodoリストのstateを更新
    // 元のtodo配列を展開し、末尾に新しいTodoを追加した新しい配列をセットする
    setTodos([...todos, newTodoObj]);
    // 次のIDのためにId counterもセット
    setNums(nums + 1);
    // 追加が終わったら入力欄を空に戻す
    setNewTodo('');
  };

  // チェックボックスのCompletedをfalse -> true, true -> falseに
  const handleToggleComplete = (id) => {
    // Todos配列をmapでループ処理して新しい配列を生成する
    const updatedTodos = todos.map(todo => {
      // もし現在のtodoのidがクリックされたidと一致したら
      if (todo.id === id) {
        // そのtodoのcompleteプロパティを反転させた新しいobjを返す
        return { ...todo, completed: !todo.completed };
      }
      // idが一致しない場合は元のtodoをそのまま返す
      return todo;
    });
    // 新しく生成した配列でstateを更新
    setTodos(updatedTodos);
  };

  // Todoを削除する関数 (idを引数として受け取る)
  const handleDeleteTodo = (id) => {
    // filterメソッドを使って指定されたIDと一致しないTodoだけを残した新しい配列を作成する
    const updatedTodos = todos.filter(todo => todo.id !== id);
    // 新しい配列でstateを更新
    setTodos(updatedTodos);
  } 

  // loading中ならメッセージを表示
  if (loading) {
    return <div>読み込み中...</div>
  }

  // filterに応じて変化するリスト
  let filteredTodos = [];
  if (filter === 'active') {  // completedがfalseのもの
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (filter === 'completed') { // completedがtrueのもの
    filteredTodos = todos.filter(todo => todo.completed);
  } else { // all
    filteredTodos = todos;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* 1. 画面全体をFlexboxコンテナにして、中のカードを中央に配置する */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center', // 垂直方向も中央に
          minHeight: '100vh',   // 画面の高さいっぱいに広げる
          p: 2,                 // 画面端とカードの間に余白
        }}
      >
        {/* 2. アプリの本体となる「カード」Box。これがレイアウトの基準になる */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',    // カードの最大幅を固定
            height: '85vh',       // カードの高さを固定
            p: { xs: 2, sm: 3 }, // カード内部の余白
            borderRadius: 2,      // 角を丸める
            bgcolor: 'background.paper', // カードの背景色をテーマから取得
            boxShadow: 24,        // カードに影をつけて立体感を出す

            // 3. カードの内部もFlexboxにして、子要素を制御する
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ flexShrink: 0 }}>
            高機能ToDoアプリ
          </Typography>

          {/* フィルターボタン (カードの一番下に固定される) */}
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            pt: 2, // リストとの間に余白
            flexShrink: 0, // このBoxが縮まないようにする
            marginBottom: 2
          }}>
            <Button variant={filter === 'all' ? 'contained' : 'outlined'} onClick={() => setFilter('all')}>すべて</Button>
            <Button variant={filter === 'active' ? 'contained' : 'outlined'} onClick={() => setFilter('active')}>未完了</Button>
            <Button variant={filter === 'completed' ? 'contained' : 'outlined'} onClick={() => setFilter('completed')}>完了済み</Button>
          </Box>

          {/* 入力フォーム */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexShrink: 0 }}>
            <TextField
              fullWidth
              label="新しいTodo"
              variant='outlined'
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <Button variant='contained' onClick={handleAdd} sx={{ whiteSpace: 'nowrap' }}>追加</Button>
          </Box>

          {/* ToDoリスト (この部分が伸び縮みして残りのスペースを全て埋める) */}
          <List sx={{ overflow: 'auto', flexGrow: 1 }}>
            {filteredTodos.map(todo => (
              <ListItem
                key={todo.id}
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Checkbox
                  edge="start"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                />
                <ListItemText
                  primary={todo.title}
                  sx={{
                    overflowWrap: 'break-word',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  }}
                />
              </ListItem>
            ))}
          </List>

        </Box>
      </Box>
    </ThemeProvider>
  );
}