---
title: 'A First Look at Jev: A Few Small Decisions'
date: 2026-09-20 18:00:00
lang: en
translationKey: jev-first-look
tags: [Jev, LLM, Search, Rerank, Evaluation]
categories: [技术笔记, AI与大模型]
toc: true
---

After getting access to the Jev API, I wanted to try two small tasks: choosing how to handle an input, and scoring a set of candidate documents. Beyond the numbers, the most memorable part turned out to be a response header I had missed.

These are first impressions. Only sanitized aggregate results are included. The example is constructed separately; real queries, source documents, business prompts, and system configuration are omitted. This is not a production model recommendation.

<!-- more -->

<PostLanguageSwitch
  current="en"
  english-path="/posts/jev-first-look-en"
  chinese-path="/posts/jev-first-look-zh"
/>

## What Comes Back?

Some model calls answer a very small question: which path should this input take? How relevant is this document?

Jev exposes these judgments as explicit API types. According to [TypeSafe's introduction](https://docs.typesafe.ai/introduction), it accepts a `state` and a set of `questions`, then returns structured results. There are three main types:

|Type|What you can ask|What comes back|
|---|---|---|
|Choice|Which option should I pick?|A choice, probabilities, and confidence|
|Score|What score fits this rubric?|A score, probabilities, and confidence|
|Noul|Does this statement hold?|A probability between 0 and 1|

I mainly tried the first two. Both fit directly into branching or sorting code. Returning a valid option does not, of course, make the judgment correct.

This is a **constructed request example**, not an input from the test set:

```json
{
  "model": "jev-1.13.0",
  "state": {
    "query": "History of the fictional Aurora mission"
  },
  "questions": {
    "presentation": {
      "type": "choice",
      "instructions": "Choose the most useful presentation for this query.",
      "criteria": {
        "timeline": "A sequence of dated events explaining one evolving story.",
        "topics": "An overview organized into themes."
      }
    }
  }
}
```

The endpoint is `POST https://api.typesafe.ai/v1/systemone`. The example uses the tested version, `jev-1.13.0`, rather than treating a model alias as a fixed version.

## Two Small Experiments

The first task was choosing a presentation: a sequence of events, or an overview organized into topics.

I prepared 60 inputs: 20 with a timeline reference, 20 with a topic reference, and 20 without a definite reference. The two labeled groups were deliberately equal in size, so always choosing the majority class could not produce an impressive-looking score.

These references were proposed by an assistant before the calls and had not been reviewed by a human. Agreement with them is not the same thing as accuracy.

|Recorded in this run|Jev|
|---|---:|
|Inputs matching the proposed reference|39 / 40|
|Mean complete request time, including network|About 0.31 seconds|

The other 20 inputs were not scored as right or wrong. If the intended behavior is unresolved, the reference should not be invented after seeing the output.

The second task was reranking: keep the candidate set fixed, ask for each document's relevance, and sort by the returned scores. I used Score here; **the caller performs the sorting**.

```text
Query + fixed candidate documents
                |
                v
One Score question per document
                |
                v
Receive document scores in one request
                |
                v
Sort the candidates in application code
```

This run covered 18 queries with 30 candidate documents each. Jev's complete requests averaged about 0.70 seconds. Only 16 groups were usable for the quality calculation, and the relevance references were AI-generated. I did not treat this as evidence that Jev could replace a dedicated reranker.

The two tasks used different inputs. The 0.31-second and 0.70-second figures cannot tell us how much latency an additional question adds. That would require a separate comparison holding the input fixed.

## How Much of Those 0.70 Seconds Was Model Work?

Initially, I recorded elapsed time on the client and saved the response body.

Later, I noticed another field in the response headers:

```http
x-envoy-upstream-service-time: 177
```

I repeated the request for the same set of 30 documents three times. These are the recorded values, including the first call:

|Call|Reported upstream service time|Complete client time|
|---|---:|---:|
|1|177 ms|1,648 ms|
|2|213 ms|1,065 ms|
|3|179 ms|1,003 ms|

The mean upstream service time for these calls was about **190 ms**. This is three observations of one input, not a new general performance benchmark. These calls also do not provide a timing breakdown of the earlier 18 requests.

The name matters: **upstream service time is not pure inference time.**

[Envoy defines this header](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-upstream-service-time) as upstream request processing time plus network latency between Envoy and the upstream host. It helps exclude the client-to-gateway portion, but does not isolate GPU computation, queueing, or other processing.

```text
Client ───────── Gateway ───────── Upstream service
         Network          Internal network + processing
                        └── Header timing scope ──────┘
└──────────── Complete client request time ────────────┘
```

What I can say is: **these three calls reported 177–213 ms of upstream service time.** I cannot turn that into “Jev needs only 190 ms for inference,” or compare it against another model's total request time including network.

For the next test, I will retain both timings. Raw headers may also contain request identifiers and other metadata; saving only the required timing field is enough.

## Where I Want to Try It Next

The calls I want to explore further are small decisions with short outputs that happen frequently: selecting a route, scoring relevance, or deciding whether another step is needed.

Choice and Score make the input and output contracts explicit. The judgment criteria still need to be written, and the references still need validation. For reranking in particular, sorting the scores means the integration works; whether the order matches a person's search intent requires another check.

My next step would be a review with model names hidden: put the first few results from two rankings side by side and inspect the actual content. For timing, I would record client elapsed time and upstream service time separately. Those two checks would answer more of my current questions than another series of decimal places.

---

Test date: September 20, 2026. This is a small exploratory exercise using purposive sampling, with no inference to production traffic. Aggregate values are actual measurements; the sanitized example is not presented as a measured input. Raw data is not published with this post.
