let taskListElem;

// タスクの連想配列の配列
let tasks = [];

window.addEventListener("load", function () {
  // リストを取得
  taskListElem = document.querySelector("ul");
  // localStrageから配列を読み込む
  loadTasks();
  // 配列からリストを出力
  renderTasks();
});

function renderTasks() {
  // リストの中身をキレイキレイ
  taskListElem.innerHTML = "";

  // 完了済みタスクの件数を数えるための変数を初期化
  let numOfCompletedTasks = 0;

  for (let task of tasks) {
    // リストの項目を作成
    let taskElem = document.createElement("li");
    taskElem.innerText = task.name;

    // 項目をクリックまたはダブルクリックされたときの動作を設定
    taskElem.addEventListener("click", function () {
      // リストの項目をクリックされたときは、タスクの完了状態をトグル
      toggleTaskComplete(task.name);
    });
    taskElem.addEventListener("dblclick", function () {
      // リストの項目をダブルクリックされたときは、タスクを削除
      deleteTask(task.name);
    });

    // タスクの完了状況に応じ、項目の取り消し線を設定
    if (task.isCompleted) {
      taskElem.style.textDecorationLine = "line-through";
      numOfCompletedTasks++;
    } else {
      taskElem.style.textDecorationLine = "none";
    }

    // 期限表示を作成
    let taskDueDateElem = document.createElement("span");
    taskDueDateElem.style.fontSize = "0.8rem";
    taskDueDateElem.style.fontStyle = "italic";
    taskDueDateElem.style.marginLeft = "1rem";

    if (task.dueDate) {
      taskDueDateElem.innerText = task.dueDate;
    } else {
      taskDueDateElem.innerText = "";
    }

    // 項目に対し、期限表示を追加
    taskElem.appendChild(taskDueDateElem);

    // 期限別に色を変える
    // 日付情報
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    //console.log(today);

    let tomorrow = new Date();
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    tomorrow.setDate(tomorrow.getDate() + 1);
    //console.log(tomorrow);

    let taskDate = new Date(task.dueDate + " 00:00:00");

    if (taskDate.getTime() == today.getTime()) {
      taskDueDateElem.style.color = "#ffeaa7";
    } else if (taskDate.getTime() < today.getTime()) {
      taskDueDateElem.style.color = "#d63031";
    } else {
      taskDueDateElem.style.color = "black";
    }

    // 残り日数表示
    let taskDaysElem = document.createElement("span");
    taskDaysElem.style.fontSize = "0.8rem";
    taskDaysElem.style.marginLeft = "1rem";

    let least = taskDate.getTime() - today.getTime();

    if (task.dueDate && least > 1) {
      taskDaysElem.innerText = "残り： " + least / 86400000 + "日";
    } else if (task.dueDate && least == 0) {
      taskDaysElem.innerText = "本日が期限です！";
    } else if (task.dueDate && least < 0) {
      taskDaysElem.innerText =
        "期限は " + (least / 86400000) * -1 + "日前でした";
    } else {
      taskDaysElem.innerText = "";
    }

    taskElem.appendChild(taskDaysElem);

    // リストに対し、項目を追加
    taskListElem.appendChild(taskElem);

    // 全タスクの件数を更新
    let numOfTasksElem = document.querySelector("#numOfTasks");
    numOfTasksElem.innerText = tasks.length;

    // 完了済みタスクの件数を更新
    let numOfCompletedTasksElem = document.querySelector(
      "#numOfCompletedTasks"
    );
    numOfCompletedTasksElem.innerText = numOfCompletedTasks;
  }
}

function addTask(taskName, taskDueDate) {
  // 重複チェック
  for (let task of tasks) {
    if (task.name == taskName) {
      // 既に存在する場合はダイアログを表示する
      window.alert("すでに登録済みです");
      return;
    }
  }
  // 配列に対し、項目を追加
  tasks.push({
    name: taskName,
    dueDate: taskDueDate,
    isCompleted: false,
  });

  // localStrageへ配列を保存
  saveTasks();
  // 配列からリストを再出力
  renderTasks();

  // フォームクリア
  document.querySelector("form").reset();
}

function deleteTask(taskName) {
  // 新しい配列を用意
  let newTasks = [];
  // 現状の配列を反復
  for (let task of tasks) {
    if (task.name != taskName) {
      // 削除したいタスク名でなければ、新しい配列へ追加
      newTasks.push(task);
    }
  }
  // 現状の配列を新しい配列で上書き
  tasks = newTasks;
  // localStrageへ配列を保存
  saveTasks();
  // 配列からリストを再出力
  renderTasks();
}

function toggleTaskComplete(taskName) {
  // 現状の配列をコピー
  for (let task of tasks) {
    if (task.name == taskName) {
      // 対象のタスク名ならば、完了状態をトグル
      task.isCompleted = !task.isCompleted;
    }
  }

  // localStrageへ配列を保存
  saveTasks();
  // 配列からリストを再出力
  renderTasks();
}

function loadTasks() {
  let jsonString = window.localStorage.getItem("tasks");
  if (jsonString) {
    tasks = JSON.parse(jsonString);
  }
}

function saveTasks() {
  let jsonString = JSON.stringify(tasks);
  window.localStorage.setItem("tasks", jsonString);
}
