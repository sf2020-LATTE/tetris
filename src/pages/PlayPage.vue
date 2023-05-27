<script lang="ts" setup>
// 状態管理を行うため reactive 関数を読み込む
import { reactive, onMounted, onBeforeUnmount } from "vue";

// テトリミノを扱うため Tetromino クラスや TETROMINO_TYPE を読み込む
import { Tetromino, TETROMINO_TYPE } from '../common/Tetromino';
// テトリスのフィールドを扱うための Field クラスを読み込む
import { Field } from '../common/Field';

import TetrominoPreviewComponent from '../components/TetrominoPreviewComponent.vue';
import func from "../../vue-temp/vue-editor-bridge";

// フィールドの初期化
let staticField = new Field();

// テトリミノ落下中のテトリスのフィールドを保持する
const tetris = reactive({
  field: new Field(),
});

// 落下中のテトリミノを保持する
const tetromino = reactive({
  current: Tetromino.random(),
  position: { x: 3, y: 0 },
  next: Tetromino.random()
});


const classBlockColor = (_x: number, _y: number): string => {
  const type = tetris.field.data[_y][_x];

  if(type > 0) {
    return Tetromino.id(type as TETROMINO_TYPE);
  }

  const { x, y } = tetromino.position;
  const { data } = tetromino.current;

  if (y <= _y && _y < y + data.length) {
    const cols = data[_y - y];
    if (x <= _x && _x < x + cols.length) {
      if (cols[_x - x] > 0) {
        return Tetromino.id(cols[_x - x] as TETROMINO_TYPE);
      }
    }
  }

  return "";
}


// テトリミノの落下判定を行い真偽値を返却する
const canDropCurrentTetrimino = ():boolean => {
  const{ x, y } = tetromino.position;

  const droppedPosition = { x, y: y + 1 };

  const data = tetromino.current.data;
  return tetris.field.canMove(data, droppedPosition);
}

// テトリスのフィールドの状態を保存して、
// 次に落下するテトリミノのフィールドの状態を初期化する
const nextTetrisField = () => {
  const data = tetromino.current.data;
  const position = tetromino.position;

  tetris.field.update(data, position);

  staticField = new Field(tetris.field.data);
  tetris.field = Field.deepCopy(staticField);

  tetromino.current = tetromino.next;
  tetromino.next = Tetromino.random();

  tetromino.position = { x: 3, y: 0 };

}

const onKeyDown = (e:KeyboardEvent) => {
  switch(e.key){
    case "Down":
    case "ArrowDown":
      if(canDropCurrentTetrimino()){
        tetromino.position.y++;
      } else {
        nextTetrisField();
      }
      break;
  }
}

onMounted(function(){
  document.addEventListener("keydown", onKeyDown);
});

onBeforeUnmount(function(){
  document.removeEventListener('keydown', onKeyDown)
})


// テトリミノを落下させる処理
// setInterval(func, delay) で delay ミリ秒ごとに func を実行する
setInterval(() => {
  tetris.field = Field.deepCopy(staticField);

  if(canDropCurrentTetrimino()){
    tetromino.position.y++;
  } else {
    nextTetrisField();
  }
}, 1 * 1000);

tetris.field.update(tetromino.current.data, tetromino.position);

</script>

<template>
  <h1>プレイ画面</h1>
  <h2>ユーザ名: {{ $route.query.name }}</h2>
  <div class = "container">
    <div class="tetris">
    <table class="field" style = "border-collapse: collapse">
      <tr v-for="(row, y) in tetris.field.data" :key="y">
        <td
          class="block"
          v-for="(col, x) in row"
          :key="()=>`${x}${y}`"
          v-bind:class="classBlockColor(x, y)"
        />
      </tr>
    </table>
    </div>
    <div class="information">
      <TetrominoPreviewComponent v-bind:tetromino="tetromino.next.data"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.information {
  margin-left: 0.5em;
}
.container {
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.field {
  border: ridge 0.4em #2c3e50;
  border-top: none;
}

.block {
  width: 1em;
  height: 1em;
  border: 0.1px solid #95a5a6;
  &-i {
  background: #3498db;
  }
  &-o {
    background: #f1c40f;
  }
  &-t {
    background: #9b59b6;
  }
  &-j {
    background: #1e3799;
  }
  &-l {
    background: #e67e22;
  }
  &-s {
    background: #2ecc71;
  }
  &-z {
    background: #e74c3c;
  }
}

</style>