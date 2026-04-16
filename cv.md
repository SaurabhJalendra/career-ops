---
last_updated: 2026-04-16
renders_to: [cv.tex, cv.pdf]
---

# Saurabh Jalendra

## Contact

- Email: saurabhjalendra@gmail.com
- Phone: +91-9783982649
- Location: Jaipur, India (open to relocate)
- LinkedIn: https://www.linkedin.com/in/saurabh-jalendra/
- GitHub: https://github.com/SaurabhJalendra
- Website: https://saurabhjalendra.com

## Research Interests

Reinforcement learning, world models, scientific simulation and discovery, symbolic regression, multimodal learning, LLM agents

## Education

### Birla Institute of Technology and Science, Pilani — M.Tech in AI/ML (Jun 2024 – Mar 2026)

- **Dissertation:** Quantum-Enhanced Simulation Learning for RL
- **Coursework:** Deep Reinforcement Learning, Computer Vision, NLP, Probabilistic Graphical Models, Graph Neural Networks

### NMIMS, Mumbai — MBA in Banking and Finance (Jan 2022 – Jan 2024)

### Government Engineering College, Bikaner — B.Tech in Computer Science Engineering (May 2013 – May 2017)

## Experience

### Co-Founder & AI Lead — SKY AI, Jaipur (Oct 2024 – Present)

- Built **Klares**: Document intelligence platform for Hong Kong finance with DDQ autofill (LlamaIndex RAG for filling unfilled DDQs using scoped documents), SBERT document categorization, vector-based knowledge base (pgvector + cross-encoder re-ranking), and AI-extracted compliance reminders with email notifications.
- Led development of **International Citizen**: AI-powered portfolio management platform with automated statement extraction, multi-currency aggregation, and conversational AI assistant for global investors.

### Research Intern — ISRO (National Remote Sensing Centre), Jodhpur (Feb 2017 – Jun 2017)

- Developed VR heritage visualization application using Unity deployed on Oculus Rift and HTC Vive platforms.
- Built photogrammetry pipeline with Meshroom generating high-fidelity 3D models from aerial drone imagery.

## Selected Projects

### Simulating Anything — [GitHub](https://github.com/SaurabhJalendra/Simulating-Anything) (Feb 2026 – Present)

- Domain-agnostic scientific discovery pipeline: natural language query → simulation → RSSM world model (JAX/Equinox) → symbolic regression → human-interpretable equations.
- Implemented 187 simulation domains across physics, biology, and chemistry; PySR/SINDy recovered known physical laws with R² ≥ 0.999 on 11/14 core domains (mean R² = 0.970).
- 570 cross-domain mathematical isomorphisms detected across 125 mathematical equivalence classes.

### Quantum-Enhanced Simulation Learning for RL — [GitHub](https://github.com/SaurabhJalendra/Quantum-Enhanced-Simulation-Learning-for-Reinforcement-Learning) (Nov 2025 – Feb 2026)

- M.Tech dissertation (defended) comparing quantum-inspired vs classical training for DreamerV3-style world models.
- Implemented 4 quantum-inspired methods (tunneling optimizer, superposition buffer, entanglement layer, interference ensemble) benchmarked against classical baseline across 8 environments: CartPole, Pendulum, Walker-walk, Cheetah-run, Reacher-easy/hard, Pong, Breakout.
- Interference Ensemble achieved 36–47% reduction in world model prediction MSE on DMControl robotics (Walker, Cheetah, Reacher-easy/hard; p<0.008, Mann-Whitney U with Bonferroni correction); 200 experiments across 5 methods × 5 seeds × 8 environments.

### Multimodal Gravitational Lensing Classification — [GitHub](https://github.com/SaurabhJalendra/GravitationalLens-MultimodalDL) (Mar 2025)

- Built multimodal architecture based on Neural Computing and Applications (2023): 4-block CNN (4-channel, 45×45 images) + 2-layer LSTM (14-step light curves) with late-fusion classification head; 722K trainable parameters.
- Trained on 20K DES-deep survey samples across 4 balanced gravitational lensing classes; 76% F1 on non-lens detection.

### Analyst Coder-Agent — [GitHub](https://github.com/SaurabhJalendra/Analyst_agentic_coder) (Nov 2025)

- Autonomous LLM agent with tool calling (file ops, code search, git, reporting) via FastAPI + React + Claude 3.5 Sonnet; plan-approval safety workflow with JWT auth, PostgreSQL session persistence, and Docker Compose deployment (4 services).

### CT-MRI Fusion with Cross-Modal Attention — [GitHub](https://github.com/SaurabhJalendra/Fusion-model-for-CT-and-MRI-data) (Oct 2025)

- Dual-branch ResNet50 fusion model with cross-modal attention gates for integrating CT and MRI imaging data; trained on 4,974 images with mixed-precision optimization (FP16 + TF32) on NVIDIA RTX 4050.

### GNN Link Prediction on OGB-Collab — [GitHub](https://github.com/SaurabhJalendra/Link-prediction-for-ogbl-collab-dataset) (Sep 2025)

- Benchmarked GCN, GraphSAGE, and GAT on the ogbl-collab dataset (235K nodes, 2.3M edges); GCN achieved best Hits@50 of 5.59% using official OGB evaluation with 100K negative samples per edge.

## Technical Skills

- **Languages:** Python, JavaScript/TypeScript, SQL
- **ML/DL:** PyTorch, JAX/Equinox/Optax, TensorFlow/Keras, scikit-learn, PySR/PySINDy, Gymnasium, DMControl, OpenCV
- **LLM/NLP:** LangChain, LlamaIndex, Hugging Face, SBERT, Claude API, Gemini API, OpenRouter, RAG pipelines
- **Web/Backend:** FastAPI, Node.js, Next.js, React, Streamlit, PostgreSQL, Redis, SQLite
- **Cloud/DevOps:** AWS (S3, EC2, RDS), GCP, Docker, GitHub Actions, CI/CD
- **AI Dev Tools:** Claude Code (agent orchestration, skill authoring, MCP servers), GitHub Copilot
