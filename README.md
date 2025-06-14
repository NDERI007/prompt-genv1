This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# Prompt Rewriter App (Flan-T5-Powered)

This is a simple prompt rewriting app powered by the `flan-t5-base` model from Hugging Face. It allows users to enter a text instruction and receive rephrased variations of it using natural language generation. The frontend is built with **Next.js**, and the backend uses **Python (Flask)** to run inference on the Flan-T5 model.

---

## 💡 Purpose

The goal was to evaluate and build a lightweight, usable interface for rewriting instructional prompts — useful in educational tools, FAQs, or productivity apps.

---

## 🧪 Testing Summary

### ✅ What Worked Well:

- **Flan-T5** was best suited for **general instruction prompts** like:
  - “How to cook pasta?”
  - “Explain how the internet works.”
- Rephrasing often worked if the input was a clear instruction.
- Results tended to be **concise and readable**.

### ⚠️ Observed Behavior:

- When the prompt **included verbs like "explain" or "give"**, the model tended to **answer the question instead of rephrasing** it.
  - For example:  
    `Prompt: Explain how to fly a plane`  
    → The model might generate short _answers_ like “Fly it with a screw” or “Use your hands to steer” instead of rewording the instruction.
- There were cases where the model **ignored rephrasing intent** and shifted into generative completion (i.e. _answering_ the question).
- It was **unclear whether punctuation (like question marks)** influenced these outputs — this was **not tested in depth**.

---

## 🧠 Key Takeaways

- **Best Use Case:** Rewriting clear, imperative instructions or short directives.
- **Limitation:** Weak performance when asked to rephrase questions beginning with “explain,” “give,” or similar — model tries to _respond_ instead.
- **Future Improvements:** Add pre-processing logic to enforce the rephrasing pattern more reliably (e.g., using a wrapped prompt like `Rephrase this instruction:`).

---

## 🚧 Dev Notes

- The app supports saving favorite rewrites (stored in Supabase).
- Export-to-CSV and visualization features are being considered.
- Frontend and backend will be deployed separately

---

## 📦 Stack

- **Frontend**: Next.js 14 + TailwindCSS
- **Backend**: Python + Flask + Hugging Face Transformers (`flan-t5-base`)
- **Database**: Supabase (for user favorites)
- **Deployment**: Not yet sure

---

## 👤 Author Notes

This project was built for learning, experimentation, and to explore the behavior of language models when tasked with controlled rewriting. Further evaluation and tuning may be required for more domain-specific rewriting (e.g., legal, technical, academic).
