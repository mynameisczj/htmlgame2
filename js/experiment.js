class LossAversionExperiment {
    constructor() {
        // 初始化UI元素
        this.questionsContainer = document.getElementById('questions-container');
        this.resultContainer = document.getElementById('result-container');
        this.analysisResult = document.getElementById('analysis-result');
        this.submitBtn = document.getElementById('submit-btn');
        this.consentForm = document.getElementById('consent-form');
        this.dataSubmitBtn = document.getElementById('data-submit-btn');
        this.consentCheckbox = document.getElementById('consent-checkbox');
        this.loadingMessage = document.getElementById('loading-message');
        
        // 检查元素是否存在
        if (!this.submitBtn) {
            console.error('提交按钮未找到！');
            return;
        }

        // 初始化图表
        this.chart = null;
        this.initChart();
        
        // 绑定事件
        this.submitBtn.addEventListener('click', () => this.submitAnswers());
        this.dataSubmitBtn.addEventListener('click', () => this.submitData());
        this.consentCheckbox.addEventListener('change', (e) => {
            this.dataSubmitBtn.disabled = !e.target.checked;
        });
        
        // 隐藏加载消息
        if (this.loadingMessage) {
            this.loadingMessage.classList.add('hidden');
        }
    }
    
    initChart() {
        const ctx = document.getElementById('behavior-chart')?.getContext('2d');
        if (!ctx) return;
        
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: '是否表现典型损失厌恶',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    async submitAnswers() {
        console.log('开始提交答案');
        try {
            // 收集所有答案
            const answers = [];
            for (let i = 1; i <= 7; i++) {
                const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
                if (!selectedOption) {
                    alert(`请回答问题${i}`);
                    return;
                }
                answers.push(selectedOption.value);
            }
            
            // 分析答案
            this.analyzeAnswers(answers);
            
            // 显示结果
            this.questionsContainer.classList.add('hidden');
            this.resultContainer.classList.remove('hidden');
            this.consentForm.classList.remove('hidden');
            
            // 滚动到结果区域
            this.resultContainer.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('提交答案时出错:', error);
            alert('提交过程中发生错误，请重试');
        }
    }
    
    analyzeAnswers(answers) {
        let lossAversionScore = 0;
        let analysisText = '';
        
        // 问题1分析
        if (answers[0] === 'B') {
            analysisText += '<p><strong>问题1:</strong> 你选择了确定收益选项 - 表现出收益情境的风险规避</p>';
            lossAversionScore += 1;
        } else {
            analysisText += '<p><strong>问题1:</strong> 你选择了风险收益选项</p>';
        }
        
        // 问题2分析
        if (answers[1] === 'A') {
            analysisText += '<p><strong>问题2:</strong> 你选择了风险损失选项 - 典型损失厌恶行为</p>';
            lossAversionScore += 2;
        } else {
            analysisText += '<p><strong>问题2:</strong> 你选择了确定损失选项</p>';
        }
        
        // 问题3分析
        if (answers[2] === 'B') {
            analysisText += '<p><strong>问题3:</strong> 你拒绝风险 - 即使期望值为正(500元)</p>';
            lossAversionScore += 1;
        } else {
            analysisText += '<p><strong>问题3:</strong> 你愿意承担小风险获取更大收益</p>';
        }
        
        // 问题4分析
        if (answers[3] === 'B') {
            analysisText += '<p><strong>问题4:</strong> 你受负面框架影响 - 尽管两种表述数学等价</p>';
            lossAversionScore += 1;
        } else {
            analysisText += '<p><strong>问题4:</strong> 你受框架效应影响较小</p>';
        }
        
        // 问题5分析
        if (answers[4] === 'A') {
            analysisText += '<p><strong>问题5:</strong> 你表现出沉没成本效应</p>';
            lossAversionScore += 1;
        } else {
            analysisText += '<p><strong>问题5:</strong> 你能理性忽略沉没成本</p>';
        }
        
        // 问题6分析
        if (answers[5] === 'A') {
            analysisText += '<p><strong>问题6:</strong> 急性损失让你更难受 - 典型损失厌恶</p>';
            lossAversionScore += 2;
        } else {
            analysisText += '<p><strong>问题6:</strong> 你对分期损失和一次性损失感受相似</p>';
        }
        
        // 问题7分析
        if (answers[6] === 'A') {
            analysisText += '<p><strong>问题7:</strong> 亏损后风险偏好增加 - 试图挽回损失</p>';
            lossAversionScore += 2;
        } else {
            analysisText += '<p><strong>问题7:</strong> 亏损后你变得更加保守</p>';
        }
        
        // 计算损失厌恶程度
        const totalPossible = 10;
        const aversionLevel = lossAversionScore / totalPossible;
        
        // 显示分析结果
        analysisText += `
            <h3>=== 你的损失厌恶分析报告 ===</h3>
            <p><strong>损失厌恶得分:</strong> ${lossAversionScore}/${totalPossible}</p>
        `;
        
        if (aversionLevel < 0.3) {
            analysisText += `
                <p><strong>你的损失厌恶程度:</strong> 低于平均水平</p>
                <p><em>说明:</em> 你对损失的敏感度较低，可能更理性看待得失</p>
            `;
        } else if (aversionLevel < 0.7) {
            analysisText += `
                <p><strong>你的损失厌恶程度:</strong> 平均水平</p>
                <p><em>说明:</em> 你表现出典型的损失厌恶行为，与大多数人相似</p>
            `;
        } else {
            analysisText += `
                <p><strong>你的损失厌恶程度:</strong> 高于平均水平</p>
                <p><em>说明:</em> 你对损失特别敏感，可能过度规避风险</p>
            `;
        }
        
        analysisText += `
            <h3>=== 心理学解释 ===</h3>
            <p>1. 损失厌恶指人们对损失的痛苦感超过同等收益的快乐感</p>
            <p>2. 典型表现为: 收益情境风险规避，损失情境风险寻求</p>
            <p>3. 进化角度: 对威胁的敏感性有助于生存</p>
            <p>4. 金融影响: 可能导致过早卖出赢利股，长期持有亏损股</p>
        `;
        
        this.analysisResult.innerHTML = analysisText;
        
        // 更新图表
        this.updateChart(answers);
        
        // 保存答案供后续提交
        this.userAnswers = answers;
        this.lossAversionScore = lossAversionScore;
    }
    
    updateChart(answers) {
        if (!this.chart) return;
        
        const questions = [
            "Q1: 收益选择", 
            "Q2: 损失选择", 
            "Q3: 混合得失",
            "Q4: 框架效应", 
            "Q5: 沉没成本", 
            "Q6: 损失分期",
            "Q7: 风险反转"
        ];
        
        // 编码答案: 1=典型损失厌恶行为, 0=非典型
        const coding = [
            answers[0] === 'B' ? 1 : 0,
            answers[1] === 'A' ? 1 : 0,
            answers[2] === 'B' ? 1 : 0,
            answers[3] === 'B' ? 1 : 0,
            answers[4] === 'A' ? 1 : 0,
            answers[5] === 'A' ? 1 : 0,
            answers[6] === 'A' ? 1 : 0
        ];
        
        const colors = coding.map(c => c === 1 ? 'rgba(75, 192, 192, 0.7)' : 'rgba(54, 162, 235, 0.7)');
        
        this.chart.data.labels = questions;
        this.chart.data.datasets[0].data = coding;
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chart.update();
    }
    
    async submitData() {
        if (!this.consentCheckbox.checked) return;
        
        this.dataSubmitBtn.disabled = true;
        this.dataSubmitBtn.textContent = '提交中...';
        
        try {
            const timestamp = new Date().toISOString();
            const data = {
                timestamp,
                answers: this.userAnswers,
                score: this.lossAversionScore,
                userAgent: navigator.userAgent
            };

            // 这里替换为你的实际API端点
            const response = await fetch('https://your-api-endpoint.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('数据提交失败');
            }

            this.dataSubmitBtn.textContent = '提交成功';
            setTimeout(() => {
                this.dataSubmitBtn.textContent = '提交数据';
                this.dataSubmitBtn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('提交错误:', error);
            this.dataSubmitBtn.textContent = '提交失败，请重试';
            this.dataSubmitBtn.disabled = false;
        }
    }
}
