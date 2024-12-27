// 取得頁面元素
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 聊天機器人問題與答案資料
let faqData = [];

// 從伺服器加載 JSON 資料
fetch('data/蝦皮.json')
    .then(response => response.json())
    .then(data => {
        faqData = data;  // 將 JSON 資料儲存到 faqData 變數
        console.log("FAQ 資料已加載:", faqData);  // 確認資料是否成功加載
    })
    .catch(error => {
        console.error("無法加載 FAQ 資料", error);
    });

// 顯示訊息
function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 根據用戶的問題來尋找回答
function getAnswer(userMessage) {
    // 使用關鍵字匹配來找答案
    for (let category in faqData) {
        const categoryData = faqData[category];
        const keywords = categoryData.keywords;
        const answer = categoryData.answer;

        // 遍歷關鍵字並檢查用戶訊息中是否包含這些關鍵字
        for (let i = 0; i < keywords.length; i++) {
            if (userMessage.includes(keywords[i])) {
                console.log(`找到匹配的關鍵字：${keywords[i]}`);  // 用於調試，顯示找到的關鍵字
                return answer;  // 找到匹配的答案
            }
        }
    }
    return "抱歉，我不太明白您的問題。請問您有其他問題嗎？";  // 沒有找到匹配答案的情況
}

// 送出訊息
sendBtn.addEventListener('click', function () {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        // 顯示用戶訊息
        displayMessage(userMessage, 'user');
        userInput.value = '';

        // 回應機器人訊息
        const botResponse = getAnswer(userMessage);
        setTimeout(() => {
            displayMessage(botResponse, 'bot');
        }, 500);
    }
});

// 按下 Enter 鍵送出訊息
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
