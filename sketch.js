// 宣告五題 p5.js 簡易指令練習測驗的題目資料。
const questions = [
  // 建立第一題，測試 setup() 的用途。
  {
    // 設定第一題的題目文字。
    question: "在 p5.js 中，哪一個函式通常會在程式開始時執行一次？",
    // 設定第一題的四個選項文字。
    options: ["draw()", "setup()", "start()", "begin()"],
    // 設定第一題正確答案的索引值。
    answer: 1
  },
  // 建立第二題，測試 draw() 的用途。
  {
    // 設定第二題的題目文字。
    question: "在 p5.js 中，哪一個函式會在畫面上持續重複執行？",
    // 設定第二題的四個選項文字。
    options: ["loop()", "repeat()", "draw()", "run()"],
    // 設定第二題正確答案的索引值。
    answer: 2
  },
  // 建立第三題，測試 background() 的用途。
  {
    // 設定第三題的題目文字。
    question: "下列哪一個 p5.js 指令可以設定畫布的背景顏色？",
    // 設定第三題的四個選項文字。
    options: ["background()", "canvasColor()", "fillCanvas()", "colorBackground()"],
    // 設定第三題正確答案的索引值。
    answer: 0
  },
  // 建立第四題，測試 ellipse() 的用途。
  {
    // 設定第四題的題目文字。
    question: "下列哪一個 p5.js 指令可以畫出圓形或橢圓形？",
    // 設定第四題的四個選項文字。
    options: ["circle()", "ellipse()", "round()", "oval()"],
    // 設定第四題正確答案的索引值。
    answer: 1
  },
  // 建立第五題，測試 fill() 的用途。
  {
    // 設定第五題的題目文字。
    question: "在 p5.js 中，哪一個指令可以設定圖形的填滿顏色？",
    // 設定第五題的四個選項文字。
    options: ["stroke()", "border()", "fill()", "paint()"],
    // 設定第五題正確答案的索引值。
    answer: 2
  }
];

// 宣告目前顯示的題目索引。
let currentQuestion = 0;

// 宣告使用者目前累積的答對題數。
let score = 0;

// 宣告目前題目是否已經作答。
let answered = false;

// 宣告測驗是否已經完成。
let quizFinished = false;

// 宣告使用者在目前題目所選的選項索引。
let selectedOption = -1;

// 宣告正確答案上下跳動動畫的時間值。
let correctAnimationTime = 0;

// 宣告錯誤選項左右移動動畫的時間值。
let wrongAnimationTime = 0;

// 宣告由 calculateLayout() 統一管理的響應式版面資料。
let layout = {};

// 宣告下一題按鈕的左上角座標與尺寸。
let nextButton = { x: 0, y: 0, w: 0, h: 0 };

// 宣告重新開始按鈕的左上角座標與尺寸。
let restartButton = { x: 0, y: 0, w: 0, h: 0 };

// 宣告整體頁面的背景顏色。
const pageBackground = "#f4f7fb";

// 宣告主要文字顏色。
const textColor = "#24324a";

// 宣告次要文字顏色。
const secondaryTextColor = "#667085";

// 宣告一般選項與卡片的背景顏色。
const optionColor = "#ffffff";

// 宣告滑過一般選項時的背景顏色。
const optionHoverColor = "#eaf0ff";

// 宣告卡片與選項的外框顏色。
const borderColor = "#d7dfeb";

// 宣告按鈕的主要背景顏色。
const buttonColor = "#4361ee";

// 宣告滑過按鈕時的背景顏色。
const buttonHoverColor = "#304dcc";

// 宣告尚未作答時不可使用按鈕的背景顏色。
const disabledButtonColor = "#c7cfdd";

// 宣告答錯後正確答案選項的指定背景顏色。
const correctColor = "#beee62";

// 宣告答錯後使用者所選錯誤選項的指定背景顏色。
const wrongColor = "#f4743b";

