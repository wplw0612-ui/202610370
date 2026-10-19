const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
// 6. 학번(202610370) 뒷자리 0370 -> 예시에 따라 3370으로 변경
const PORT = process.env.PORT || 3370;

app.use(express.urlencoded({ extended: true }));
// POST /todo/1?_method=PUT → PUT /todo/1 로 처리
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 저장 (서버 재시작 시 초기화)
let todos = [
  { id: 1, text: '아침 운동하기' },
  { id: 2, text: '이메일 확인하기' },
  { id: 3, text: '장보기' },
];
let nextId = 4;

app.get('/todo', (req, res) => {
  res.json(todos);
});

app.post('/todo', (req, res) => {
  const text = (req.body.text || '').trim();
  if (text) todos.push({ id: nextId++, text });
  res.redirect('/');
});

// 7. 참고사이트와 같이 수정처리가 될 수 있도록 PUT 라우트 처리
app.put('/todo/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const text = (req.body.text || '').trim();
  const todo = todos.find(t => t.id === id);
  if (todo && text) {
    todo.text = text; // 내용 수정
  }
  res.redirect('/');
});

// 8. 참고사이트와 같이 삭제처리가 될 수 있도록 DELETE 라우트 처리
app.delete('/todo/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  todos = todos.filter(t => t.id !== id); // 해당 id 제외하고 배열 업데이트
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});