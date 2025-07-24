import { useState, useEffect } from 'react';
// Firebase関連のimport
import { db } from './firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, querySnapshotFromJSON } from 'firebase/firestore';

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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


// dark mode用のテーマ
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    //const [nums, setNums] = useState(10);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState('all');  // all, active, completeのどれか
    const [sort, setSort] = useState('default');    // default, title-asc, title-desc, time-asc, time-desc

    // データのreal time読み込み
    useEffect(() => {
        // todosコレクションへの参照を作成
        const todosCollectionRef = collection(db, 'todos');
        // クエリを作成 (例: 作成日時でソート)
        const q = query(todosCollectionRef);

        // onSnapshotでreal timeにデータの変更を監視
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const todosData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));
            setTodos(todosData);
            setLoading(false);
        });
        // componentがアンマウントされたときに監視を解除
        return () => unsubscribe();
    }, []);

    // データの追加
    const handleAdd = async() => {
        if (newTodo.trim() === '') return;
        const todosCollectionRef = collection(db, 'todos');
        await addDoc(todosCollectionRef, {
            title: newTodo,
            completed: false, 
            createdAt: serverTimestamp(),   // 作成日時を記録
        });
        setNewTodo('');
    };

    // データの更新
    const handleToggleComplete = async(id, currentStatus) => {
        const todoDocRef = doc(db, 'todos', id);
        await updateDoc(todoDocRef, {
            completed: !currentStatus,
        });
    };

    // データの削除
    const handleDeleteTodo = async(id) => {
        const todoDocRef = doc(db, 'todos', id);
        await deleteDoc(todoDocRef);
    };





    if (loading) {
        return <div>読み込み中...</div>
    }

    // Filter
    let filteredTodos = [];
    if (filter === 'active') {  // completedがfalseのもの
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') { // completedがtrueのもの
        filteredTodos = todos.filter(todo => todo.completed);
    } else { // all
        filteredTodos = todos;
    }

    // Sort
    let sortedTodos = [...filteredTodos];
    if (sort === 'title-asc') {
        sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'title-desc') {
        sortedTodos.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === 'time-asc') {
        sortedTodos.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
    } else if (sort === 'time-desc') {
        sortedTodos.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
    } 

    // title sortの表示を切り替える
    const handleTitleSort = () => {
        if (sort === 'title-asc') {
            setSort('title-desc');
        } else if (sort === 'title-desc') {
            setSort('default');
        } else {
            setSort('title-asc');
        }
    };
    // time sortの表示を切り替える
    const handleTimeSort = () => {
        if (sort === 'time-asc') {
            setSort('time-desc');
        } else if (sort === 'time-desc') {
            setSort('default');
        } else {
            setSort('time-asc');
        }
    };




    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />

            <Box
                sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center', // 垂直方向も中央に
                minHeight: '100vh',   // 画面の高さいっぱいに広げる
                p: 2,                 // 画面端とカードの間に余白
                }}
            >
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

                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1,
                    mb: 2,
                    flexShrink: 0,
                }}>
                    <Button
                        variant={sort.startsWith('title') ? 'contained' : 'outlined'}
                        onClick={handleTitleSort}
                        sx={{ textTransform: 'none' }}
                        endIcon={
                            sort === 'title-asc' ? <ArrowUpwardIcon /> :
                            sort === 'title-desc' ? <ArrowDownwardIcon /> :
                            null
                        }
                    >Title</Button>
                    <Button
                        variant={sort.startsWith('time') ? 'contained' : 'outlined'}
                        onClick={handleTimeSort}
                        sx={{ textTransform: 'none' }}
                        endIcon={
                            sort === 'time-asc' ? <ArrowUpwardIcon /> :
                            sort === 'time-desc' ? <ArrowDownwardIcon /> :
                            null
                        }
                    >Time</Button>
                </Box>

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

                <List sx={{ overflow: 'auto', flexGrow: 1 }}>
                    {sortedTodos.map(todo => (
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
                        onChange={() => handleToggleComplete(todo.id, todo.completed)}
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