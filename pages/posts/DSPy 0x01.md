---

title: DSPy 0x01

# date: 2024-05-02 02:28:12

tags: [LLM, AI, Python, DSPy]
categories: \[技术笔记, 框架]
toc: true
top: 6
aside: false
------------

新框架层出不穷，或许你也想通过机器学习训练得到最佳 prompt？

![dspylogo](https://dspy.ai/static/img/dspy_logo.png)

<!-- more -->

## DSPy

**LLM 的结果对 prompt 的扰动特别敏感**（参考[《Quantifying Language Models' Sensitivity...》](https://arxiv.org/abs/2310.11324)），一处轻微的改动就能带来巨大的效果提升，最知名的套路莫过于 CoT 的 *let's think step by step*，而其他各种 prompting 奇技淫巧更是层出不穷，比如「好好解答，就给 10 美元的奖励」、「如果不认真执行任务，就随机杀死一个老奶奶」等等。

一条 prompt 的设计就能让效果天差地别，而如果一个任务需要结合 pipeline 来完成，**每个步骤分别使用不同的 prompt 模板，前后相互依赖，牵一发而动全身，再通过误差传递，最终一致性就更难以保证**。而且随着系统越来越复杂，prompt 越积越多，维护成本也水涨船高。**很多时候，开发者的精力都耗费在 prompt 的设计、模型选择、参数微调上，耗时耗力却收效甚微**。

作为一种解决方案，Stanford 提出的 DSPy 则从另一个角度出发，强调「编程」而非「提示」，**让开发者从繁琐的 prompt 设计中解放出来，从而专注于解决方案的构建**。

```python
import os
from dotenv import load_dotenv
import dspy

load_dotenv()

lm = dspy.LM(
    model="deepseek-chat",
    api_key=os.environ["DEEPSEEK_API_KEY"],
    api_base=os.environ["DEEPSEEK_BASE_URL"],
    system_prompt="You are an intelligent assistant.",
)
dspy.configure(lm=lm)
```

### 简单示例：情感分析

让我们创建一个简单的情感分析程序。DSPy 的核心理念是通过「签名」（Signature）定义任务的输入输出，然后让框架自动优化 prompt。

```python
# 定义一个简单的情感分析任务
class SentimentAnalysis(dspy.Signature):
    """分析给定文本的情感倾向"""
    text = dspy.InputField(desc="需要分析的文本")
    sentiment = dspy.OutputField(desc="情感倾向：positive（积极）、negative（消极）或 neutral（中性）")

# 创建一个预测器
sentiment_predictor = dspy.Predict(SentimentAnalysis)

# 测试几个例子
test_texts = [
    "今天天气真好，心情非常愉快！",
    "这个产品质量太差了，完全是浪费钱。",
    "这本书内容还可以，不算特别出色但也不差。"
]

for text in test_texts:
    result = sentiment_predictor(text=text)
    print(f"文本: {text}")
    print(f"情感: {result.sentiment}")
    print("-" * 50)
```

```
文本: 今天天气真好，心情非常愉快！
情感: positive
--------------------------------------------------
文本: 这个产品质量太差了，完全是浪费钱。
情感: negative
--------------------------------------------------
文本: 这本书内容还可以，不算特别出色但也不差。
情感: neutral
--------------------------------------------------
```

### 使用 Chain of Thought（思维链）

DSPy 内置了 Chain of Thought 功能，可以让模型展示推理过程：

```python
# 定义一个数学问题求解任务
class SimpleMathProblem(dspy.Signature):
    """解决数学应用题"""
    question = dspy.InputField(desc="数学问题描述")
    answer = dspy.OutputField(desc="问题的答案")

# 使用 ChainOfThought 让模型展示推理过程
simple_math_solver = dspy.ChainOfThought(SimpleMathProblem)

# 测试一个数学问题
question = "小明有 16 个苹果，他给了小红 3 个，又从果园摘了 8 个。请问小明现在有多少个苹果？"

result = simple_math_solver(question=question)
print(f"问题: {question}")
print(f"推理过程: {result.reasoning}")  # ChainOfThought 会自动生成推理过程
print(f"答案: {result.answer}")
```

```
问题: 小明有 16 个苹果，他给了小红 3 个，又从果园摘了 8 个。请问小明现在有多少个苹果？
推理过程: 1. 小明一开始有 16 个苹果。
2. 他给了小红 3 个苹果，所以剩下的苹果数量是 16 - 3 = 13 个。
3. 然后他又从果园摘了 8 个苹果，所以现在的苹果数量是 13 + 8 = 21 个。
答案: 21
```

### 创建自定义模块

DSPy 允许你创建自定义模块来组合多个步骤，实现更复杂的逻辑：

```python
# 定义两个签名：总结和评分
class Summarize(dspy.Signature):
    """总结文本的主要内容"""
    text = dspy.InputField()
    summary = dspy.OutputField(desc="简洁的总结，不超过50字")

class RateSummary(dspy.Signature):
    """评价总结的质量"""
    summary = dspy.InputField()
    score = dspy.OutputField(desc="1-10的评分")
    reason = dspy.OutputField(desc="评分理由")

# 创建一个组合模块
class SummarizeAndRate(dspy.Module):
    def __init__(self):
        super().__init__()
        self.summarize = dspy.ChainOfThought(Summarize)
        self.rate = dspy.Predict(RateSummary)

    def forward(self, text):
        # 先总结
        summary_result = self.summarize(text=text)
        # 再评分
        rating_result = self.rate(summary=summary_result.summary)

        return dspy.Prediction(
            summary=summary_result.summary,
            rationale=summary_result,
            score=rating_result.score,
            reason=rating_result.reason
        )

# 使用组合模块
summarizer = SummarizeAndRate()

text = """
今天是星期八
"""

result = summarizer(text=text)
print(f"总结: {result.summary}")
print(f"推理过程: {result.rationale.reasoning}")
print(f"评分: {result.score}")
print(f"评分理由: {result.reason}")
```

```
总结: 文本提到“今天是星期八”，超出常规一周七天。
推理过程: The text simply states "今天是星期八" (Today is the eighth day of the week). Since a standard week only has seven days, this statement is either a playful or nonsensical remark, or it could imply an unconventional calendar system.
评分: 3
评分理由: 总结中提到的“星期八”明显不符合常识，一周只有七天，这样的错误影响了总结的可信度和质量。
```

### 数学推理优化示例

接下来，我们参考 DSPy 官方教程，展示如何使用 DSPy 框架来构建和优化数学推理模块。这个例子将展示：

1. 使用 MATH 数据集进行训练
2. 使用优化器自动改进 prompt
3. 评估模型性能

从 MATH 基准测试中加载数学问题数据集。

```python
from dspy.datasets import MATH

dataset = MATH(subset='algebra')
print(f"训练集数量: {len(dataset.train)}")
print(f"验证集数量: {len(dataset.dev)}")

example = dataset.train[0]
print(f"样例问题: {example.question}")
print(f"样例答案: {example.answer}")
```

```
训练集数量: 350
验证集数量: 350
样例问题: The doctor has told Cal O'Ree that during his ten weeks of working out at the gym, he can expect each week's weight loss to be $1\%$ of his weight at the end of the previous week. His weight at the beginning of the workouts is $244$ pounds. How many pounds does he expect to weigh at the end of the ten weeks? Express your answer to the nearest whole number.
样例答案: 221
```

> 为了确定 Cal O’Ree 在连续十周减肥后的预期体重，我们可以将他的减肥过程建模为按百分比递减的复合过程。每周，他的体重都会乘以 \$0.99\$（因为他每周减轻 \$1%\$ 的体重）。
> 已知：初始体重（\$W\_0\$）= 244 磅
> 每周体重减少系数 = \$0.99\$（因为 \$1 - 0.01 = 0.99\$）
> 周数（\$n\$）= 10

经过 \$n\$ 周后的体重（\$W\_n\$）可以使用复合减少公式计算：

> \$W\_n = W\_0 \times (0.99)^n\$
>
> 代入已知数值：
> \$W\_{10} = 244 \times (0.99)^{10}\$
>
> 首先，计算 \$(0.99)^{10}\$：
> \$(0.99)^{10} \approx 0.904382\$
>
> 然后，将其与初始体重相乘：
> \$W\_{10} = 244 \times 0.904382 \approx 220.669\$
>
> 四舍五入到最接近的整数：
> \$W\_{10} \approx 221 ,\text{磅}\$

```python
module = dspy.ChainOfThought("question -> answer")
module(question=example.question)
```

```
Prediction(
    reasoning="...",
    answer='221'
)
```

在未进行任何优化的情况下，直接评估 CoT 模块在开发集上的表现：

```python
THREADS = 24
kwargs = dict(num_threads=THREADS, display_progress=True, display_table=5)
evaluate = dspy.Evaluate(devset=dataset.dev, metric=dataset.metric, **kwargs)

evaluate(module)
```

```
Average Metric: 204.00 / 350 (58.3%)
```

> 评估结果（节选）：
>
> | question(摘要)                                       | example\_answer | pred\_answer | correct |
> | -------------------------------------------------- | --------------: | -----------: | :-----: |
> | What is the smallest integer value of \$c\$ ...    |               1 |            1 |    ✅    |
> | What is the least value of \$x\$ ...               |              -4 |           -4 |    ✅    |
> | Evaluate \$\left\lceil -\frac{7}{4}\right\rceil\$. |              -1 |           -1 |    ✅    |
> | A triangle has vertices at ...                     |              10 |           10 |    ✅    |
> | Let \$f(x)=x+2\$ and \$g(x)=1/f(x)\$ ...           |               1 |            1 |    ✅    |

---

接下来，使用 DSPy 的 **MIPROv2** 优化器对模块进行编译和优化。这个过程利用训练集中的例子，自动为语言模型生成更有效的提示（prompt）。

MIPROv2 是一种 Prompt 优化器：

* 使用 **混合整数规划**（Mixed Integer Programming）对 Prompt 组合进行最优选择
* 在 DSPy 中用于搜索 prompt 组合，**自动生成更优 prompt**

```python
kwargs = dict(num_threads=THREADS, teacher_settings=dict(lm=lm), prompt_model=lm)
optimizer = dspy.MIPROv2(metric=dataset.metric, auto="medium", **kwargs)

kwargs = dict(requires_permission_to_run=False, max_bootstrapped_demos=4, max_labeled_demos=4)
optimized_module = optimizer.compile(module, trainset=dataset.train, **kwargs)
```

```
# 运行日志（节选）
Default program score: 55.71
Full eval new best: 81.43
Full eval new best: 91.79
Full eval new best: 93.21
Returning best identified program with score 93.21!
```

搜索优化总耗时约 **2 小时**，DeepSeek API 消耗约 **25 元**。
总得分为 **253 / 280（90.4%）**。

优化过程中，DSPy 分别尝试了多次不同参数或提示词配置，性能逐步提升，例如：

* 初始 **55.71**
* 调优后提升到 **81.43**、**91.79**，最高到 **93.21**

DSPy 将 prompt 参数视为可优化的「模块」，通过：

* 采样生成不同的 prompt 组合
* 计算目标函数得分
* 使用强化学习或近似梯度方法，逐步更新 prompt 配置

与仅优化单个 prompt 不同，这里采用 **端到端的联合优化（joint optimization）** 方法：

* 同时考虑 prompt A 的变化对后续 prompt B、C 阶段结果的影响
* 在全局范围内搜索最优的 prompt 配置

## 不足

1. **计算成本较高**
   DSPy 在优化过程中需要大量调用大模型接口，特别是使用 Teleprompt 或 MIPRO 等联合优化算法时，API 调用次数极多，容易导致计算资源消耗和使用成本显著增加。

2. **优化时间较长**
   联合优化任务通常需要多轮迭代，每次迭代都包含对模型的调用和评估，整体运行时间远高于单一 prompt 调优方法，影响工程效率。

3. **任务适用范围有限**
   对于简单或中等复杂度的任务，DSPy 的端到端联合优化可能带来过高的计算开销，优化收益与成本不成正比，存在“资源过度投入”风险。

4. **高度依赖目标函数设计**
   优化效果取决于目标函数（metric）的科学设计。如果评估指标不完善或偏差较大，最终优化结果可能无法真正提升模型实际性能。

5. **生态体系尚不成熟**
   作为新兴框架，DSPy 的文档、教程及社区案例仍在完善中，缺乏成熟的生产级应用模板，实际落地需要研发团队投入更多时间进行探索与验证。

## 总结

总体而言，DSPy 框架为基于大模型的推理程序开发提供了**高效、模块化的解决方案**，通过**清晰的输入输出定义**、**提示词自动优化**和**可插拔的评测体系**，帮助开发者系统化地设计与迭代 AI 推理任务，提升开发效率和效果。
然而，DSPy 也存在**计算成本高**、**优化时间长**，以及**对评估指标设计依赖强**等劣势，且生态尚在完善中，生产落地仍需谨慎评估与验证。
