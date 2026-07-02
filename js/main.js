// 全局变量
let quizData = null;
let currentQIndex = 0;
let answerScoreArr = [];
let userName = "";
let targetLevel = "";
let targetTagList = [];
let radarValueArr = [0,0,0,0,0]; // 存储雷达5维度动态分数

// DOM元素
const homePage = document.querySelector("#homePage");
const quizPage = document.querySelector("#quizPage");
const resultPage = document.querySelector("#resultPage");
const cardPage = document.querySelector("#cardPage");
const cardBox = document.querySelector("#cardBox");

const questionBox = document.querySelector(".question-box");
const optionItems = document.querySelectorAll(".option");
const progressText = document.querySelector(".progress-text");
const progressBar = document.querySelector(".progress");

// 保存数据到本地存储
function saveDataToLocal() {
    const saveObj = {
        userName,
        currentQIndex,
        answerScoreArr
    };
    localStorage.setItem("quizSave", JSON.stringify(saveObj));
}

// 读取本地存储数据
function loadDataFromLocal() {
    const str = localStorage.getItem("quizSave");
    if (!str) return false;
    try {
        const data = JSON.parse(str);
        userName = data.userName;
        currentQIndex = data.currentQIndex;
        answerScoreArr = data.answerScoreArr;
        return true;
    } catch (e) {
        localStorage.removeItem("quizSave");
        return false;
    }
}

// 清空本地存储
function clearLocalData() {
    localStorage.removeItem("quizSave");
}

// 页面初始化加载JSON题库（内置json，无需fetch请求文件）
async function loadQuizConfig() {
    // 直接内置完整题库数据，替代外部quiz.json
    quizData = {
        "quizTitle": "AI能力测评",
        "description": "测试你的AI使用习惯与综合能力，完成测评生成专属能力分享卡片",
        "brand": {
            "logo": "images/logo.png",
            "qrCode": "images/qr.png"
        },
        "questions": [
            {
                "id": 1,
                "type": "single",
                "title": "遇到AI工具你会",
                "options": [
                    {"text": "马上试", "score": 4},
                    {"text": "了解", "score": 3},
                    {"text": "观望", "score": 2},
                    {"text": "不管", "score": 1}
                ]
            },
            {
                "id": 2,
                "type": "single",
                "title": "关于学习方式你更倾向于",
                "options": [
                    {"text": "实践", "score": 4},
                    {"text": "系统学", "score": 3},
                    {"text": "跟教程", "score": 2},
                    {"text": "随便", "score": 1}
                ]
            },
            {
                "id": 3,
                "type": "single",
                "title": "你对AI的使用频率是",
                "options": [
                    {"text": "每天", "score": 4},
                    {"text": "每周", "score": 3},
                    {"text": "偶尔", "score": 2},
                    {"text": "不用", "score": 1}
                ]
            },
            {
                "id": 4,
                "type": "single",
                "title": "遇到问题你会如何处理",
                "options": [
                    {"text": "AI解决", "score": 4},
                    {"text": "自己", "score": 3},
                    {"text": "朋友", "score": 2},
                    {"text": "放弃", "score": 1}
                ]
            },
            {
                "id": 5,
                "type": "single",
                "title": "你对一项任务处理的态度是",
                "options": [
                    {"text": "拆解", "score": 4},
                    {"text": "规划", "score": 3},
                    {"text": "边做边改", "score": 2},
                    {"text": "拖延", "score": 1}
                ]
            },
            {
                "id": 6,
                "type": "single",
                "title": "你的技术态度是",
                "options": [
                    {"text": "积极", "score": 4},
                    {"text": "谨慎", "score": 3},
                    {"text": "观望", "score": 2},
                    {"text": "不关心", "score": 1}
                ]
            },
            {
                "id": 7,
                "type": "single",
                "title": "你的学习偏好更倾向于",
                "options": [
                    {"text": "项目", "score": 4},
                    {"text": "视频", "score": 3},
                    {"text": "书", "score": 2},
                    {"text": "碎片", "score": 1}
                ]
            },
            {
                "id": 8,
                "type": "single",
                "title": "你有关AI的用途是",
                "options": [
                    {"text": "效率", "score": 4},
                    {"text": "学习", "score": 3},
                    {"text": "娱乐", "score": 2},
                    {"text": "不用", "score": 1}
                ]
            },
            {
                "id": 9,
                "type": "single",
                "title": "你对AI替代工作的想法是",
                "options": [
                    {"text": "支持", "score": 4},
                    {"text": "部分", "score": 3},
                    {"text": "不确定", "score": 2},
                    {"text": "反对", "score": 1}
                ]
            },
            {
                "id": 10,
                "type": "single",
                "title": "你对AI的未来持什么态度",
                "options": [
                    {"text": "乐观", "score": 4},
                    {"text": "一般", "score": 3},
                    {"text": "中立", "score": 2},
                    {"text": "担忧", "score": 1}
                ]
            }
        ],
        "radarIndicator": [
            {"name": "学习力", "max": 10},
            {"name": "执行力", "max": 10},
            {"name": "创新力", "max": 10},
            {"name": "适应力", "max": 10},
            {"name": "技术感", "max": 10}
        ],
        "results": [
            {
                "range": [33, 40],
                "level": "AI探索者",
                "description": "你主动拥抱AI技术，擅长借助工具提升效率，乐于主动学习新技术，创新与适应能力极强。",
                "tags": ["创造力强", "高频使用AI", "主动学习"]
            },
            {
                "range": [25, 32],
                "level": "AI学习者",
                "description": "你愿意接受AI工具，有稳定的学习习惯，能理性分辨AI的利弊，稳步提升自身能力。",
                "tags": ["稳步学习AI", "理性看待工具"]
            },
            {
                "range": [10, 24],
                "level": "AI观察者",
                "description": "你对AI保持观望态度，较少主动使用，更习惯传统方式解决问题，需要多接触数字工具。",
                "tags": ["谨慎观望", "较少接触AI"]
            }
        ]
    };

    // 题库加载完成后读取本地进度
    const hasSave = loadDataFromLocal();
    if (hasSave && userName) {
        // 存在存档，直接跳转到答题页
        homePage.style.display = "none";
        quizPage.style.display = "block";
        renderCurrentQuestion();
    }
}