// 計算所有響應式版面資料，setup()、draw() 與 windowResized() 都會使用這個函式。
function calculateLayout() {
  // 取得目前畫布的安全寬度，避免初始化瞬間出現零值造成除錯困難。
  const safeWidth = max(1, width);

  // 取得目前畫布的安全高度，避免初始化瞬間出現零值造成除錯困難。
  const safeHeight = max(1, height);

  // 判斷目前是否屬於較窄或較矮的手機版面。
  const compact = safeWidth < 600 || safeHeight < 520;

  // 計算畫面四周留白，並限制在手機與桌機都適合的範圍。
  layout.pagePadding = constrain(min(safeWidth, safeHeight) * 0.04, 12, 32);

  // 計算內容最大寬度，確保內容不會貼住畫布邊緣。
  layout.contentWidth = max(220, safeWidth - layout.pagePadding * 2);

  // 寬畫面使用兩欄，窄畫面使用單欄以支援手機直向顯示。
  layout.optionColumns = safeWidth >= 560 ? 2 : 1;

  // 設定選項與欄位之間的間距。
  layout.optionButtonGap = compact ? 10 : 16;

  // 設定標題、進度文字與題目卡片的字級。
  layout.titleSize = constrain(min(safeWidth * 0.055, safeHeight * 0.075), 18, 40);
  layout.progressSize = constrain(min(safeWidth * 0.03, safeHeight * 0.045), 14, 20);
  layout.questionTextSize = constrain(min(safeWidth * 0.034, safeHeight * 0.043), 16, 26);

  // 設定標題與進度資訊的垂直位置。
  layout.headerTitleY = layout.pagePadding + layout.titleSize * 0.55;
  layout.progressY = layout.headerTitleY + layout.titleSize * 0.76;

  // 設定題目卡片的左上角位置與寬度。
  layout.questionWidth = layout.contentWidth;
  layout.questionX = (safeWidth - layout.questionWidth) / 2;
  layout.questionY = layout.progressY + layout.progressSize * 0.9 + (compact ? 10 : 14);

  // 設定題目卡片高度，窄螢幕縮小高度以保留選項與按鈕空間。
  layout.questionHeight = compact ? 74 : 104;

  // 設定選項區塊的起始位置。
  layout.optionsTop = layout.questionY + layout.questionHeight + (compact ? 12 : 18);

  // 設定底部按鈕的高度與下方留白。
  layout.buttonHeight = constrain(safeHeight * 0.09, 44, 58);
  layout.bottomPadding = constrain(safeHeight * 0.04, 12, 28);

  // 計算下一題按鈕的位置，並讓它永遠維持在畫布底部內側。
  nextButton.w = min(layout.contentWidth, 260);
  nextButton.h = layout.buttonHeight;
  nextButton.x = (safeWidth - nextButton.w) / 2;
  nextButton.y = max(layout.optionsTop, safeHeight - layout.bottomPadding - nextButton.h);

  // 計算選項欄寬，兩欄時扣除中間間距，單欄時使用完整內容寬度。
  layout.optionWidth = layout.optionColumns === 2
    ? (layout.contentWidth - layout.optionButtonGap) / 2
    : layout.contentWidth;

  // 計算四個選項需要排列的列數。
  layout.optionRows = ceil(questions[0].options.length / layout.optionColumns);

  // 計算選項到下一題按鈕之間可使用的垂直空間。
  const optionsAvailableHeight = nextButton.y - layout.optionsTop - (compact ? 10 : 16);

  // 依照可用空間計算選項高度，避免不同裝置尺寸造成重疊。
  const calculatedOptionHeight = (optionsAvailableHeight - (layout.optionRows - 1) * layout.optionButtonGap) / layout.optionRows;

  // 限制選項高度，並在極矮畫面仍保留可點擊的最小高度。
  layout.optionHeight = constrain(calculatedOptionHeight, compact ? 36 : 44, 64);

  // 設定選項文字大小，避免手機窄欄文字過大而超出按鈕。
  layout.optionTextSize = constrain(min(layout.optionWidth * 0.075, layout.optionHeight * 0.34), 13, 22);
}

