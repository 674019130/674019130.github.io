---
title: Google Prompt Engineering 白皮书阅读笔记
# date: 2024-05-02 02:28:12
tags: [Prompt Engineering, LLM, AI, 读书笔记]
categories: [技术笔记, AI与大模型]
toc: true
top: 6
aside: false
---


> You don't need to be a data scientist or a machine learning engineer – everyone can write a prompt.

![CleanShot 2025-04-16 at 12.47.13@2x.png](https://s2.loli.net/2025/04/16/zEiAw6lyxd3DpRK.png)

<!-- more -->
# Google Prompt Engineering 白皮书阅读笔记

Origin PDF link: https://drive.google.com/file/d/1AbaBYbEa_EbPelsT40-vj64L-2IwUJHy/view?pli=1


## 参数`['temperature', 'top_p', 'top_k', 'max_tokens']`

### `temperature`
模型生成文本的随机性，一般来说，越大的值代表模型选取时随机性越大。
对于创作型任务，可以设置一个较大的值，使得模型生成更加多样化的文本。
对于类似数学计算，有确定答案的任务，可以设置一个较小的值，使得模型生成更加确定性的文本。

$0$记为 greedy decoding。

### `top_p`
选取概率最高的 token 的百分比。

### `top_k`
选取概率最高的 k 个 token。

### `max_tokens`
允许模型生成 token 的最大数量。

其中，`temperature`、`top_p` 和 `top_k` 之间互相作用，通常不会同时设置三种参数。

----

## 提示词分类

### `['Zero prompting', 'Few shot prompting']`
零样本提示：
不提供任何示例，直接给出提示词。

少样本提示：
提供少量示例，帮助模型理解任务，包括正例、反例，和 corner case。

### `['System', 'Role, 'Contextual']`
系统提示：
就像舞台剧的舞台一样。

角色提示：
告诉大模型舞台剧里应该扮演的角色。

上下文提示：
舞台剧的场景布置、具体细节。

### `['Step-back prompting']`
回退推理提示：
它提示 LLM 首先考虑与手头特定任务相关的一个更普遍的问题，然后将该普遍问题的答案输入到后续针对特定任务的提示中。**这种「回退」允许 LLM 在尝试解决具体问题之前激活相关的背景知识和推理过程。**


### `['CoT', 'Self consistency', 'ToT']`
#### `CoT: Chain of Thought`
思维链提示：
通过在提示中添加"让我们一步一步思考"，引导模型展示其推理过程，而不是直接给出答案。这种方法特别适用于解决复杂问题，如数学题、逻辑推理或多步骤任务。

**思维链提示和少样本提示结合，往往可以让大模型快速学习到当前问题的解题思路。**

例如：
```
问题：如果一本书的价格是15元，打八折后又减5元，最终价格是多少？
让我们一步一步思考：
1. 原价是15元
2. 打八折后价格是15 × 0.8 = 12元
3. 再减5元后价格是12 - 5 = 7元
4. 所以最终价格是7元
```

#### `Self consistency`
自洽性提示：
通过让大模型生成多条不同的思维链路径，然后从中选择最一致或最常见的答案，提高推理准确性。这种技术结合了集成学习的思想，减少了单一推理路径可能带来的错误。

工作流程：
1. 使用CoT生成多个不同的推理路径（通常通过调高temperature参数）
2. 对每条路径得到的结果进行分析
3. 选择出现频率最高的答案作为最终结果

在多个答案中选择出现次数最多的答案作为最终结果，往往能让大模型在推理过程中更加准确。

#### `ToT: Tree of Thoughts`
思维树提示：
将思维链扩展为树状结构，模型在每一步都会探索多个可能的思考分支，然后评估这些分支的质量，选择最佳路径继续推理。这种方法适用于需要规划和探索不同可能性的复杂问题。

工作流程：
1. 将问题分解为多个思考步骤
2. 在每个步骤，生成多个可能的"思考"
3. 评估每个思考的价值
4. 基于评估结果选择最佳路径继续，或回溯到先前节点尝试不同路径
5. 最终选择最优路径得出结论

> 需要阅读其他笔记，这部分以后再补充。

---------


### `['ReAct', 'APE']`
#### `ReAct: Reasoning + Acting`
推理与行动结合提示：
将思维链与行动交织在一起的框架，允许模型在思考的同时执行操作（如搜索信息、使用工具等），然后基于这些操作结果继续推理。特别适合需要外部信息或工具的复杂任务。

工作流程：
1. **思考**：分析当前情况和需要解决的问题
2. **行动**：执行必要的操作（如搜索、计算等）
3. **观察**：获取操作的结果
4. **继续思考**：基于新信息更新推理

#### `APE: Automatic Prompt Engineering`
自动提示工程：
使用大模型自身来优化提示词的方法。通过让模型生成、评估和改进提示词，来找到对特定任务最有效的提示。这是一种元级别的应用，模型不仅用于解决问题，还用于找到最佳的问题表述方式。

工作流程：
1. 初始提示生成：创建候选提示集合
2. 提示评估：测试每个提示的效果
3. 提示优化：根据评估结果改进提示
4. 迭代：重复以上步骤，直到找到最优提示

这种方法可以发现人类可能没有想到的有效提示策略，提高模型在特定任务上的表现。

---------
## 为什么 Prompt Engineering 是 **Engineering**？
首先定义什么是 **Engineering**。

**Engineering** 是应用科学和数学原理来设计、构建和维护结构、机器和系统的实践。

Prompt Engineering 同样需要经过设计、优化、迭代的过程。虽然大模型会出现幻觉，或者多次询问答案不一，但是经过统计学的分析，往往可以找到最优的提示策略。这个过程需要大量的实验和数据分析，所以同样是 **Engineering**。