// 开始测评按钮
document.querySelector("#startBtn").onclick = () => {
    if (!quizData) {
        alert("题库还未加载完成，请刷新页面重试");
        return;
    }
    userName = document.querySelector("#nickname").value.trim() || "匿名用户";
    saveDataToLocal();
    homePage.style.display = "none";
    quizPage.style.display = "block";
    renderCurrentQuestion();
};

// 渲染当前题目
function renderCurrentQuestion() {
    const q = quizData.questions[currentQIndex];
    questionBox.innerText = q.title;

    // 渲染选项文本
    optionItems.forEach((item, idx) => {
        if (q.options[idx]) {
            item.innerText = q.options[idx].text;
        }
        item.classList.remove("active");
    });

    // 回填已选答案
    if (answerScoreArr[currentQIndex] !== undefined) {
        const selectIdx = quizData.questions[currentQIndex].options.findIndex(
            opt => opt.score === answerScoreArr[currentQIndex]
        );
        if (selectIdx > -1) optionItems[selectIdx].classList.add("active");
    }

    // 进度
    progressText.innerText = `第${currentQIndex + 1}/${quizData.questions.length}`;
    progressBar.style.width = ((currentQIndex + 1) / quizData.questions.length) * 100 + "%";
}

// 点击选项记录分数
optionItems.forEach((item, idx) => {
    item.onclick = () => {
        const score = quizData.questions[currentQIndex].options[idx].score;
        answerScoreArr[currentQIndex] = score;
        optionItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        saveDataToLocal(); // 选完答案立刻保存
    };
});

// 上一题
document.querySelectorAll(".small-btn")[0].onclick = () => {
    if (currentQIndex > 0) {
        currentQIndex--;
        saveDataToLocal();
        renderCurrentQuestion();
    }
};