// 宣告 p5.js 建立畫布時會執行一次的函式。
function setup() {
  // 建立符合瀏覽器視窗大小的全螢幕畫布。
  createCanvas(windowWidth, windowHeight);

  // 讓所有矩形都使用左上角座標，統一版面與點擊判定的計算方式。
  rectMode(CORNER);

  // 設定文字繪製時以水平與垂直置中為基準。
  textAlign(CENTER, CENTER);

  // 設定文字換行模式，讓長題目可以在卡片內自動換行。
  textWrap(WORD);

  // 設定圓角與抗鋸齒顯示效果。
  smooth();

  // 設定適合顯示中文的無襯線字型。
  textFont("sans-serif");

  // 第一次建立畫面時先計算所有響應式版面資料。
  calculateLayout();
}

// 宣告 p5.js 每一幀會重複執行的繪圖函式。
function draw() {
  // 以指定顏色清除並重繪整個畫布背景。
  background(pageBackground);

  // 每幀重新計算版面，確保瀏覽器旋轉或縮放後立即適應。
  calculateLayout();

  // 判斷測驗是否已經完成。
  if (quizFinished) {
    // 測驗完成時繪製結果畫面。
    drawResultScreen();

    // 結束本幀函式，避免結果畫面下方繼續繪製題目。
    return;
  }

  // 繪製測驗標題與進度資訊。
  drawHeader();

  // 繪製目前的題目卡片。
  drawQuestion();

  // 繪製目前題目的四個選項。
  drawOptions();

  // 繪製下一題或查看結果按鈕。
  drawNextButton();

  // 讓正確答案動畫持續向前播放。
  correctAnimationTime += 0.12;

  // 讓錯誤答案動畫持續向前播放。
  wrongAnimationTime += 0.16;
}

// 繪製測驗標題與目前題數資訊。
function drawHeader() {
  // 關閉外框線，避免文字繪製受到前一個圖形樣式影響。
  noStroke();

  // 設定標題文字顏色。
  fill(textColor);

  // 設定標題文字大小與粗細。
  textSize(layout.titleSize);
  textStyle(BOLD);

  // 繪製測驗標題。
  text("p5.js 簡易指令練習測驗", width / 2, layout.headerTitleY);

  // 設定進度文字顏色、大小與一般字重。
  fill(secondaryTextColor);
  textSize(layout.progressSize);
  textStyle(NORMAL);

  // 繪製目前題數與總題數。
  text(`第 ${currentQuestion + 1} 題／共 ${questions.length} 題`, width / 2, layout.progressY);
}

// 繪製目前題目的白色卡片與題目文字。
function drawQuestion() {
  // 取得目前題目的資料。
  const questionData = questions[currentQuestion];

  // 設定題目卡片填色與外框樣式。
  fill(optionColor);
  stroke(borderColor);
  strokeWeight(2);

  // 繪製題目卡片。
  rect(layout.questionX, layout.questionY, layout.questionWidth, layout.questionHeight, 18);

  // 關閉外框線並設定題目文字樣式。
  noStroke();
  fill(textColor);
  textSize(layout.questionTextSize);
  textStyle(BOLD);

  // 在題目卡片中央繪製可換行的題目內容。
  text(
    questionData.question,
    layout.questionX + layout.questionWidth / 2,
    layout.questionY + layout.questionHeight / 2,
    layout.questionWidth - layout.pagePadding * 2,
    layout.questionHeight - 12
  );
}

// 繪製目前題目的四個選項按鈕。
function drawOptions() {
  // 取得目前題目的資料。
  const questionData = questions[currentQuestion];

  // 計算選項區塊的左上角水平位置。
  const optionsLeft = (width - layout.contentWidth) / 2;

  // 逐一處理四個選項。
  for (let i = 0; i < questionData.options.length; i++) {
    // 計算目前選項所在的欄位索引。
    const column = i % layout.optionColumns;

    // 計算目前選項所在的列索引。
    const row = floor(i / layout.optionColumns);

    // 計算目前選項未播放動畫前的左上角水平位置。
    const baseX = optionsLeft + column * (layout.optionWidth + layout.optionButtonGap);

    // 計算目前選項未播放動畫前的左上角垂直位置。
    const baseY = layout.optionsTop + row * (layout.optionHeight + layout.optionButtonGap);

    // 以中心點儲存選項位置，方便動畫與點擊判定共用。
    let centerX = baseX + layout.optionWidth / 2;
    let centerY = baseY + layout.optionHeight / 2;

    // 判斷目前選項是否為正確答案。
    const isCorrectAnswer = answered && i === questionData.answer;

    // 判斷目前選項是否為使用者選錯的選項。
    const isWrongAnswer = answered && i === selectedOption && selectedOption !== questionData.answer;

    // 只有答錯時，才讓正確答案上下跳動。
    if (isCorrectAnswer && selectedOption !== questionData.answer) {
      // 使用正弦函數計算正確答案的上下位移。
      centerY += sin(correctAnimationTime) * min(8, layout.optionHeight * 0.14);
    }

    // 只有答錯選項時，才讓使用者所選錯誤答案左右移動。
    if (isWrongAnswer) {
      // 使用正弦函數計算錯誤答案的左右位移。
      centerX += sin(wrongAnimationTime) * min(12, width * 0.025);
    }

    // 判斷滑鼠目前是否位於這個選項內。
    const hovering = isPointInsideRect(mouseX, mouseY, centerX, centerY, layout.optionWidth, layout.optionHeight);

    // 根據作答狀態與滑鼠位置選擇選項背景顏色。
    if (isCorrectAnswer && selectedOption !== questionData.answer) {
      // 答錯時將正確答案塗成指定的淺綠色。
      fill(correctColor);
    } else if (isWrongAnswer) {
      // 將使用者答錯的選項塗成指定的橘紅色。
      fill(wrongColor);
    } else if (!answered && hovering) {
      // 尚未作答且指標移入時顯示滑過效果。
      fill(optionHoverColor);
    } else {
      // 其他情況使用一般白色選項背景。
      fill(optionColor);
    }

    // 設定選項外框顏色與粗細。
    stroke(borderColor);
    strokeWeight(2);

    // 因 rectMode 為 CORNER，所以將中心點轉換成左上角後繪製按鈕。
    rect(centerX - layout.optionWidth / 2, centerY - layout.optionHeight / 2, layout.optionWidth, layout.optionHeight, 14);

    // 關閉選項外框線，準備繪製選項文字。
    noStroke();

    // 設定選項文字樣式。
    fill(textColor);
    textSize(layout.optionTextSize);
    textStyle(NORMAL);

    // 繪製選項代號與選項內容。
    text(
      `${String.fromCharCode(65 + i)}. ${questionData.options[i]}`,
      centerX,
      centerY,
      layout.optionWidth - 16,
      layout.optionHeight - 8
    );
  }
}

// 繪製下一題或查看結果按鈕。
function drawNextButton() {
  // 版面計算已先更新按鈕位置，這裡再次同步尺寸以確保資料完整。
  nextButton.w = min(layout.contentWidth, 260);
  nextButton.h = layout.buttonHeight;
  nextButton.x = (width - nextButton.w) / 2;
  nextButton.y = height - layout.bottomPadding - nextButton.h;

  // 判斷滑鼠是否位於下一題按鈕內。
  const hovering = isPointInsideRect(mouseX, mouseY, nextButton.x + nextButton.w / 2, nextButton.y + nextButton.h / 2, nextButton.w, nextButton.h);

  // 尚未作答時停用按鈕，已作答時依照滑過狀態顯示顏色。
  if (!answered) {
    // 使用灰色表示目前尚不能進入下一題。
    fill(disabledButtonColor);
  } else if (hovering) {
    // 使用深色表示滑鼠正位於可使用按鈕上。
    fill(buttonHoverColor);
  } else {
    // 使用主要藍色表示按鈕可以使用。
    fill(buttonColor);
  }

  // 關閉外框線並繪製下一題按鈕。
  noStroke();
  rect(nextButton.x, nextButton.y, nextButton.w, nextButton.h, 14);

  // 設定按鈕文字樣式。
  fill("#ffffff");
  textSize(constrain(layout.buttonHeight * 0.36, 16, 21));
  textStyle(BOLD);

  // 最後一題顯示查看結果，其餘題目顯示下一題。
  text(currentQuestion === questions.length - 1 ? "查看結果" : "下一題", width / 2, nextButton.y + nextButton.h / 2);
}