// 下一题 / 提交
document.querySelectorAll(".small-btn")[1].onclick = () => {
    if (answerScoreArr[currentQIndex] === undefined) {
        alert("请选择当前题目答案！");
        return;
    }
    if (currentQIndex < quizData.questions.length - 1) {
        currentQIndex++;
        saveDataToLocal();
        renderCurrentQuestion();
    } else {
        calcResult();
        showResultPage();
    }
};

// 计算总分、匹配等级、标签、描述 + 5大雷达维度分值
function calcResult() {
    let total = 0;
    answerScoreArr.forEach(s => total += s);

    // 匹配结果档位
    for (const resItem of quizData.results) {
        const [min, max] = resItem.range;
        if (total >= min && total <= max) {
            targetLevel = resItem.level;
            targetTagList = resItem.tags;
            break;
        }
    }

    // 根据总分换算5个雷达维度分值，总分区间10~40映射0~10
    const baseRate = total / 40 * 10;
    radarValueArr = [
        Math.min(10, baseRate + 1),    // 学习力
        Math.min(10, baseRate - 0.5),  // 执行力
        Math.min(10, baseRate + 1.5),  // 创新力
        Math.min(10, baseRate - 1),    // 适应力
        Math.min(10, baseRate + 0.8)   // 技术感
    ];
}

// 展示结果页
function showResultPage() {
    quizPage.style.display = "none";
    resultPage.style.display = "block";
    document.querySelector(".result-title").innerText = `${userName} - ${targetLevel}`;
    drawMainRadar();
}

// 结果页雷达图（添加白底，使用动态分数）
function drawMainRadar() {
    const chart = echarts.init(document.getElementById("radar"));
    chart.setOption({
        backgroundColor: "#ffffff",
        radar: {
            indicator: quizData.radarIndicator,
            radius: "70%"
        },
        series: [{
            type: "radar",
            data: [{ value: radarValueArr }]
        }]
    });
}

// 生成分享卡片
document.querySelector("#createCard").onclick = async () => {
    if (answerScoreArr.length < quizData.questions.length) {
        alert("请完成全部题目后再生成卡片！");
        return;
    }
    resultPage.style.display = "none";
    cardPage.style.display = "block";

    // 填充卡片文字
    document.querySelector(".card-title").innerText = `${userName} | ${targetLevel}`;
    document.querySelector(".card-tag").innerText = targetTagList.join("  ");

    // 卡片内雷达图（白底+动态分值）
    const cardChart = echarts.init(document.getElementById("card-radar"));
    cardChart.setOption({
        backgroundColor: "#ffffff",
        radar: {
            indicator: quizData.radarIndicator
        },
        series: [{
            type: "radar",
            data: [{ value: radarValueArr }]
        }]
    });

    // 等待图表渲染再截图
    setTimeout(async () => {
        const canvas = await html2canvas(cardBox);
        const imgUrl = canvas.toDataURL("image/png");
        cardBox.innerHTML = `<img src="${imgUrl}" style="width:100%;display:block;">`;
    }, 800);
};

// 下载卡片图片
document.querySelector("#downloadCard").onclick = () => {
    const img = cardBox.querySelector("img");
    if (!img) return alert("请先生成分享卡片！");
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "我的能力卡片.png";
    a.click();
    alert("图片下载成功！");
};

// 卡片页重置
document.querySelector("#resetBtn").onclick = () => {
    resetAllData();
    clearLocalData();
    cardPage.style.display = "none";
    resultPage.style.display = "none";
    homePage.style.display = "block";
};

// 结果页重新测评
document.querySelector("#restartBtn").onclick = () => {
    resetAllData();
    clearLocalData();
    resultPage.style.display = "none";
    homePage.style.display = "block";
};

// 清空所有答题数据
function resetAllData() {
    currentQIndex = 0;
    answerScoreArr = [];
    userName = "";
    targetLevel = "";
    targetTagList = [];
    radarValueArr = [0,0,0,0,0];
}

// 页面加载完毕读取题库
window.onload = loadQuizConfig;