// 繪製五題完成後的結果畫面。
function drawResultScreen() {
  // 計算結果卡片寬度，避免手機左右超出畫布。
  const resultWidth = min(width - layout.pagePadding * 2, 620);

  // 計算結果卡片高度，短螢幕會自動縮小。
  const resultHeight = min(390, max(280, height - layout.pagePadding * 2));

  // 計算結果卡片左上角的位置。
  const resultX = (width - resultWidth) / 2;
  const resultY = (height - resultHeight) / 2;

  // 設定結果卡片的填色與外框。
  fill(optionColor);
  stroke(borderColor);
  strokeWeight(2);

  // 繪製結果卡片。
  rect(resultX, resultY, resultWidth, resultHeight, 24);

  // 關閉外框線並繪製結果標題。
  noStroke();
  fill(textColor);
  textSize(constrain(min(width * 0.065, height * 0.10), 24, 42));
  textStyle(BOLD);
  text("測驗完成！", width / 2, resultY + resultHeight * 0.20);

  // 設定分數文字樣式並繪製答對題數。
  fill(buttonColor);
  textSize(constrain(min(width * 0.11, height * 0.17), 42, 68));
  text(`${score}／${questions.length}`, width / 2, resultY + resultHeight * 0.43);

  // 設定結果說明文字樣式。
  fill(secondaryTextColor);
  textSize(constrain(min(width * 0.035, height * 0.05), 16, 23));
  textStyle(NORMAL);
  text("答對題數", width / 2, resultY + resultHeight * 0.59);

  // 計算重新開始按鈕尺寸與左上角位置。
  restartButton.w = min(resultWidth - 32, 260);
  restartButton.h = constrain(resultHeight * 0.16, 44, 60);
  restartButton.x = (width - restartButton.w) / 2;
  restartButton.y = resultY + resultHeight - restartButton.h - max(20, resultHeight * 0.08);

  // 判斷滑鼠是否位於重新開始按鈕內。
  const hovering = isPointInsideRect(mouseX, mouseY, restartButton.x + restartButton.w / 2, restartButton.y + restartButton.h / 2, restartButton.w, restartButton.h);

  // 依照滑鼠是否滑入按鈕設定按鈕顏色。
  fill(hovering ? buttonHoverColor : buttonColor);

  // 繪製重新開始按鈕。
  rect(restartButton.x, restartButton.y, restartButton.w, restartButton.h, 14);

  // 設定重新開始文字樣式並繪製文字。
  fill("#ffffff");
  textSize(constrain(restartButton.h * 0.35, 16, 21));
  textStyle(BOLD);
  text("重新開始測驗", width / 2, restartButton.y + restartButton.h / 2);
}

// 處理滑鼠按下事件，讓電腦使用者可以作答與操作按鈕。
function mousePressed() {
  // 將滑鼠座標交給統一的指標事件處理函式。
  handlePointerPress(mouseX, mouseY);

  // 回傳 false，避免瀏覽器執行不必要的預設行為。
  return false;
}

// 處理觸控開始事件，讓手機與平板使用者可以操作測驗。
function touchStarted() {
  // 優先使用 p5.js 提供的第一個觸控座標。
  const pointerX = touches.length > 0 ? touches[0].x : mouseX;

  // 優先使用 p5.js 提供的第一個觸控座標。
  const pointerY = touches.length > 0 ? touches[0].y : mouseY;

  // 將觸控座標交給統一的指標事件處理函式。
  handlePointerPress(pointerX, pointerY);

  // 回傳 false，避免手機瀏覽器捲動畫面或觸發縮放。
  return false;
}

// 統一處理滑鼠與觸控的點擊位置。
function handlePointerPress(pointerX, pointerY) {
  // 如果測驗已結束，就只允許重新開始，不再處理題目選項。
  if (quizFinished) {
    // 判斷是否點擊重新開始按鈕。
    if (isPointInsideRect(pointerX, pointerY, restartButton.x + restartButton.w / 2, restartButton.y + restartButton.h / 2, restartButton.w, restartButton.h)) {
      // 重新初始化整個測驗。
      restartQuiz();
    }

    // 結束結果畫面的點擊處理。
    return;
  }

  // 取得目前題目的資料。
  const questionData = questions[currentQuestion];

  // 尚未作答時才檢查選項，防止重複作答與重複計分。
  if (!answered) {
    // 計算選項區塊左上角的水平位置。
    const optionsLeft = (width - layout.contentWidth) / 2;

    // 逐一檢查每一個選項是否被點擊。
    for (let i = 0; i < questionData.options.length; i++) {
      // 計算目前選項所在的欄位索引。
      const column = i % layout.optionColumns;

      // 計算目前選項所在的列索引。
      const row = floor(i / layout.optionColumns);

      // 計算目前選項的中心點座標。
      const optionCenterX = optionsLeft + column * (layout.optionWidth + layout.optionButtonGap) + layout.optionWidth / 2;
      const optionCenterY = layout.optionsTop + row * (layout.optionHeight + layout.optionButtonGap) + layout.optionHeight / 2;

      // 判斷指標是否位於目前選項內。
      const isSelected = isPointInsideRect(pointerX, pointerY, optionCenterX, optionCenterY, layout.optionWidth, layout.optionHeight);

      // 如果目前選項被點擊，就執行作答流程。
      if (isSelected) {
        // 記錄使用者選取的選項索引。
        selectedOption = i;

        // 將目前題目標記為已作答。
        answered = true;

        // 判斷使用者是否答對並更新分數。
        if (selectedOption === questionData.answer) {
          // 答對時將分數增加一分。
          score += 1;
        }

        // 將兩種答案動畫重設到起點。
        correctAnimationTime = 0;
        wrongAnimationTime = 0;

        // 找到選項後離開迴圈，避免同一次點擊重複處理。
        break;
      }
    }
  }

  // 只有作答後才允許點擊下一題或查看結果按鈕。
  if (answered && isPointInsideRect(pointerX, pointerY, nextButton.x + nextButton.w / 2, nextButton.y + nextButton.h / 2, nextButton.w, nextButton.h)) {
    // 判斷目前是否為最後一題。
    if (currentQuestion === questions.length - 1) {
      // 將測驗狀態改為完成，下一幀會顯示結果畫面。
      quizFinished = true;
    } else {
      // 將題目索引移動到下一題。
      currentQuestion += 1;

      // 將下一題設定為尚未作答。
      answered = false;

      // 清除上一題的選項選取紀錄。
      selectedOption = -1;

      // 重設兩種答案動畫時間。
      correctAnimationTime = 0;
      wrongAnimationTime = 0;
    }
  }
}

// 判斷一個點是否位於以中心點表示的矩形內。
function isPointInsideRect(pointX, pointY, centerX, centerY, rectWidth, rectHeight) {
  // 計算矩形的左邊界。
  const left = centerX - rectWidth / 2;

  // 計算矩形的右邊界。
  const right = centerX + rectWidth / 2;

  // 計算矩形的上邊界。
  const top = centerY - rectHeight / 2;

  // 計算矩形的下邊界。
  const bottom = centerY + rectHeight / 2;

  // 回傳指標是否同時落在水平與垂直邊界內。
  return pointX >= left && pointX <= right && pointY >= top && pointY <= bottom;
}

// 將測驗所有狀態還原成初始值。
function restartQuiz() {
  // 將目前題目重設為第一題。
  currentQuestion = 0;

  // 將答對題數重設為零。
  score = 0;

  // 將目前題目狀態重設為尚未作答。
  answered = false;

  // 將測驗完成狀態重設為尚未完成。
  quizFinished = false;

  // 清除使用者所選的選項。
  selectedOption = -1;

  // 將兩種答案動畫時間重設為零。
  correctAnimationTime = 0;
  wrongAnimationTime = 0;

  // 重新計算版面，確保重新開始時使用最新視窗尺寸。
  calculateLayout();
}

// 當瀏覽器視窗大小改變或裝置旋轉時執行此函式。
function windowResized() {
  // 將畫布調整成新的瀏覽器視窗寬度與高度。
  resizeCanvas(windowWidth, windowHeight);

  // 立即重新計算版面，避免等待下一個繪圖影格。
  calculateLayout();
}

